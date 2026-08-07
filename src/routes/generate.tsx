import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  Box,
  Check,
  ChevronDown,
  History,
  Image as ImageIcon,
  Loader2,
  Send,
  Wand2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { apiGet, apiPost, apiPostForm } from '@/lib/api-client';
import { getUuid } from '@/lib/hash';
import {
  calculateImageCreditCost,
  resolveImageBillingResolution,
} from '@/lib/image-credit-cost';
import { cn } from '@/lib/utils';
import { useImagePreview } from '@/hooks/use-image-preview';
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  SidebarLogo,
} from '@/components/acet-sidebar';
import {
  GenerationSession,
  type GenerationSessionCopy,
} from '@/components/generator/generation-session';
import {
  ImagePreviewPanel,
  type ImageHistoryCopy,
  type PreviewImage,
} from '@/components/image-preview-panel';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

import {
  generateReducer,
  GENERATION_TIMEOUT_MS,
  initialState,
} from './generate/-state';

const IMAGE_SIZES = ['auto', '1:1', '4:3', '3:4', '16:9', '9:16'] as const;
const RESOLUTIONS = ['1K', '2K', '4K'] as const;
const QUALITIES = ['low', 'medium', 'high'] as const;
const TASK_POLL_INTERVAL_MS = 1_200;
const REFERENCE_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
const REFERENCE_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MODELS = [
  {
    id: 'gpt-image-2',
    name: 'GPT Image 2',
  },
] as const;

// Aceternity-style nav links — only the active page (Generate) is
// shown. Examples / Showcases are reachable via in-page anchors on
// the main work area; Settings / Logout / Sign-in live outside the
// workspace chrome.
const NAV_LINKS = [
  { label: 'Generator', href: '/generate', icon: <Wand2 className="size-5" /> },
  {
    label: 'History',
    href: '#generation-history',
    icon: <History className="size-5" />,
  },
];

const HISTORY_PAGE_SIZE = 24;

const HISTORY_PANEL_COPY: ImageHistoryCopy = {
  imageCounter: (current, total) => `${current} of ${total}`,
  imageTotal: (total) => `${total} images`,
  download: 'Download image',
  expand: 'Expand preview panel',
  restore: 'Reset preview width',
  close: 'Close history',
  gallery: 'All images',
  preview: 'Back to preview',
  clear: 'Clear images',
  searchPlaceholder: 'Search prompts',
  allModels: 'All models',
  allAspects: 'All sizes',
  today: 'Today',
  yesterday: 'Yesterday',
  earlier: 'Earlier',
  untitled: 'Untitled scientific figure',
  noMatches: 'No matching images',
  loadMore: 'Load more',
  loadingMore: 'Loading',
  generated: 'Generated image',
  references: (count) => `${count} reference image${count === 1 ? '' : 's'}`,
  loading: 'Loading image preview…',
  unavailable: 'Image preview unavailable',
  dateLocale: 'en-US',
};

const SESSION_COPY: GenerationSessionCopy = {
  title: 'Figure generation',
  preparing: 'Preparing generation',
  rendering: 'Rendering figure',
  complete: 'Figure ready',
  failed: 'Generation timed out. Try again.',
  prompt: 'Prompt',
  image: 'Image',
  generatingOne: 'Generating one image',
  elapsed: 'Elapsed time',
  close: 'Back to editing',
  retry: 'Try again',
  regenerate: 'Regenerate',
  download: 'Download image',
  useAsReference: 'Use as reference',
  copyPrompt: 'Copy prompt',
  imageUnavailable: 'Generation timed out. Try again.',
  imageUnavailableHint:
    'The task is saved in your history. Please try again later.',
  renderingHint:
    'Your image is rendering in the background and will appear automatically.',
};

type GeneratedImage = PreviewImage & {
  createdAt: number;
  prompt: string;
  aspect: (typeof IMAGE_SIZES)[number];
  model: (typeof MODELS)[number]['name'];
  referenceCount: number;
};

type ReferenceImage = {
  id: string;
  name: string;
  url: string;
};

type ParameterMenu = 'aspect' | 'resolution' | 'quality' | 'model';

type UploadedImageResponse = {
  results: Array<{
    url: string;
    filename: string;
    /** Whether the upstream image provider can fetch this URL unauthenticated. */
    publiclyAccessible?: boolean;
  }>;
};

type EvoLinkImageResult =
  | string
  | {
      url?: unknown;
      image_url?: unknown;
      imageUrl?: unknown;
    };

type GenerationTaskResponse = {
  id: string;
  status:
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'canceled'
    | 'cancelled'
    // Compatibility with task rows created before the EvoLink response shape
    // was passed through to the browser.
    | 'success';
  taskStatus?: 'pending' | 'processing' | 'success' | 'failed' | 'canceled';
  progress: number;
  estimatedTime: number | null;
  /** Empty while EvoLink is rendering; populated only when the task succeeds. */
  results?: EvoLinkImageResult[];
  error?: string;
};

type GenerationHistoryResponse = {
  items: Array<{
    id: string;
    src: string;
    prompt: string;
    createdAt: string;
    aspect: string;
    model: string;
    referenceCount: number;
  }>;
  hasMore: boolean;
  nextPage: number | null;
};

type ActiveGenerationSession = {
  taskId: string;
  prompt: string;
  aspect: (typeof IMAGE_SIZES)[number];
  resolution: (typeof RESOLUTIONS)[number];
  quality: (typeof QUALITIES)[number];
  model: (typeof MODELS)[number]['name'];
  references: ReferenceImage[];
  startedAt: number;
  progress: number;
  estimatedTime: number | null;
};

const ACTIVE_GENERATION_STORAGE_KEY = 'scidrawer.active-image-generation.v1';

async function pollTask(
  taskId: string,
  signal: AbortSignal,
  onUpdate: (task: GenerationTaskResponse) => void,
  startedAt = Date.now()
) {
  while (!signal.aborted) {
    const response = await apiGet<GenerationTaskResponse>(
      `/api/ai/images/${encodeURIComponent(taskId)}`,
      { signal }
    );
    // EvoLink's task endpoint legitimately returns `results: []` while a
    // request is processing. Normalize its completed shapes before updating
    // the UI, and only mark the session done once an actual image URL exists.
    const task: GenerationTaskResponse = {
      ...response,
      results: extractEvolinkImageUrls(response.results),
    };
    onUpdate(task);

    if (isSuccessfulTask(task)) {
      if ((task.results?.length ?? 0) > 0) return;
      // A terminal response without a URL can occur briefly while the
      // provider writes its output. Keep polling instead of replacing the
      // successful task with an erroneous empty preview.
      if (Date.now() - startedAt >= GENERATION_TIMEOUT_MS) {
        throw new Error('EvoLink completed without returning an image URL');
      }
      await waitForNextPoll(TASK_POLL_INTERVAL_MS, signal);
      continue;
    }
    if (isFailedTask(task)) {
      throw new Error(task.error || 'EvoLink image generation failed');
    }
    if (Date.now() - startedAt >= GENERATION_TIMEOUT_MS) {
      throw new Error(
        'Image generation timed out. Please check your task history and retry.'
      );
    }
    // Polling does not change provider render time, but keeping this short
    // avoids leaving a finished result hidden behind an extra 2–3 second wait.
    await waitForNextPoll(TASK_POLL_INTERVAL_MS, signal);
  }
}

function extractEvolinkImageUrls(
  results: EvoLinkImageResult[] | undefined
): string[] {
  if (!Array.isArray(results)) return [];

  return results.flatMap((result) => {
    const value =
      typeof result === 'string'
        ? result
        : (result?.url ?? result?.image_url ?? result?.imageUrl);
    return typeof value === 'string' && /^https?:\/\//i.test(value.trim())
      ? [value.trim()]
      : [];
  });
}

function isSuccessfulTask(task: GenerationTaskResponse) {
  return (
    task.status === 'completed' ||
    task.status === 'success' ||
    task.taskStatus === 'success'
  );
}

function isFailedTask(task: GenerationTaskResponse) {
  return (
    task.status === 'failed' ||
    task.status === 'canceled' ||
    task.status === 'cancelled' ||
    task.taskStatus === 'failed' ||
    task.taskStatus === 'canceled'
  );
}

const GENERATION_RETRY_DELAY_MS = 2_000;

/**
 * Run a request up to twice with a fixed delay between attempts. Surfaces the
 * last error if both attempts fail. Used to ride out a single transient
 * upstream blip without making the user retry manually.
 */
async function retryRequest<T>(run: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      lastError = error;
      if (attempt === 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, GENERATION_RETRY_DELAY_MS)
        );
      }
    }
  }
  throw lastError;
}

function readActiveGenerationSession(): ActiveGenerationSession | null {
  try {
    const parsed = JSON.parse(
      window.sessionStorage.getItem(ACTIVE_GENERATION_STORAGE_KEY) ?? ''
    ) as Partial<ActiveGenerationSession>;
    if (
      !parsed ||
      typeof parsed.taskId !== 'string' ||
      typeof parsed.prompt !== 'string' ||
      typeof parsed.startedAt !== 'number' ||
      !IMAGE_SIZES.includes(parsed.aspect as (typeof IMAGE_SIZES)[number]) ||
      !RESOLUTIONS.includes(
        parsed.resolution as (typeof RESOLUTIONS)[number]
      ) ||
      !QUALITIES.includes(parsed.quality as (typeof QUALITIES)[number]) ||
      !MODELS.some((candidate) => candidate.name === parsed.model)
    ) {
      return null;
    }
    return {
      taskId: parsed.taskId,
      prompt: parsed.prompt,
      aspect: parsed.aspect as (typeof IMAGE_SIZES)[number],
      resolution: parsed.resolution as (typeof RESOLUTIONS)[number],
      quality: parsed.quality as (typeof QUALITIES)[number],
      model: parsed.model as (typeof MODELS)[number]['name'],
      references: Array.isArray(parsed.references)
        ? parsed.references.filter(isReferenceImage)
        : [],
      startedAt: parsed.startedAt,
      progress:
        typeof parsed.progress === 'number'
          ? Math.max(0, Math.min(100, parsed.progress))
          : 0,
      estimatedTime:
        typeof parsed.estimatedTime === 'number' ? parsed.estimatedTime : null,
    };
  } catch {
    return null;
  }
}

function isReferenceImage(value: unknown): value is ReferenceImage {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<ReferenceImage>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.url === 'string' &&
    /^https?:\/\//i.test(candidate.url)
  );
}

function persistActiveGenerationSession(session: ActiveGenerationSession) {
  window.sessionStorage.setItem(
    ACTIVE_GENERATION_STORAGE_KEY,
    JSON.stringify(session)
  );
}

function clearActiveGenerationSession() {
  window.sessionStorage.removeItem(ACTIVE_GENERATION_STORAGE_KEY);
}

function waitForNextPoll(milliseconds: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, milliseconds);
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer);
        reject(new DOMException('Polling aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}

function fileNameFromUrl(url: string) {
  try {
    const name = new URL(url).pathname.split('/').pop();
    return name || `evolink-${getUuid()}.png`;
  } catch {
    return `evolink-${getUuid()}.png`;
  }
}

function taskPreviewUrls(id: string, version?: string | number) {
  const match = /^(.*):(\d+)$/.exec(id);
  if (!match) return null;
  const base = `/api/ai/images/${encodeURIComponent(match[1])}/preview/${match[2]}`;
  const versionQuery = version
    ? `preview_version=${encodeURIComponent(String(version))}`
    : '';
  const previewUrl = versionQuery ? `${base}?${versionQuery}` : base;
  return {
    previewUrl,
    downloadUrl: `${base}?download=1${versionQuery ? `&${versionQuery}` : ''}`,
  };
}

function retryPreviewUrl(image: PreviewImage, retryToken: number) {
  if (!retryToken || !image.src.startsWith('/api/ai/images/')) return image;
  const separator = image.src.includes('?') ? '&' : '?';
  return {
    ...image,
    src: `${image.src}${separator}preview_retry=${retryToken}`,
  };
}

function asGeneratedImage(
  item: GenerationHistoryResponse['items'][number]
): GeneratedImage {
  const aspect = IMAGE_SIZES.includes(
    item.aspect as (typeof IMAGE_SIZES)[number]
  )
    ? (item.aspect as (typeof IMAGE_SIZES)[number])
    : 'auto';
  const createdAt = new Date(item.createdAt).getTime();
  const preview = taskPreviewUrls(item.id, item.createdAt);
  const model = MODELS.some((candidate) => candidate.name === item.model)
    ? (item.model as (typeof MODELS)[number]['name'])
    : MODELS[0].name;

  return {
    id: item.id,
    src: preview?.previewUrl ?? item.src,
    sourceUrl: item.src,
    downloadUrl: preview?.downloadUrl,
    name: fileNameFromUrl(item.src),
    prompt: item.prompt,
    createdAt: Number.isFinite(createdAt) ? createdAt : Date.now(),
    aspect,
    model,
    referenceCount: item.referenceCount,
  };
}

function mergeImages(
  recentImages: GeneratedImage[],
  historyImages: GeneratedImage[]
) {
  const seen = new Set<string>();
  return [...recentImages, ...historyImages].filter((image) => {
    // A task/image index is the stable history identity. URLs can differ
    // between the immediate provider response and the later private-storage
    // copy, so deduplicating by URL could show the same result twice.
    if (seen.has(image.id)) return false;
    seen.add(image.id);
    return true;
  });
}

function GeneratePage() {
  const { prompt: starterPrompt } = Route.useSearch();
  const [prompt, setPrompt] = useState(starterPrompt ?? '');
  const [aspect, setAspect] = useState<(typeof IMAGE_SIZES)[number]>('1:1');
  const [resolution, setResolution] =
    useState<(typeof RESOLUTIONS)[number]>('1K');
  // Match the provider's balanced default and the published one-credit rate.
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>('medium');
  const [model, setModel] =
    useState<(typeof MODELS)[number]['name']>('GPT Image 2');
  const [openParameterMenu, setOpenParameterMenu] =
    useState<ParameterMenu | null>(null);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [isUploadingReferences, setIsUploadingReferences] = useState(false);
  // Sidebar state — collapsible (Aceternity style). Currently the page is
  // always rendered as the "Generate" workspace, so the active link is fixed
  // to `/generate`.
  const [open, setOpen] = useState(true);
  // Fresh results appear immediately. Completed results from previous visits
  // are loaded from the user's persisted task history below.
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewRetryToken, setPreviewRetryToken] = useState(0);
  // The state machine keeps the real provider task visible while it runs.
  const [genState, dispatchGen] = useReducer(generateReducer, initialState);
  // Start with the history canvas closed so the workspace is unobstructed.
  // It opens automatically when a preview is available (generation completes,
  // history thumbnail clicked, etc.).
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const pollingAbortRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();
  const historyQuery = useInfiniteQuery({
    queryKey: ['ai-image-history'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      apiGet<GenerationHistoryResponse>(
        `/api/ai/images?limit=${HISTORY_PAGE_SIZE}&page=${pageParam}`
      ),
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 30_000,
  });
  const historyImages = useMemo(
    () =>
      historyQuery.data?.pages.flatMap((page) =>
        page.items.map(asGeneratedImage)
      ) ?? [],
    [historyQuery.data]
  );
  const images = useMemo(
    () => mergeImages(recentImages, historyImages),
    [recentImages, historyImages]
  );

  useEffect(() => {
    if (starterPrompt) setPrompt(starterPrompt);
  }, [starterPrompt]);

  const completeTask = (
    taskId: string,
    currentTask: GenerationTaskResponse,
    session: Pick<
      ActiveGenerationSession,
      'prompt' | 'aspect' | 'model' | 'references'
    >
  ) => {
    const source = extractEvolinkImageUrls(currentTask.results)[0];
    if (!source) {
      throw new Error('EvoLink completed without returning an image');
    }
    const createdAt = Date.now();
    const preview = taskPreviewUrls(`${taskId}:0`, createdAt);
    const newImage: GeneratedImage = {
      id: `${taskId}:0`,
      src: preview?.previewUrl ?? source,
      sourceUrl: source,
      downloadUrl: preview?.downloadUrl,
      name: fileNameFromUrl(source),
      createdAt,
      prompt: session.prompt,
      aspect: session.aspect,
      model: session.model,
      referenceCount: session.references.length,
    };
    setRecentImages((previous) => [newImage, ...previous]);
    setActiveImageId(newImage.id);
    // Keep the user in the completion view instead of opening the history
    // drawer over it, especially on narrow screens where it behaves as a
    // modal and looks like an unexpected navigation.
    queryClient.invalidateQueries({ queryKey: ['ai-image-history'] });
    clearActiveGenerationSession();
    dispatchGen({ type: 'succeed', image: newImage });
    toast.success('Image generated');
  };

  // Tick the timer once per second while generating — used by the
  // progress overlay for the elapsed-time + countdown display.
  useEffect(() => {
    if (genState.status !== 'generating') return;
    const id = window.setInterval(
      () => dispatchGen({ type: 'tick', now: Date.now() }),
      1000
    );
    return () => window.clearInterval(id);
  }, [genState.status]);
  useEffect(
    () => () => {
      pollingAbortRef.current?.abort();
    },
    []
  );
  useEffect(() => {
    const activeSession = readActiveGenerationSession();
    if (!activeSession) return;

    if (Date.now() - activeSession.startedAt >= GENERATION_TIMEOUT_MS) {
      clearActiveGenerationSession();
      toast.error('Your previous generation timed out. Please generate again.');
      return;
    }

    setPrompt(activeSession.prompt);
    setAspect(activeSession.aspect);
    setResolution(activeSession.resolution);
    setQuality(activeSession.quality);
    setModel(activeSession.model);
    setReferenceImages(activeSession.references);
    setIsGenerating(true);
    dispatchGen({
      type: 'resume',
      jobId: activeSession.taskId,
      startedAt: activeSession.startedAt,
      progress: activeSession.progress,
      estimatedTime: activeSession.estimatedTime,
    });

    const controller = new AbortController();
    pollingAbortRef.current = controller;
    toast.message('Resumed your in-progress generation');
    void pollTask(
      activeSession.taskId,
      controller.signal,
      (currentTask) => {
        const nextSession = {
          ...activeSession,
          progress: currentTask.progress,
          estimatedTime: currentTask.estimatedTime,
        };
        persistActiveGenerationSession(nextSession);
        dispatchGen({
          type: 'task-progress',
          progress: currentTask.progress,
          estimatedTime: currentTask.estimatedTime,
        });
        if (
          isSuccessfulTask(currentTask) &&
          extractEvolinkImageUrls(currentTask.results).length > 0
        ) {
          completeTask(activeSession.taskId, currentTask, nextSession);
        }
      },
      activeSession.startedAt
    )
      .catch((error) => {
        if (controller.signal.aborted) return;
        const message =
          error instanceof Error ? error.message : 'Image generation failed';
        // A failed terminal task cannot become healthy by refreshing the page.
        // Remove it so the next page load starts with a usable generator.
        clearActiveGenerationSession();
        dispatchGen({
          type: 'fail',
          error: { kind: 'network', message, retryable: true },
        });
        toast.error(message);
      })
      .finally(() => {
        if (pollingAbortRef.current === controller) {
          pollingAbortRef.current = null;
        }
        if (!controller.signal.aborted) setIsGenerating(false);
      });
  }, []);
  useEffect(() => {
    if (images.length === 0) return;
    setActiveImageId((current) =>
      current && images.some((image) => image.id === current)
        ? current
        : images[0].id
    );
  }, [images]);
  const hasGeneratedImages = images.length > 0;
  const previewImages = images;
  const activePreviewId = activeImageId;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit =
    prompt.trim().length >= 3 && !isGenerating && !isUploadingReferences;
  const generationCreditCost = calculateImageCreditCost({
    resolution: resolveImageBillingResolution({ size: aspect, resolution }),
    quality,
    referenceCount: referenceImages.length,
  });

  const handleReferenceImages = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    if (selectedFiles.length === 0) return;
    // Reset so the same file can be selected again after being removed.
    event.target.value = '';

    const unsupportedFile = selectedFiles.find(
      (file) => !REFERENCE_IMAGE_TYPES.has(file.type)
    );
    if (unsupportedFile) {
      toast.error('Reference images must be JPG, PNG, WebP, or GIF.');
      return;
    }
    const oversizedFile = selectedFiles.find(
      (file) => file.size > REFERENCE_IMAGE_MAX_BYTES
    );
    if (oversizedFile) {
      toast.error('Reference images must be smaller than 10MB.');
      return;
    }

    const remainingSlots = 16 - referenceImages.length;
    if (remainingSlots <= 0) {
      toast.error('You can add up to 16 reference images.');
      return;
    }
    const files = selectedFiles.slice(0, remainingSlots);
    if (files.length < selectedFiles.length) {
      toast.message(
        `Only the first ${remainingSlots} reference images were uploaded.`
      );
    }

    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    setIsUploadingReferences(true);
    try {
      const uploaded = await apiPostForm<UploadedImageResponse>(
        '/api/storage/upload-image?purpose=reference',
        form
      );
      const publiclyReachable = uploaded.results.filter(
        (image) =>
          image.publiclyAccessible === true && /^https?:\/\//i.test(image.url)
      );
      if (publiclyReachable.length !== uploaded.results.length) {
        toast.error(
          'Reference images need a publicly accessible URL. Configure an R2 Public Domain in Admin → Storage.'
        );
      }
      if (publiclyReachable.length > 0) {
        setReferenceImages((current) => [
          ...current,
          ...publiclyReachable.map((image) => ({
            id: getUuid(),
            name: image.filename,
            url: image.url,
          })),
        ]);
        toast.success(
          `Uploaded ${publiclyReachable.length} reference image${publiclyReachable.length === 1 ? '' : 's'}`
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Reference upload failed'
      );
    } finally {
      setIsUploadingReferences(false);
    }
  };

  const removeReferenceImage = (id: string) => {
    setReferenceImages((current) => current.filter((image) => image.id !== id));
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    // Capture the submitted configuration so edits made during generation do
    // not alter the result record that is added to history.
    const submittedPrompt = prompt.trim();
    const submittedAspect = aspect;
    const submittedModel = model;
    const submittedReferences = referenceImages;
    const controller = new AbortController();
    pollingAbortRef.current?.abort();
    pollingAbortRef.current = controller;

    setIsGenerating(true);
    dispatchGen({ type: 'submit' });

    try {
      const task = await retryRequest(() =>
        apiPost<GenerationTaskResponse>('/api/ai/images', {
          model: 'gpt-image-2',
          prompt: submittedPrompt,
          size: submittedAspect,
          resolution,
          quality,
          n: 1,
          image_urls: referenceImages.map((image) => image.url),
        })
      );
      const activeSession: ActiveGenerationSession = {
        taskId: task.id,
        prompt: submittedPrompt,
        aspect: submittedAspect,
        resolution,
        quality,
        model: submittedModel,
        references: submittedReferences,
        startedAt: Date.now(),
        progress: task.progress,
        estimatedTime: task.estimatedTime,
      };
      persistActiveGenerationSession(activeSession);
      dispatchGen({
        type: 'task-created',
        jobId: task.id,
        progress: task.progress,
        estimatedTime: task.estimatedTime,
        startedAt: activeSession.startedAt,
      });
      await pollTask(task.id, controller.signal, (currentTask) => {
        const nextSession: ActiveGenerationSession = {
          ...activeSession,
          progress: currentTask.progress,
          estimatedTime: currentTask.estimatedTime,
        };
        persistActiveGenerationSession(nextSession);
        dispatchGen({
          type: 'task-progress',
          progress: currentTask.progress,
          estimatedTime: currentTask.estimatedTime,
        });
        if (
          isSuccessfulTask(currentTask) &&
          extractEvolinkImageUrls(currentTask.results).length > 0
        ) {
          completeTask(task.id, currentTask, nextSession);
        }
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      const message =
        error instanceof Error ? error.message : 'Image generation failed';
      clearActiveGenerationSession();
      dispatchGen({
        type: 'fail',
        error: { kind: 'network', message, retryable: true },
      });
      toast.error(message);
    } finally {
      if (pollingAbortRef.current === controller) {
        pollingAbortRef.current = null;
      }
      if (!controller.signal.aborted) setIsGenerating(false);
    }
  };

  const selectPreviewImage = (id: string) => {
    setActiveImageId(id);
  };

  const useGeneratedImageAsReference = (image: PreviewImage) => {
    const sourceUrl = image.sourceUrl;
    if (!sourceUrl || !/^https?:\/\//i.test(sourceUrl)) {
      toast.error('This image is not available as a public reference image.');
      return;
    }
    setReferenceImages((current) =>
      current.some((reference) => reference.url === sourceUrl)
        ? current
        : [
            ...current,
            {
              id: getUuid(),
              name: image.name ?? fileNameFromUrl(sourceUrl),
              url: sourceUrl,
            },
          ]
    );
    dispatchGen({ type: 'reset' });
    setIsPanelOpen(true);
    toast.success('Added as a reference for your next generation');
  };

  const copyCurrentPrompt = () => {
    void navigator.clipboard
      ?.writeText(prompt)
      .then(() => toast.success('Prompt copied'))
      .catch(() =>
        toast.error('Unable to copy the prompt. Please copy it manually.')
      );
  };

  const restartGeneration = () => {
    clearActiveGenerationSession();
    dispatchGen({ type: 'reset' });
    void handleSubmit();
  };

  const retryGeneratedPreview = () => {
    setPreviewRetryToken(Date.now());
    toast.message('Reloading image preview…');
  };

  const openHistoryPanel = () => {
    setIsPanelOpen(true);
    setActiveImageId((current) =>
      current && images.some((image) => image.id === current)
        ? current
        : (images[0]?.id ?? null)
    );
    window.history.replaceState(null, '', '#generation-history');
  };

  const closeHistoryPanel = () => {
    setIsPanelOpen(false);
    if (window.location.hash === '#generation-history') {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`
      );
    }
  };

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-hidden text-neutral-900 md:flex-row">
      {/* Aceternity-style collapsible icon sidebar. */}
      <Sidebar open={open} setOpen={setOpen} className="hidden md:flex">
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open && <SidebarLogo logo="SciDrawer AI" href="/" />}
            <div className="mt-12 flex flex-col gap-2">
              {NAV_LINKS.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  active={
                    link.href === '#generation-history'
                      ? isPanelOpen
                      : !isPanelOpen
                  }
                  onClick={(event) => {
                    if (link.href === '#generation-history') {
                      event.preventDefault();
                      openHistoryPanel();
                      return;
                    }
                    event.preventDefault();
                    closeHistoryPanel();
                  }}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main work panel (mirrors figpad's main > section) */}
      <main className="min-h-screen min-w-0 flex-1">
        <div className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:hidden">
          <a
            href="/"
            className="text-sm font-semibold tracking-tight text-slate-900"
          >
            SciDrawer AI
          </a>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              if (isPanelOpen) {
                closeHistoryPanel();
              } else {
                openHistoryPanel();
              }
            }}
            aria-expanded={isPanelOpen}
            aria-controls="generation-history"
            className="gap-2 text-slate-700"
          >
            {isPanelOpen ? (
              <X className="size-4" />
            ) : (
              <History className="size-4" />
            )}
            {isPanelOpen ? 'Close history' : 'History'}
          </Button>
        </div>
        <section className="bg-background min-h-screen overflow-hidden">
          {/* Page title and subtitle */}
          <div className="mx-auto w-full max-w-[980px] px-4 pt-20 pb-6 text-center md:pt-48 xl:pt-56">
            <h1 className="text-[36px] leading-[45px] font-semibold text-slate-900">
              AI Scientific Figure Generator
            </h1>
            <p className="mx-auto mt-4 text-sm text-[#415365]">
              Use SciDrawer AI as a scientific diagram maker for research
              visuals you can refine and export.
            </p>
          </div>

          {/* Generator card — full width inside the main column. The right
              side of the viewport is reserved for the always-on preview
              panel (rendered as a sibling of <main> below). */}
          <div className="mx-auto mt-8 w-full max-w-[980px] px-4 pb-12">
            {genState.status === 'idle' ? (
              <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_12px_rgba(30,38,47,0.06)] transition-all duration-200 focus-within:border-slate-400 focus-within:shadow-[0_0_0_4px_rgba(15,23,42,0.06),0_16px_42px_rgba(30,38,47,0.14)] hover:-translate-y-0.5 hover:shadow-[0_16px_42px_rgba(30,38,47,0.14)]">
                {/* Hidden file input — triggered by the image attach button */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,.gif"
                  multiple
                  className="hidden"
                  onChange={handleReferenceImages}
                />

                <div className="relative">
                  {referenceImages.length > 0 && (
                    <div className="absolute top-4 left-5 z-10 flex max-w-[calc(100%-2.5rem)] gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {referenceImages.map((image) => (
                        <div
                          key={image.id}
                          className="group/reference relative size-[76px] shrink-0 overflow-visible rounded-xl bg-slate-100 shadow-[0_3px_10px_rgba(15,23,42,0.14)]"
                        >
                          <ReferenceImagePreview
                            name={image.name}
                            url={image.url}
                          />
                          <button
                            type="button"
                            onClick={() => removeReferenceImage(image.id)}
                            aria-label={`Remove reference image ${image.name}`}
                            title="Remove reference image"
                            className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border border-white bg-slate-800 text-white shadow-sm transition-transform hover:scale-110 hover:bg-slate-950 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                          >
                            <X className="size-3" strokeWidth={2.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Textarea
                    rows={6}
                    placeholder="Describe a scientific figure, e.g. a mitochondrial ultrastructure with cristae and mtDNA labels…"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className={cn(
                      'min-h-[128px] resize-none rounded-none border-0 bg-white px-5 pb-4 text-base shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
                      referenceImages.length > 0 ? 'pt-[108px]' : 'pt-4'
                    )}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="group/imgbtn relative">
                      <button
                        type="button"
                        aria-label="Attach image"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingReferences || isGenerating}
                        className="flex size-9 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ImageIcon className="size-4" />
                      </button>
                      <div className="pointer-events-none absolute top-1/2 left-full z-50 ml-2 -translate-y-1/2 scale-95 rounded-md bg-[#111] px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-150 group-hover/imgbtn:scale-100 group-hover/imgbtn:opacity-100">
                        <span className="absolute top-1/2 -left-1 size-2 -translate-y-1/2 rotate-45 bg-[#111]" />
                        Add reference sketches or images
                      </div>
                    </div>

                    <DropdownMenu
                      open={openParameterMenu === 'aspect'}
                      onOpenChange={(isOpen) =>
                        setOpenParameterMenu(isOpen ? 'aspect' : null)
                      }
                    >
                      <DropdownMenuTrigger className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-[0_1px_3px_rgba(30,38,47,0.06)] transition-colors outline-none hover:bg-slate-50 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2">
                        <span className="font-medium">{aspect}</span>
                        <ChevronDown className="size-3 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-32">
                        {IMAGE_SIZES.map((ratio) => (
                          <DropdownMenuItem
                            key={ratio}
                            onClick={() => {
                              setAspect(ratio);
                              setOpenParameterMenu(null);
                            }}
                            className="justify-between"
                          >
                            {ratio}
                            {ratio === aspect && <Check className="size-3.5" />}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu
                      open={openParameterMenu === 'resolution'}
                      onOpenChange={(isOpen) =>
                        setOpenParameterMenu(isOpen ? 'resolution' : null)
                      }
                    >
                      <DropdownMenuTrigger
                        aria-label="Select resolution"
                        className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-[0_1px_3px_rgba(30,38,47,0.06)] transition-colors outline-none hover:bg-slate-50 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                      >
                        <span className="font-medium">{resolution}</span>
                        <ChevronDown className="size-3 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-28">
                        {RESOLUTIONS.map((value) => (
                          <DropdownMenuItem
                            key={value}
                            onClick={() => {
                              setResolution(value);
                              setOpenParameterMenu(null);
                            }}
                            className="justify-between"
                          >
                            {value}
                            {value === resolution && (
                              <Check className="size-3.5" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu
                      open={openParameterMenu === 'quality'}
                      onOpenChange={(isOpen) =>
                        setOpenParameterMenu(isOpen ? 'quality' : null)
                      }
                    >
                      <DropdownMenuTrigger
                        aria-label="Select generation quality"
                        className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-500 shadow-[0_1px_3px_rgba(30,38,47,0.06)] transition-colors outline-none hover:bg-slate-50 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                      >
                        <span className="font-medium capitalize">
                          {quality}
                        </span>
                        <ChevronDown className="size-3 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-32">
                        {QUALITIES.map((value) => (
                          <DropdownMenuItem
                            key={value}
                            onClick={() => {
                              setQuality(value);
                              setOpenParameterMenu(null);
                            }}
                            className="justify-between capitalize"
                          >
                            {value}
                            {value === quality && (
                              <Check className="size-3.5" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-3">
                    <DropdownMenu
                      open={openParameterMenu === 'model'}
                      onOpenChange={(isOpen) =>
                        setOpenParameterMenu(isOpen ? 'model' : null)
                      }
                    >
                      <DropdownMenuTrigger
                        aria-label="Select generation model"
                        title={`Model: ${model}`}
                        className="flex h-8 w-auto items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-600 shadow-[0_1px_3px_rgba(30,38,47,0.06)] transition-colors outline-none hover:bg-slate-50 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                      >
                        <Box className="size-3.5 text-slate-700" />
                        <span className="hidden sm:inline">{model}</span>
                        <ChevronDown className="size-3.5 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        {MODELS.map((candidate) => (
                          <DropdownMenuItem
                            key={candidate.name}
                            onClick={() => {
                              setModel(candidate.name);
                              setOpenParameterMenu(null);
                            }}
                            className="items-start justify-between gap-3"
                          >
                            <span>{candidate.name}</span>
                            {candidate.name === model && (
                              <Check className="mt-0.5 size-3.5" />
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      aria-label="Generate"
                      title="Generate"
                      className="size-10 rounded-[12px] bg-slate-700 p-0 text-white shadow-[0_10px_24px_rgba(30,38,47,0.18)] hover:bg-slate-800"
                    >
                      <Send className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <GenerationSession
                status={genState.status}
                progress={
                  genState.status === 'generating' ? genState.progress : 0
                }
                elapsed={
                  genState.status === 'generating' ||
                  genState.status === 'succeeded'
                    ? genState.elapsed
                    : 0
                }
                prompt={prompt}
                image={
                  genState.status === 'succeeded'
                    ? retryPreviewUrl(genState.image, previewRetryToken)
                    : undefined
                }
                errorMessage={
                  genState.status === 'failed'
                    ? genState.error.message
                    : undefined
                }
                copy={SESSION_COPY}
                onClose={() => dispatchGen({ type: 'reset' })}
                onRetry={retryGeneratedPreview}
                onRegenerate={restartGeneration}
                onUseAsReference={() => {
                  if (genState.status === 'succeeded') {
                    useGeneratedImageAsReference(genState.image);
                  }
                }}
                onCopyPrompt={copyCurrentPrompt}
              />
            )}
          </div>
        </section>
      </main>

      <ImagePreviewPanel
        title="History"
        copy={HISTORY_PANEL_COPY}
        open={isPanelOpen}
        images={previewImages}
        activeId={activePreviewId}
        isGenerating={isGenerating}
        isLoadingHistory={historyQuery.isLoading}
        hasMore={historyQuery.hasNextPage}
        isLoadingMore={historyQuery.isFetchingNextPage}
        onLoadMore={() => void historyQuery.fetchNextPage()}
        closeOnPointerLeave={false}
        onOpen={() => setIsPanelOpen(true)}
        onClose={closeHistoryPanel}
        onSelect={selectPreviewImage}
        emptyState={
          <div className="flex max-w-[18rem] flex-col items-center gap-2 text-center text-sm text-slate-500">
            <span className="font-medium text-slate-700">
              No generations yet
            </span>
            <span>Your completed scientific figures will be saved here.</span>
          </div>
        }
      />
    </div>
  );
}

export const Route = createFileRoute('/generate')({
  validateSearch: (search: Record<string, unknown>) => ({
    prompt:
      typeof search.prompt === 'string' && search.prompt.trim().length > 0
        ? search.prompt.slice(0, 4_000)
        : undefined,
  }),
  component: GeneratePage,
  head: () => ({
    meta: [
      { title: 'Scientific Figure Generator | SciDrawer AI' },
      {
        name: 'description',
        content:
          'AI-powered scientific image generator — describe a pathway, lab setup, micrograph, or graphical abstract and get a publication-ready figure in seconds.',
      },
    ],
  }),
});

/**
 * Loads a reference image through the api-client instead of a raw <img src>.
 * In Vite dev, `/api/...` is intercepted as a static lookup and 404s before
 * the route runs, so a plain <img src> would always show the broken icon.
 * `useImagePreview` fetches the bytes with the API client and exposes a
 * blob URL the browser can render.
 */
function ReferenceImagePreview({ name, url }: { name: string; url: string }) {
  // Public R2 assets are intentionally rendered by the browser as ordinary
  // images. Fetching them first to make a Blob URL would require a CORS
  // response header, while an <img> element can safely display the same
  // public resource without it.
  if (/^https?:\/\//i.test(url)) {
    return (
      <img
        src={url}
        alt={`Reference image: ${name}`}
        className="size-full rounded-xl border border-slate-200 bg-white object-cover"
      />
    );
  }

  return <ProtectedReferenceImagePreview name={name} url={url} />;
}

function ProtectedReferenceImagePreview({
  name,
  url,
}: {
  name: string;
  url: string;
}) {
  const { objectUrl, status } = useImagePreview(url);

  if (status === 'error') {
    return (
      <div
        aria-label={`Reference image unavailable: ${name}`}
        className="flex size-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400"
      >
        <ImageIcon className="size-5" />
      </div>
    );
  }
  if (!objectUrl) {
    return (
      <div
        aria-label={`Loading reference image: ${name}`}
        className="flex size-full items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400"
      >
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }
  return (
    <img
      src={objectUrl}
      alt={`Reference image: ${name}`}
      className="size-full rounded-xl border border-slate-200 bg-white object-cover"
    />
  );
}
