import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { findTask } from '@/modules/ai-tasks/service';
import { fetchPrivateR2Object } from '@/modules/storage/service';
import { extractStoredImageUrls } from '@/lib/ai-image-results';
import { respErr } from '@/lib/resp';

const UPSTREAM_TIMEOUT_MS = 15_000;
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;

const PREVIEW_ERROR_HEADERS = {
  // A completed task can briefly be visible before its preview handler (or
  // backing object) is ready. Browsers are permitted to cache a 404, which
  // would make that transient state look permanent for a generated figure.
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
};

function previewError(message: string, status: number) {
  return respErr(message, {
    status,
    headers: PREVIEW_ERROR_HEADERS,
  });
}

/**
 * Returns one generated image only after proving that its task belongs to the
 * signed-in user. This avoids exposing provider links directly in the UI
 * while deliberately not acting as a general-purpose URL proxy.
 */
async function GET({
  request,
  params,
}: {
  request: Request;
  params: { id: string; index: string };
}) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return previewError('Unauthorized', 401);

  const imageIndex = Number(params.index);
  if (!Number.isInteger(imageIndex) || imageIndex < 0 || imageIndex > 9) {
    return previewError('Invalid image index', 400);
  }

  const task = await findTask(params.id);
  if (!task || task.userId !== session.user.id || task.provider !== 'evolink') {
    return previewError('Image task not found', 404);
  }

  const sourceUrl = getImageUrl(task.taskResult, imageIndex);
  if (!sourceUrl) return previewError('Generated image is unavailable', 404);

  let upstreamUrl: URL;
  try {
    upstreamUrl = new URL(sourceUrl);
    if (upstreamUrl.protocol !== 'https:' && upstreamUrl.protocol !== 'http:') {
      return previewError('Unsupported image source', 422);
    }
  } catch {
    return previewError('Invalid image source', 422);
  }

  const abortController = new AbortController();
  const timeout = setTimeout(
    () => abortController.abort(),
    UPSTREAM_TIMEOUT_MS
  );
  try {
    const upstreamHeaders = {
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    };
    // Stored images use a private R2 S3 endpoint when no public domain is
    // configured. Sign only known bucket URLs; all other provider URLs keep
    // using a normal upstream request.
    const upstream =
      (await fetchPrivateR2Object(upstreamUrl, {
        signal: abortController.signal,
        headers: upstreamHeaders,
      })) ??
      (await fetch(upstreamUrl, {
        signal: abortController.signal,
        headers: upstreamHeaders,
      }));
    if (!upstream.ok) {
      return previewError(
        'Generated image source is temporarily unavailable',
        502
      );
    }

    const contentType = upstream.headers.get('content-type') ?? '';
    if (!contentType.toLowerCase().startsWith('image/')) {
      return previewError('Generated result is not an image', 415);
    }
    const contentLength = Number(upstream.headers.get('content-length') ?? '0');
    if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) {
      return previewError('Generated image is too large to preview', 413);
    }

    const download = new URL(request.url).searchParams.get('download') === '1';
    const filename = filenameFromUrl(upstreamUrl, imageIndex, contentType);
    const headers = new Headers({
      'Content-Type': contentType,
      'Cache-Control': 'private, max-age=3600',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${filename}"`,
      'X-Content-Type-Options': 'nosniff',
    });
    const length = upstream.headers.get('content-length');
    if (length) headers.set('Content-Length', length);

    return new Response(upstream.body, { headers });
  } catch (error) {
    if (abortController.signal.aborted) {
      return previewError('Generated image preview timed out', 504);
    }
    console.error('Generated image preview failed:', error);
    return previewError('Generated image preview is unavailable', 502);
  } finally {
    clearTimeout(timeout);
  }
}

function getImageUrl(taskResult: string | null | undefined, index: number) {
  return extractStoredImageUrls(taskResult)[index] ?? null;
}

function filenameFromUrl(url: URL, index: number, contentType: string) {
  const candidate = url.pathname
    .split('/')
    .pop()
    ?.replace(/[^a-zA-Z0-9._-]/g, '');
  if (candidate && candidate.length <= 120) return candidate;
  const extension = contentType.includes('png')
    ? 'png'
    : contentType.includes('webp')
      ? 'webp'
      : contentType.includes('jpeg')
        ? 'jpg'
        : 'img';
  return `scidrawer-figure-${index + 1}.${extension}`;
}

export const Route = createFileRoute('/api/ai/images/$id/preview/$index')({
  server: { handlers: { GET } },
});
