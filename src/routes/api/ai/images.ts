import { createFileRoute } from '@tanstack/react-router';

import {
  EVOLINK_GPT_IMAGE_2_MODEL,
  EvolinkProvider,
  type EvolinkImageOptions,
} from '@/core/ai/evolink';
import { AIMediaType, AITaskStatus, type AIFile } from '@/core/ai/types';
import { getAuth } from '@/core/auth';
import {
  attachProviderTask,
  createTask,
  getTasks,
  updateTask,
} from '@/modules/ai-tasks/service';
import { getAllConfigs, type ConfigMap } from '@/modules/config/service';
import { getStorage } from '@/modules/storage/service';
import { extractStoredImageUrls } from '@/lib/ai-image-results';
import {
  calculateImageCreditCost,
  resolveImageBillingResolution,
} from '@/lib/image-credit-cost';
import { imageQueue } from '@/lib/queue';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

const RATIO_SIZES = new Set([
  '1:1',
  '1:2',
  '2:1',
  '1:3',
  '3:1',
  '3:4',
  '4:3',
  '9:16',
  '16:9',
]);
const RESOLUTIONS = new Set(['1K', '2K', '4K']);
const QUALITIES = new Set(['low', 'medium', 'high']);

type ImageGenerationRequest = {
  prompt?: unknown;
  model?: unknown;
  size?: unknown;
  resolution?: unknown;
  quality?: unknown;
  n?: unknown;
  image_urls?: unknown;
  mask_url?: unknown;
};

type PersistedImageTask = {
  id: string;
  prompt: string;
  model: string;
  createdAt: Date;
  options: string | null;
  taskResult: string | null;
};

/**
 * Lists completed figures for the signed-in user. Results live in `ai_task`
 * already, so history survives a refresh, a new browser session, and opening
 * the generator on another device.
 */
async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const searchParams = new URL(request.url).searchParams;
    const rawLimit = Number(searchParams.get('limit') ?? '24');
    const limit = Number.isInteger(rawLimit)
      ? Math.min(Math.max(rawLimit, 1), 100)
      : 24;
    const rawPage = Number(searchParams.get('page') ?? '1');
    const page = Number.isInteger(rawPage) ? Math.max(rawPage, 1) : 1;
    const tasks = await getTasks({
      userId: session.user.id,
      mediaType: AIMediaType.IMAGE,
      status: AITaskStatus.SUCCESS,
      page,
      // One extra row gives the client a reliable "load more" signal without
      // separately counting every historic task.
      limit: limit + 1,
    });
    const hasMore = tasks.length > limit;

    return respData({
      items: tasks
        .slice(0, limit)
        .flatMap((task) => toHistoryImages(task as PersistedImageTask)),
      hasMore,
      nextPage: hasMore ? page + 1 : null,
    });
  } catch (error) {
    console.error('Failed to load image history:', error);
    return respErr(errorMessage(error));
  }
}

/**
 * Starts an EvoLink GPT Image 2 task. This route is the only code path that
 * reads `evolink_api_key`, so the API key never reaches the browser.
 */
async function POST({ request }: { request: Request }) {
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 2_000,
    keyPrefix: 'evolink-image-generation',
  });
  if (limited) return limited;

  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const body = (await request
      .json()
      .catch(() => ({}))) as ImageGenerationRequest;
    const configs = await getAllConfigs();
    const validation = validateRequest(body, configs);
    if ('error' in validation) return respErr(validation.error);

    const provider = await createEvolinkProvider(configs);
    const costCredits = calculateImageCreditCost({
      resolution: resolveImageBillingResolution({
        size: validation.options.size,
        resolution: validation.options.resolution,
      }),
      quality: validation.options.quality,
      referenceCount: validation.options.image_urls?.length ?? 0,
      count: validation.count,
    });
    const task = await createTask({
      userId: session.user.id,
      mediaType: AIMediaType.IMAGE,
      provider: provider.name,
      model: EVOLINK_GPT_IMAGE_2_MODEL,
      prompt: validation.prompt,
      // The price scales with quality, pixel tier, reference inputs, and the
      // requested output count. Credits are refunded automatically if the
      // provider task later fails (see `revoke()` in @/modules/credits).
      costCredits,
      options: validation.options,
    });

    try {
      // Serialize generation submissions so concurrent users don't slam the
      // upstream provider at the same moment and trigger its rate limits.
      const result = await imageQueue.enqueue(() =>
        provider.generate({
          params: {
            mediaType: AIMediaType.IMAGE,
            model: EVOLINK_GPT_IMAGE_2_MODEL,
            prompt: validation.prompt,
            options: validation.options,
            async: true,
          },
        })
      );

      await attachProviderTask({
        taskId: task.id,
        providerTaskId: result.taskId,
        taskResult: result.taskResult,
      });

      return respData({
        id: task.id,
        providerTaskId: result.taskId,
        // Keep EvoLink's status vocabulary (`pending`, `processing`,
        // `completed`, `failed`) so the client can consume the provider's
        // documented task shape directly.
        status: readEvolinkStatus(result.taskResult, result.taskStatus),
        taskStatus: result.taskStatus,
        progress: readProgress(result.taskResult),
        estimatedTime: readEstimatedTime(result.taskResult),
      });
    } catch (error) {
      await updateTask({
        taskId: task.id,
        status: AITaskStatus.FAILED,
        taskResult: { error: errorMessage(error) },
      });
      throw error;
    }
  } catch (error) {
    console.error('EvoLink image generation failed:', error);
    return respErr(errorMessage(error));
  }
}

export const Route = createFileRoute('/api/ai/images')({
  server: { handlers: { GET, POST } },
});

function toHistoryImages(task: PersistedImageTask) {
  const options = parseJsonObject(task.options);
  const imageUrls = extractStoredImageUrls(task.taskResult);
  const referenceCount = Array.isArray(options.image_urls)
    ? options.image_urls.length
    : 0;

  return imageUrls.map((src, index) => ({
    id: `${task.id}:${index}`,
    src,
    prompt: task.prompt,
    model: task.model,
    createdAt: task.createdAt.toISOString(),
    aspect: typeof options.size === 'string' ? options.size : 'auto',
    referenceCount,
  }));
}

function parseJsonObject(value: unknown): Record<string, unknown> {
  if (!value) return {};

  if (typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  if (typeof value !== 'string') return {};

  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export async function createEvolinkProvider(configs?: ConfigMap) {
  const resolvedConfigs = configs ?? (await getAllConfigs());
  if (!resolvedConfigs.evolink_api_key) {
    throw new Error('EvoLink API key is not configured');
  }

  const storage = await getStorage();
  return new EvolinkProvider({
    apiKey: resolvedConfigs.evolink_api_key,
    customStorage: Boolean(storage),
    saveFiles: storage
      ? async (files: AIFile[]) => {
          const saved: AIFile[] = [];
          for (const file of files) {
            const result = await storage.downloadAndUpload({
              url: file.url,
              key: file.key,
              contentType: file.contentType,
              disposition: 'inline',
            });
            if (result.success && result.url) {
              saved.push({ ...file, url: result.url });
            }
          }
          return saved;
        }
      : undefined,
  });
}

export function readProgress(result: unknown): number {
  if (!result || typeof result !== 'object') return 0;
  const progress = (result as { progress?: unknown }).progress;
  return typeof progress === 'number'
    ? Math.max(0, Math.min(100, progress))
    : 0;
}

export function readEstimatedTime(result: unknown): number | null {
  if (!result || typeof result !== 'object') return null;
  const estimatedTime = (result as { task_info?: { estimated_time?: unknown } })
    .task_info?.estimated_time;
  return typeof estimatedTime === 'number' ? estimatedTime : null;
}

export function readEvolinkStatus(result: unknown, fallback: string): string {
  if (!result || typeof result !== 'object') return fallback;
  const status = (result as { status?: unknown }).status;
  return typeof status === 'string' && status ? status : fallback;
}

function validateRequest(
  body: ImageGenerationRequest,
  configs: ConfigMap
):
  | { prompt: string; count: number; options: EvolinkImageOptions }
  | { error: string } {
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) return { error: 'A prompt is required' };
  if ([...prompt].length > 32_000) {
    return { error: 'The prompt cannot exceed 32,000 characters' };
  }
  if (body.model !== undefined && body.model !== EVOLINK_GPT_IMAGE_2_MODEL) {
    return { error: 'Only the gpt-image-2 model is supported' };
  }

  const size = typeof body.size === 'string' ? body.size : 'auto';
  if (!isValidSize(size)) return { error: 'Invalid image size' };

  const resolution =
    typeof body.resolution === 'string' ? body.resolution : '1K';
  if (!RESOLUTIONS.has(resolution)) return { error: 'Invalid resolution' };

  const quality = typeof body.quality === 'string' ? body.quality : 'medium';
  if (!QUALITIES.has(quality)) return { error: 'Invalid generation quality' };

  const n = body.n === undefined ? 1 : Number(body.n);
  if (!Number.isInteger(n) || n < 1 || n > 10) {
    return { error: 'Generate between 1 and 10 images at a time' };
  }

  const imageUrls = validateUrls(body.image_urls, 16, 'reference images');
  if ('error' in imageUrls) return imageUrls;
  if (usesPrivateR2Url(imageUrls.urls, configs)) {
    return {
      error:
        'Reference images require a publicly accessible URL. Configure an R2 Public Domain in Admin → Storage, then upload again.',
    };
  }
  const maskUrl = validateOptionalUrl(body.mask_url, 'mask URL');
  if ('error' in maskUrl) return maskUrl;
  if (maskUrl.url && imageUrls.urls.length === 0) {
    return { error: 'A mask requires at least one reference image' };
  }

  return {
    prompt,
    // Credit deduction must equal the number of images produced. `n=4` means
    // 4 generations billed at the resolution rate.
    count: n,
    options: {
      size,
      // EvoLink ignores resolution when `size` is `auto` or explicit pixels;
      // passing it through keeps one canonical request shape for every mode.
      resolution: resolution as EvolinkImageOptions['resolution'],
      quality: quality as EvolinkImageOptions['quality'],
      n,
      image_urls: imageUrls.urls.length ? imageUrls.urls : undefined,
      mask_url: maskUrl.url,
    },
  };
}

/**
 * R2's S3-compatible endpoint is private even though it has an https URL.
 * Reject it before it is sent to EvoLink, which otherwise only reports a
 * vague image-processing error after the provider has tried to fetch it.
 */
function usesPrivateR2Url(urls: string[], configs: ConfigMap): boolean {
  if (hasValidHttpUrl(configs.r2_domain)) return false;
  if (!configs.r2_account_id || !configs.r2_bucket_name) return false;

  const endpoint =
    configs.r2_endpoint ||
    `https://${configs.r2_account_id}.r2.cloudflarestorage.com`;
  let privateEndpoint: URL;
  try {
    privateEndpoint = new URL(endpoint);
  } catch {
    return false;
  }

  const bucketPrefix = `/${configs.r2_bucket_name}/`;
  return urls.some((value) => {
    try {
      const url = new URL(value);
      return (
        url.origin === privateEndpoint.origin &&
        url.pathname.startsWith(bucketPrefix)
      );
    } catch {
      return false;
    }
  });
}

function hasValidHttpUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

function isValidSize(size: string): boolean {
  if (size === 'auto' || RATIO_SIZES.has(size)) return true;
  const match = /^(\d{1,4})x(\d{1,4})$/.exec(size);
  if (!match) return false;
  const width = Number(match[1]);
  const height = Number(match[2]);
  const pixels = width * height;
  return (
    width % 16 === 0 &&
    height % 16 === 0 &&
    width <= 3840 &&
    height <= 3840 &&
    pixels >= 655_360 &&
    pixels <= 8_294_400 &&
    Math.max(width, height) / Math.min(width, height) <= 3
  );
}

function validateUrls(
  input: unknown,
  max: number,
  label: string
): { urls: string[] } | { error: string } {
  if (input === undefined) return { urls: [] };
  if (!Array.isArray(input) || input.length > max) {
    return { error: `You can upload up to ${max} ${label}` };
  }

  const urls: string[] = [];
  for (const value of input) {
    const result = validateOptionalUrl(value, label);
    if ('error' in result) return result;
    if (result.url) urls.push(result.url);
  }
  return { urls };
}

function validateOptionalUrl(
  value: unknown,
  label: string
): { url?: string } | { error: string } {
  if (value === undefined || value === null || value === '') return {};
  if (typeof value !== 'string') return { error: `Invalid ${label}` };
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return { error: `${label} must use http or https` };
    }
    return { url: url.href };
  } catch {
    return { error: `Invalid ${label} format` };
  }
}

function errorMessage(error: unknown): string {
  if (!(error instanceof Error)) return 'Image generation failed';
  if (error.message === 'Insufficient credits')
    return 'Insufficient credits. Please purchase more credits and try again.';
  if (error.message === 'Task not found') return 'Task not found';
  if (error.message === 'Image task not found') return 'Image task not found';
  if (error.message === 'Image task is missing its provider ID') {
    return 'Image task is missing its provider ID';
  }
  return error.message || 'Image generation failed';
}
