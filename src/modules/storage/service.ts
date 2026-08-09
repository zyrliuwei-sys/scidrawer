import { R2Provider, StorageManager } from '@/core/storage';
import { envConfigs } from '@/config';
import { getAllConfigs, type ConfigMap } from '@/modules/config/service';

const REFERENCE_URL_TTL_MS = 60 * 60 * 1000;
const REFERENCE_KEY_PATTERN = /^[a-f0-9]{32}\.[a-z0-9]{1,10}$/i;

/**
 * Storage config is DB-driven (like auth/payment/email): values come from the
 * admin "Storage" settings, merged over env via getAllConfigs(). Keys mirror the
 * original provider keys (`r2_*`).
 */
function isConfigured(configs: ConfigMap): boolean {
  return Boolean(
    configs.r2_access_key && configs.r2_secret_key && configs.r2_bucket_name
  );
}

function buildManager(configs: ConfigMap): StorageManager {
  const manager = new StorageManager();
  manager.addProvider(
    new R2Provider({
      accountId: configs.r2_account_id || '',
      accessKeyId: configs.r2_access_key as string,
      secretAccessKey: configs.r2_secret_key as string,
      bucket: configs.r2_bucket_name as string,
      uploadPath: configs.r2_upload_path,
      region: 'auto',
      endpoint: configs.r2_endpoint, // optional custom endpoint
      publicDomain: configs.r2_domain,
    }),
    true
  );
  return manager;
}

export async function isStorageConfigured(): Promise<boolean> {
  return isConfigured(await getAllConfigs());
}

/**
 * Returns a configured StorageManager, or null when storage is not configured
 * (caller should fall back to local/inline handling).
 */
export async function getStorage(): Promise<StorageManager | null> {
  const configs = await getAllConfigs();
  if (!isConfigured(configs)) return null;
  return buildManager(configs);
}

/**
 * Fetch an object from this app's private R2 bucket. Public R2 domains are
 * fetched normally; this is only for the S3-compatible endpoint URLs that
 * are returned when no public domain has been configured.
 *
 * The endpoint and bucket checks are deliberately strict so this helper
 * cannot be used to sign arbitrary third-party requests.
 */
export async function fetchPrivateR2Object(
  url: URL,
  options: { signal?: AbortSignal; headers?: HeadersInit } = {}
): Promise<Response | null> {
  const configs = await getAllConfigs();
  if (!isConfigured(configs)) return null;

  const endpoint =
    configs.r2_endpoint ||
    (configs.r2_account_id
      ? `https://${configs.r2_account_id}.r2.cloudflarestorage.com`
      : '');
  if (!endpoint) return null;

  let storageEndpoint: URL;
  try {
    storageEndpoint = new URL(endpoint);
  } catch {
    return null;
  }

  const bucketPrefix = `/${configs.r2_bucket_name}/`;
  if (
    url.origin !== storageEndpoint.origin ||
    !url.pathname.startsWith(bucketPrefix)
  ) {
    return null;
  }

  const { AwsClient } = await import('aws4fetch');
  const client = new AwsClient({
    accessKeyId: configs.r2_access_key,
    secretAccessKey: configs.r2_secret_key,
    region: 'auto',
  });
  return client.fetch(
    new Request(url, {
      method: 'GET',
      headers: options.headers,
      signal: options.signal,
    })
  );
}

/**
 * Make a short-lived, unguessable app URL for an uploaded reference image.
 * EvoLink fetches this URL without browser cookies; the matching API route
 * verifies the HMAC before it signs the private R2 request.
 */
export async function createReferenceImageProxyUrl(options: {
  origin: string;
  key: string;
}): Promise<string | null> {
  if (!REFERENCE_KEY_PATTERN.test(options.key) || !envConfigs.auth_secret) {
    return null;
  }

  let origin: URL;
  try {
    origin = new URL(options.origin);
    if (origin.protocol !== 'https:' && origin.protocol !== 'http:') {
      return null;
    }
  } catch {
    return null;
  }

  const payload = toBase64Url(
    new TextEncoder().encode(
      JSON.stringify({
        key: options.key,
        expiresAt: Date.now() + REFERENCE_URL_TTL_MS,
      })
    )
  );
  const signature = await signReferencePayload(payload);
  return new URL(
    `/api/storage/reference/${payload}.${signature}`,
    origin.origin
  ).toString();
}

/** Validates a short-lived reference proxy token and returns its object key. */
export async function readReferenceImageProxyToken(
  token: string
): Promise<{ key: string } | null> {
  const [payload, signature, ...rest] = token.split('.');
  if (!payload || !signature || rest.length > 0 || !envConfigs.auth_secret) {
    return null;
  }

  try {
    const key = await referenceSigningKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(signature),
      new TextEncoder().encode(payload)
    );
    if (!valid) return null;

    const decoded = JSON.parse(
      new TextDecoder().decode(fromBase64Url(payload))
    ) as { key?: unknown; expiresAt?: unknown };
    if (
      typeof decoded.key !== 'string' ||
      !REFERENCE_KEY_PATTERN.test(decoded.key) ||
      typeof decoded.expiresAt !== 'number' ||
      decoded.expiresAt < Date.now()
    ) {
      return null;
    }
    return { key: decoded.key };
  } catch {
    return null;
  }
}

/** Fetches a known uploaded key from the private R2 bucket. */
export async function fetchPrivateR2Key(
  key: string,
  options: { signal?: AbortSignal; headers?: HeadersInit } = {}
): Promise<Response | null> {
  if (!REFERENCE_KEY_PATTERN.test(key)) return null;
  const configs = await getAllConfigs();
  if (!isConfigured(configs)) return null;

  const endpoint =
    configs.r2_endpoint ||
    `https://${configs.r2_account_id}.r2.cloudflarestorage.com`;
  const uploadPath = (configs.r2_upload_path || 'uploads')
    .replace(/^\/+|\/+$/g, '')
    .replace(/\/+/g, '/');
  const objectUrl = new URL(
    `/${configs.r2_bucket_name}/${uploadPath}/${key}`,
    endpoint.endsWith('/') ? endpoint : `${endpoint}/`
  );
  return fetchPrivateR2Object(objectUrl, options);
}

async function signReferencePayload(payload: string): Promise<string> {
  const key = await referenceSigningKey();
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(payload)
  );
  return toBase64Url(new Uint8Array(signature));
}

async function referenceSigningKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(envConfigs.auth_secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
