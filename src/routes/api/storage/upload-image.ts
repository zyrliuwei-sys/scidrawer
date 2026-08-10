import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { envConfigs } from '@/config';
import { getAllConfigs } from '@/modules/config/service';
import {
  createReferenceImageProxyUrl,
  getStorage,
} from '@/modules/storage/service';
import { md5 } from '@/lib/hash';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

const extFromMime = (mimeType: string) => {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
    'image/heic': 'heic',
    'image/heif': 'heif',
  };
  return map[mimeType] || '';
};

// Cap for the no-storage local-disk fallback (dev). Configurable via INLINE_IMAGE_MAX_KB.
const INLINE_MAX_BYTES =
  (Number(envConfigs.inline_image_max_kb) || 10240) * 1024;
const REFERENCE_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
const REFERENCE_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);
const MAX_REFERENCE_IMAGE_COUNT = 16;

async function POST({ request }: { request: Request }) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 1000,
    keyPrefix: 'upload-image',
  });
  if (limited) return limited;

  try {
    const isReferenceUpload =
      new URL(request.url).searchParams.get('purpose') === 'reference';

    // Guests can prepare reference images before committing to a generation.
    // All other upload use cases remain authenticated, and the client opens
    // its sign-in dialog if a guest tries to generate.
    if (!isReferenceUpload) {
      const auth = getAuth();
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user) return respErr('Unauthorized');
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    if (!files.length) return respErr('No files provided');
    if (isReferenceUpload && files.length > MAX_REFERENCE_IMAGE_COUNT) {
      return respErr(
        `You can upload up to ${MAX_REFERENCE_IMAGE_COUNT} reference images at a time`
      );
    }
    const storage = await getStorage();
    const storageConfigs = await getAllConfigs();
    const origin = new URL(request.url).origin;
    const makeResultUrl = async (url: string, key: string) => {
      if (!isReferenceUpload) {
        return { url, publiclyAccessible: undefined };
      }

      // Prefer an R2 custom domain when configured. This stays publicly
      // reachable even while a developer is using the app on localhost.
      if (storage && hasPublicHttpUrl(storageConfigs.r2_domain)) {
        const publicUrl = storage.getPublicUrl({ key });
        if (publicUrl) return { url: publicUrl, publiclyAccessible: true };
      }

      // Without an R2 custom domain, a private bucket can still be exposed
      // through a one-hour signed app URL — but only when this app itself has
      // a public origin. An upstream provider can never fetch localhost.
      const proxyUrl = storage
        ? await createReferenceImageProxyUrl({ origin, key })
        : new URL(url, origin).toString();
      if (!proxyUrl || !isPubliclyReachableUrl(proxyUrl)) {
        throw new Error(
          'Reference images require a publicly accessible URL. Configure an R2 Public Domain in Admin → Storage, then upload again.'
        );
      }
      return { url: proxyUrl, publiclyAccessible: true };
    };
    const uploadResults: Array<{
      url: string;
      key: string;
      filename: string;
      deduped: boolean;
      publiclyAccessible?: boolean;
    }> = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        return respErr(`File ${file.name} is not an image`);
      }
      if (isReferenceUpload && !REFERENCE_IMAGE_TYPES.has(file.type)) {
        return respErr(
          `Reference image ${file.name} must be JPG, PNG, WebP, or GIF`
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const body = new Uint8Array(arrayBuffer);
      if (isReferenceUpload && body.length > REFERENCE_IMAGE_MAX_BYTES) {
        return respErr(
          `Reference image ${file.name} must be smaller than 10MB`
        );
      }

      const digest = md5(body);
      const ext =
        (extFromMime(file.type) || file.name.split('.').pop() || 'bin').replace(
          /[^a-zA-Z0-9]/g,
          ''
        ) || 'bin';
      // R2Provider prepends its own uploadPath (default `uploads`), so the object
      // key is the bare filename. The local fallback uses `public/uploads/<file>`.
      const objectKey = `${digest}.${ext}`;

      // No storage configured → persist to public/uploads and return a short
      // local URL. Avoids inlining a giant base64 data URL into DB columns (some
      // are varchar(255)). Configure R2 (admin → Storage) for production.
      if (!storage) {
        if (body.length > INLINE_MAX_BYTES) {
          const limitKb = Math.round(INLINE_MAX_BYTES / 1024);
          return respErr(
            `Image too large (${(body.length / 1024).toFixed(0)}KB > ${limitKb}KB). Configure storage or use a smaller image.`
          );
        }
        const dir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(dir, { recursive: true });
        await writeFile(path.join(dir, objectKey), body);
        const resultUrl = await makeResultUrl(
          `/uploads/${objectKey}`,
          objectKey
        );
        uploadResults.push({
          url: resultUrl.url,
          key: `uploads/${objectKey}`,
          filename: file.name,
          deduped: false,
          publiclyAccessible: resultUrl.publiclyAccessible,
        });
        continue;
      }

      const exists = await storage.exists({ key: objectKey });
      if (exists) {
        const publicUrl = storage.getPublicUrl({ key: objectKey });
        if (publicUrl) {
          const resultUrl = await makeResultUrl(publicUrl, objectKey);
          uploadResults.push({
            url: resultUrl.url,
            key: objectKey,
            filename: file.name,
            deduped: true,
            publiclyAccessible: resultUrl.publiclyAccessible,
          });
          continue;
        }
      }

      const result = await storage.uploadFile({
        body,
        key: objectKey,
        contentType: file.type,
        disposition: 'inline',
      });

      if (!result.success || !result.url) {
        return respErr(result.error || 'Upload failed');
      }

      const resultUrl = await makeResultUrl(
        result.url,
        result.key || objectKey
      );
      uploadResults.push({
        url: resultUrl.url,
        key: result.key || objectKey,
        filename: file.name,
        deduped: false,
        publiclyAccessible: resultUrl.publiclyAccessible,
      });
    }

    return respData({
      urls: uploadResults.map((r) => r.url),
      results: uploadResults,
    });
  } catch (e: any) {
    console.error('upload image failed:', e);
    return respErr(e?.message || 'upload image failed');
  }
}

function hasPublicHttpUrl(value: string | undefined): boolean {
  try {
    const url = new URL(value || '');
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isPubliclyReachableUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return false;

    const hostname = url.hostname.toLowerCase();
    return !(
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '127.0.0.1' ||
      hostname === '::1'
    );
  } catch {
    return false;
  }
}

export const Route = createFileRoute('/api/storage/upload-image')({
  server: {
    handlers: { POST },
  },
});
