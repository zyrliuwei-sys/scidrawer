import { envConfigs } from '@/config';

function isLocalOrigin(value: string): boolean {
  try {
    const hostname = new URL(value).hostname;
    return (
      hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
    );
  } catch {
    return true;
  }
}

function originFromForwardedHeaders(request: Request): string | undefined {
  const host = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  if (!host || /[^a-zA-Z0-9.:[\]-]/.test(host)) return undefined;

  const protocol =
    request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() || 'https';
  if (protocol !== 'http' && protocol !== 'https') return undefined;

  try {
    return new URL(`${protocol}://${host}`).origin;
  } catch {
    return undefined;
  }
}

/**
 * Resolve the public origin for documents containing absolute URLs. Prefer
 * the request host or a trusted proxy host, so production documents never
 * advertise the localhost fallback from the development environment.
 */
export function getRequestOrigin(request: Request): string {
  const requestOrigin = new URL(request.url).origin;
  if (!isLocalOrigin(requestOrigin)) return requestOrigin;

  const forwardedOrigin = originFromForwardedHeaders(request);
  if (forwardedOrigin && !isLocalOrigin(forwardedOrigin))
    return forwardedOrigin;

  if (!isLocalOrigin(envConfigs.app_url))
    return new URL(envConfigs.app_url).origin;

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelHost) return `https://${vercelHost}`;

  return requestOrigin;
}
