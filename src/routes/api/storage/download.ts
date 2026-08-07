import { createFileRoute } from '@tanstack/react-router';

import { respErr } from '@/lib/resp';

/**
 * GET /api/storage/download?url=<encoded>&name=<file>
 *
 * Streams a remote URL back to the client with `Content-Disposition:
 * attachment` so the browser saves the file instead of navigating to it.
 *
 * Useful for remote CDN URLs (e.g. R2/S3 public URLs) that don't ship a
 * proper Content-Disposition header — the preview panel builds these links
 * so users can download generated figures.
 */
async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const target = url.searchParams.get('url');
  const name = url.searchParams.get('name') ?? 'download';

  if (!target) return respErr('Missing url');

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return respErr('Invalid url');
  }

  // Only allow http(s) — block file://, javascript:, data:, etc.
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return respErr('Unsupported protocol');
  }

  const safeName = name.replace(/[\r\n"]/g, '').slice(0, 200) || 'download';

  try {
    const upstream = await fetch(parsed.href, {
      // Don't forward the user's auth headers to a third-party CDN.
      headers: { Accept: '*/*' },
    });
    if (!upstream.ok) {
      return respErr(`Upstream returned ${upstream.status}`);
    }

    const body = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get('content-type') ?? 'application/octet-stream';

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${safeName}"`,
        'Content-Length': String(body.byteLength),
        'Cache-Control': 'no-store',
      },
    });
  } catch (e: any) {
    return respErr(e?.message || 'Download failed');
  }
}

export const Route = createFileRoute('/api/storage/download')({
  server: { handlers: { GET } },
});
