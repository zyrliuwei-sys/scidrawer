import { R2Provider, StorageManager } from '@/core/storage';
import { getAllConfigs, type ConfigMap } from '@/modules/config/service';

/**
 * Storage config is DB-driven (like auth/payment/email): values come from the
 * admin "Storage" settings, merged over env via getAllConfigs(). Keys mirror the
 * original ShipAny Two (`r2_*`).
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
