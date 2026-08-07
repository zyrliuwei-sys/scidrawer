import {
  AIConfigs,
  AIFile,
  AIGenerateParams,
  AIImage,
  AIMediaType,
  AIProvider,
  AITaskResult,
  AITaskStatus,
  SaveFilesFunction,
  UuidFunction,
} from './types';

const DEFAULT_BASE_URL = 'https://api.evolink.ai';
export const EVOLINK_GPT_IMAGE_2_MODEL = 'gpt-image-2';

const defaultUuid: UuidFunction = () => crypto.randomUUID();

export interface EvolinkImageOptions {
  size?: string;
  resolution?: '1K' | '2K' | '4K';
  quality?: 'low' | 'medium' | 'high';
  n?: number;
  image_urls?: string[];
  mask_url?: string;
}

export interface EvolinkConfigs extends AIConfigs {
  apiKey: string;
  baseUrl?: string;
  customStorage?: boolean;
  saveFiles?: SaveFilesFunction;
  uuid?: UuidFunction;
}

type EvolinkTask = {
  id?: string;
  status?: string;
  progress?: number;
  model?: string;
  created?: number;
  results?: unknown;
  error?: string | { message?: string; code?: string };
  message?: string;
  task_info?: { estimated_time?: number };
};

/**
 * EvoLink's asynchronous GPT Image 2 provider.
 *
 * Docs: https://docs.evolink.ai/en/quickstart
 */
export class EvolinkProvider implements AIProvider {
  readonly name = 'evolink';
  configs: EvolinkConfigs;

  constructor(configs: EvolinkConfigs) {
    this.configs = configs;
  }

  private get baseUrl() {
    return (this.configs.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
  }

  private getUuid() {
    return (this.configs.uuid || defaultUuid)();
  }

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.configs.apiKey}`,
    };
  }

  async generate({
    params,
  }: {
    params: AIGenerateParams;
  }): Promise<AITaskResult> {
    if (params.mediaType !== AIMediaType.IMAGE) {
      throw new Error('EvoLink GPT Image 2 only supports image generation');
    }
    if (!params.prompt?.trim()) throw new Error('prompt is required');

    const model = params.model || EVOLINK_GPT_IMAGE_2_MODEL;
    if (model !== EVOLINK_GPT_IMAGE_2_MODEL) {
      throw new Error(`Unsupported EvoLink model: ${model}`);
    }

    const options = (params.options || {}) as EvolinkImageOptions;
    const payload: Record<string, unknown> = {
      model,
      prompt: params.prompt,
    };

    if (options.size) payload.size = options.size;
    if (options.resolution) payload.resolution = options.resolution;
    if (options.quality) payload.quality = options.quality;
    if (options.n) payload.n = options.n;
    if (options.image_urls?.length) payload.image_urls = options.image_urls;
    if (options.mask_url) payload.mask_url = options.mask_url;
    if (params.callbackUrl) payload.callback_url = params.callbackUrl;

    const response = await fetch(`${this.baseUrl}/v1/images/generations`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify(payload),
    });
    const data = (await response.json().catch(() => ({}))) as EvolinkTask;
    if (!response.ok) throw new Error(getEvolinkError(data, response.status));
    if (!data.id) throw new Error('EvoLink did not return a task ID');

    return {
      taskStatus: this.mapStatus(data.status),
      taskId: data.id,
      taskInfo: { status: data.status },
      taskResult: data,
    };
  }

  async query({
    taskId,
    mediaType,
  }: {
    taskId: string;
    mediaType?: AIMediaType;
  }): Promise<AITaskResult> {
    if (mediaType && mediaType !== AIMediaType.IMAGE) {
      throw new Error('EvoLink GPT Image 2 only supports image generation');
    }

    const response = await fetch(
      `${this.baseUrl}/v1/tasks/${encodeURIComponent(taskId)}`,
      { method: 'GET', headers: this.headers() }
    );
    const data = (await response.json().catch(() => ({}))) as EvolinkTask;
    if (!response.ok) throw new Error(getEvolinkError(data, response.status));

    const taskStatus = this.mapStatus(data.status);
    let images = this.toImages(data.results, data.created);

    if (
      taskStatus === AITaskStatus.SUCCESS &&
      this.configs.customStorage &&
      images.length > 0
    ) {
      images = await this.saveImages(images);
    }

    return {
      taskId,
      taskStatus,
      taskInfo: {
        images,
        status: data.status,
        errorCode:
          typeof data.error === 'object' ? (data.error.code ?? '') : '',
        errorMessage:
          typeof data.error === 'string'
            ? data.error
            : (data.error?.message ?? data.message ?? ''),
        createTime: data.created ? new Date(data.created * 1000) : undefined,
      },
      taskResult: data,
    };
  }

  private mapStatus(status?: string): AITaskStatus {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'queued':
        return AITaskStatus.PENDING;
      case 'processing':
      case 'running':
        return AITaskStatus.PROCESSING;
      case 'completed':
      case 'succeeded':
      case 'success':
        return AITaskStatus.SUCCESS;
      case 'failed':
      case 'error':
        return AITaskStatus.FAILED;
      case 'cancelled':
      case 'canceled':
        return AITaskStatus.CANCELED;
      default:
        // Preserve polling compatibility if EvoLink adds a new in-progress
        // status instead of failing user requests on an unknown value.
        return AITaskStatus.PROCESSING;
    }
  }

  private toImages(results: unknown, created?: number): AIImage[] {
    if (!Array.isArray(results)) return [];
    const createTime = created ? new Date(created * 1000) : new Date();

    return results
      .map((result) => {
        const imageUrl =
          typeof result === 'string'
            ? result
            : typeof result === 'object' && result
              ? String(
                  (result as { url?: string; image_url?: string }).url ||
                    (result as { image_url?: string }).image_url ||
                    ''
                )
              : '';
        return imageUrl ? { imageUrl, createTime } : null;
      })
      .filter((image): image is AIImage => image !== null);
  }

  private async saveImages(images: AIImage[]): Promise<AIImage[]> {
    if (!this.configs.saveFiles) return images;

    const files: AIFile[] = images.flatMap((image, index) => {
      if (!image.imageUrl) return [];
      return [
        {
          url: image.imageUrl,
          contentType: contentTypeFor(image.imageUrl),
          key: `evolink/image/${this.getUuid()}${extensionFor(image.imageUrl)}`,
          index,
          type: 'image',
        },
      ];
    });
    if (!files.length) return images;

    try {
      const saved = await this.configs.saveFiles(files);
      for (const file of saved || []) {
        if (file.url && file.index !== undefined && images[file.index]) {
          images[file.index].imageUrl = file.url;
        }
      }
    } catch (error) {
      // The original EvoLink URLs remain usable for 24 hours if storage fails.
      console.error('EvoLink result persistence failed:', error);
    }
    return images;
  }
}

function getEvolinkError(data: EvolinkTask, status: number): string {
  if (typeof data.error === 'string') return data.error;
  if (data.error?.message) return data.error.message;
  if (data.message) return data.message;
  return `EvoLink request failed (${status})`;
}

function extensionFor(url: string): string {
  try {
    const extension = new URL(url).pathname.match(/\.(png|jpe?g|webp)$/i)?.[0];
    return extension || '.png';
  } catch {
    return '.png';
  }
}

function contentTypeFor(url: string): string {
  const extension = extensionFor(url).toLowerCase();
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
  if (extension === '.webp') return 'image/webp';
  return 'image/png';
}
