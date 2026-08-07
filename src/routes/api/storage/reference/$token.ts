import { createFileRoute } from '@tanstack/react-router';

import {
  fetchPrivateR2Key,
  readReferenceImageProxyToken,
} from '@/modules/storage/service';

const MAX_REFERENCE_IMAGE_BYTES = 10 * 1024 * 1024;

/**
 * Public, token-protected source for a private R2 reference image. It is used
 * only by the image provider, which cannot send the user's session cookie.
 */
async function GET({ params }: { params: { token: string } }) {
  const reference = await readReferenceImageProxyToken(params.token);
  if (!reference)
    return new Response('Reference image link has expired', { status: 403 });

  try {
    const upstream = await fetchPrivateR2Key(reference.key, {
      headers: { Accept: 'image/*' },
    });
    if (!upstream?.ok) {
      return new Response('Reference image is unavailable', { status: 404 });
    }

    const contentType = upstream.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      return new Response('Reference source is not an image', { status: 415 });
    }
    const contentLength = Number(upstream.headers.get('content-length') ?? '0');
    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_REFERENCE_IMAGE_BYTES
    ) {
      return new Response('Reference image is too large', { status: 413 });
    }

    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    const length = upstream.headers.get('content-length');
    if (length) headers.set('Content-Length', length);
    return new Response(upstream.body, { headers });
  } catch (error) {
    console.error('Reference image proxy failed:', error);
    return new Response('Reference image is unavailable', { status: 502 });
  }
}

export const Route = createFileRoute('/api/storage/reference/$token')({
  server: { handlers: { GET } },
});
