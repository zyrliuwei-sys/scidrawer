import { useCallback, useEffect, useState } from 'react';

import { apiGetBlob } from '@/lib/api-client';

const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 700;

type ImagePreviewStatus = 'loading' | 'ready' | 'error';

/**
 * Load protected images as authenticated API requests and render them from a
 * local Blob URL. In Vite dev, `<img src="/api/...">` is treated as a static
 * image lookup and can return a false 404 before the API route is reached.
 */
export function useImagePreview(sourceUrl?: string) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<ImagePreviewStatus>('loading');
  const [retryNonce, setRetryNonce] = useState(0);

  const retry = useCallback(() => {
    setRetryNonce((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!sourceUrl) {
      setObjectUrl(null);
      setStatus('error');
      return;
    }

    const controller = new AbortController();
    let generatedUrl: string | null = null;

    const load = async () => {
      setObjectUrl(null);
      setStatus('loading');

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
        try {
          const cacheBust = `${sourceUrl}${
            sourceUrl.includes('?') ? '&' : '?'
          }preview_fetch=${retryNonce}-${attempt}`;
          const blob = await apiGetBlob(cacheBust, {
            signal: controller.signal,
          });
          if (controller.signal.aborted) return;

          generatedUrl = URL.createObjectURL(blob);
          setObjectUrl(generatedUrl);
          setStatus('ready');
          return;
        } catch {
          if (controller.signal.aborted) return;
          if (attempt === MAX_RETRIES) {
            setStatus('error');
            return;
          }
          await waitForRetry(controller.signal);
        }
      }
    };

    void load();
    return () => {
      controller.abort();
      if (generatedUrl) URL.revokeObjectURL(generatedUrl);
    };
  }, [sourceUrl, retryNonce]);

  return { objectUrl, status, retry };
}

function waitForRetry(signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const finish = () => {
      window.clearTimeout(timer);
      signal.removeEventListener('abort', finish);
      resolve();
    };
    const timer = window.setTimeout(finish, RETRY_DELAY_MS);
    signal.addEventListener('abort', finish, { once: true });
  });
}
