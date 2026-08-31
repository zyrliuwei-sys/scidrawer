import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import {
  AlertCircle,
  ArrowDown,
  Box,
  Check,
  ChevronDown,
  Download,
  History,
  Image as ImageIcon,
  ImageOff,
  Loader2,
  LoaderCircle,
  Pencil,
  RefreshCw,
  Send,
  Wand2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { signIn, useSession } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { apiGet, apiPost, apiPostForm } from '@/lib/api-client';
import { getUuid } from '@/lib/hash';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { getLocale, localizeHref } from '@/paraglide/runtime.js';
import { useImagePreview } from '@/hooks/use-image-preview';
import { usePublicConfig } from '@/hooks/use-public-config';
import { FigpadWorkspaceSidebar } from '@/components/generator/figpad-workspace-sidebar';
import { FlowchartWorkspace } from '@/components/generator/flowchart-workspace';
import type { GenerationSessionCopy } from '@/components/generator/generation-session';
import { PlotWorkspace } from '@/components/generator/plot-workspace';
import { SvgConverterWorkspace } from '@/components/generator/svg-converter-workspace';
import { SvgEditorWorkspace } from '@/components/generator/svg-editor-workspace';
import {
  WorkspaceModeTabs,
  type GeneratorWorkspaceMode,
} from '@/components/generator/workspace-mode-tabs';
import {
  ImagePreviewPanel,
  type ImageHistoryCopy,
  type PreviewImage,
} from '@/components/image-preview-panel';
import {
  PaymentProviderModal,
  type PaymentProvider,
} from '@/components/payment-provider-modal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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

const PAYMENT_PROVIDERS: PaymentProvider[] = [
  'stripe',
  'creem',
  'paypal',
  'alipay',
  'wechat',
];

const HISTORY_PAGE_SIZE = 24;

type GenerationExample = {
  id: string;
  title: string;
  image: string;
  prompt: string;
  aspect: (typeof IMAGE_SIZES)[number];
};

// These are complete, production-ready prompt starting points. Keeping the
// source image and prompt together makes the example gallery useful rather
// than a purely decorative showcase.
const GENERATION_EXAMPLES: GenerationExample[] = [
  {
    id: 'cellular-architecture',
    title: 'Cellular architecture',
    image: '/imgs/generated/cellular-architecture.png',
    aspect: '16:9',
    prompt:
      'Create a publication-ready cross-section of a eukaryotic cell with clearly labeled nucleus, nucleolus, mitochondria with cristae, rough and smooth endoplasmic reticulum, Golgi apparatus, lysosomes, ribosomes, cytoskeleton, and cell membrane. Use a clean BioRender-style scientific illustration, thin leader lines, muted pastel colors, white background, balanced infographic layout, and crisp academic typography.',
  },
  {
    id: 'signaling-cascade',
    title: 'Signal transduction',
    image: '/imgs/generated/signaling-cascade.png',
    aspect: '16:9',
    prompt:
      'Illustrate a cellular signal transduction pathway from ligand binding at a membrane receptor through cytoplasmic kinase signaling to transcription-factor activation in the nucleus. Show directional arrows, phosphorylation steps, feedback inhibition, and concise labels. Use a polished scientific infographic style with subtle pastel colors, thin dark outlines, white background, and manuscript-ready spacing.',
  },
  {
    id: 'rna-delivery',
    title: 'RNA therapeutic delivery',
    image: '/imgs/generated/rna-therapeutic-delivery.png',
    aspect: '16:9',
    prompt:
      'Create a three-panel graphical abstract explaining RNA therapeutic delivery: lipid nanoparticle formulation, intravenous administration and tissue targeting, then cellular uptake, endosomal escape, and protein expression. Include clean arrows, labeled compartments, an elegant clinical color palette, white background, and precise publication-ready scientific illustration styling.',
  },
];

// The starter-prompt gallery is temporarily hidden. Flip to true to restore
// the Examples section in the empty workspace.
const SHOW_GENERATION_EXAMPLES = false;

const HISTORY_PANEL_COPY: ImageHistoryCopy = {
  imageCounter: (current, total) => `${current} of ${total}`,
  imageTotal: (total) => `${total} images`,
  download: 'Download image',
  close: 'Close history',
  gallery: 'All images',
  preview: 'Back to preview',
  clear: 'Clear images',
  today: 'Today',
  yesterday: 'Yesterday',
  earlier: 'Earlier',
  untitled: 'Untitled scientific figure',
  noMatches: 'No matching images',
  loadMore: 'Load more',
  loadingMore: 'Loading',
  generated: 'Generated image',
  loading: 'Loading image preview…',
  unavailable: 'Image preview unavailable',
  dateLocale: 'en-US',
};

const SESSION_COPY: GenerationSessionCopy = {
  title: 'Image Generate',
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
  /** True when this task used the signed-in user's one-time welcome image. */
  welcomeGeneration?: boolean;
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
  /** True when this task consumed the one-time welcome generation. */
  welcome?: boolean;
};

const ACTIVE_GENERATION_STORAGE_KEY = 'scidrawer.active-image-generation.v1';
const GUEST_PROMPT_STORAGE_KEY = 'scidrawer.guest-image-prompt.v1';
const GUEST_AUTO_GENERATE_STORAGE_KEY =
  'scidrawer.guest-auto-image-generation.v1';

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
      // A missing balance is a deterministic billing result, not a transient
      // generation failure. Surface the purchase dialog immediately — never
      // retry the doomed request.
      if (isInsufficientCreditsError(error)) break;
      if (attempt === 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, GENERATION_RETRY_DELAY_MS)
        );
      }
    }
  }
  throw lastError;
}

function isInsufficientCreditsError(error: unknown) {
  return (
    error instanceof Error &&
    error.message.toLowerCase().includes('insufficient credits')
  );
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

function persistGuestPrompt(prompt: string) {
  try {
    window.sessionStorage.setItem(GUEST_PROMPT_STORAGE_KEY, prompt);
  } catch {
    // Private browsing can disallow sessionStorage. The sign-in flow itself
    // should still work when preserving the draft is unavailable.
  }
}

function persistGuestAutoGeneration() {
  try {
    window.sessionStorage.setItem(GUEST_AUTO_GENERATE_STORAGE_KEY, '1');
  } catch {
    // The saved prompt remains available even when private browsing blocks
    // session storage, so the user can still submit it manually after login.
  }
}

function takeGuestPrompt() {
  try {
    const prompt = window.sessionStorage.getItem(GUEST_PROMPT_STORAGE_KEY);
    window.sessionStorage.removeItem(GUEST_PROMPT_STORAGE_KEY);
    return prompt?.trim() ? prompt : null;
  } catch {
    return null;
  }
}

function takeGuestAutoGeneration() {
  try {
    const shouldGenerate =
      window.sessionStorage.getItem(GUEST_AUTO_GENERATE_STORAGE_KEY) === '1';
    window.sessionStorage.removeItem(GUEST_AUTO_GENERATE_STORAGE_KEY);
    return shouldGenerate;
  } catch {
    return false;
  }
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

/** One generated figure in the chat-style feed: the image plus its quiet
 *  action row (download / reference / regenerate). */
function FeedImageCard({
  image,
  copy,
  onUseAsReference,
  onRegenerate,
  onPreview,
}: {
  image: GeneratedImage;
  copy: GenerationSessionCopy;
  onUseAsReference: (image: GeneratedImage) => void;
  onRegenerate: (image: GeneratedImage) => void;
  onPreview: (image: GeneratedImage) => void;
}) {
  const { objectUrl, status: imageState, retry } = useImagePreview(image.src);

  return (
    <figure className="group/fig flex w-full max-w-[320px] flex-col gap-2 self-start">
      <div className="flex min-h-[140px] w-fit max-w-full min-w-[220px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(30,41,47,0.06)]">
        {imageState === 'loading' && (
          <LoaderCircle className="size-5 animate-spin text-slate-400" />
        )}
        {imageState === 'error' && (
          <button
            type="button"
            onClick={retry}
            className="flex flex-col items-center gap-2 px-6 py-8 text-xs font-medium text-slate-500 transition-colors hover:text-slate-800"
          >
            <ImageOff className="size-5" />
            {copy.imageUnavailable}
          </button>
        )}
        {objectUrl && imageState === 'ready' && (
          <img
            src={objectUrl}
            alt={image.name ?? image.prompt ?? 'Generated figure'}
            onClick={() => onPreview(image)}
            title="Open in preview"
            className="max-h-[220px] w-auto max-w-full cursor-zoom-in rounded-2xl object-contain transition-opacity hover:opacity-90"
          />
        )}
      </div>
      <figcaption className="pointer-events-none flex flex-wrap items-center gap-1 text-xs font-medium text-slate-500 opacity-0 transition-opacity duration-200 group-hover/fig:pointer-events-auto group-hover/fig:opacity-100 focus-within:pointer-events-auto focus-within:opacity-100">
        <a
          href={image.downloadUrl ?? image.src}
          download={image.name}
          title="Download"
          aria-label="Download"
          className="group flex items-center rounded-full px-2.5 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <Download className="size-3.5 shrink-0" />
          <span className="max-w-0 overflow-hidden text-left whitespace-nowrap opacity-0 transition-all duration-200 group-hover:ml-1.5 group-hover:max-w-40 group-hover:opacity-100">
            Download
          </span>
        </a>
        <button
          type="button"
          onClick={() => onUseAsReference(image)}
          title={copy.useAsReference}
          aria-label={copy.useAsReference}
          className="group flex items-center rounded-full px-2.5 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <ArrowDown className="size-3.5 shrink-0" />
          <span className="max-w-0 overflow-hidden text-left whitespace-nowrap opacity-0 transition-all duration-200 group-hover:ml-1.5 group-hover:max-w-40 group-hover:opacity-100">
            {copy.useAsReference}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onRegenerate(image)}
          title={copy.regenerate}
          aria-label={copy.regenerate}
          className="group flex items-center rounded-full px-2.5 py-1.5 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <RefreshCw className="size-3.5 shrink-0" />
          <span className="max-w-0 overflow-hidden text-left whitespace-nowrap opacity-0 transition-all duration-200 group-hover:ml-1.5 group-hover:max-w-40 group-hover:opacity-100">
            {copy.regenerate}
          </span>
        </button>
      </figcaption>
    </figure>
  );
}

/** The in-flight / failed generation slot at the bottom of the feed, directly
 *  above the composer — an animated placeholder illustration while running,
 *  retry panel when it fails. */
function FeedProgressCard({
  status,
  progress,
  errorMessage,
  copy,
  onRetry,
}: {
  status: 'submitting' | 'generating' | 'failed';
  progress: number;
  errorMessage?: string;
  copy: GenerationSessionCopy;
  onRetry: () => void;
}) {
  if (status === 'failed') {
    return (
      <div className="flex w-full max-w-[400px] flex-col gap-3 self-start rounded-2xl border border-red-200 bg-red-50/70 p-4">
        <div className="flex items-start gap-2.5 text-sm text-red-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <p className="min-w-0 break-words">
            {errorMessage ?? copy.imageUnavailable}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="w-fit rounded-full"
        >
          <RefreshCw className="size-3.5" />
          {copy.retry}
        </Button>
      </div>
    );
  }

  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <div className="flex w-full max-w-[320px] self-start rounded-2xl border border-slate-200 bg-white p-2.5 shadow-[0_2px_12px_rgba(30,41,47,0.06)]">
      <div
        role="progressbar"
        aria-label={copy.rendering}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeProgress}
        className="w-full overflow-hidden rounded-xl border border-slate-100"
      >
        <img
          src="/imgs/generating.svg"
          alt=""
          draggable={false}
          className="block h-[180px] w-full object-cover select-none"
        />
      </div>
    </div>
  );
}

function GeneratePage() {
  const { prompt: starterPrompt } = Route.useSearch();
  const { data: session } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState(starterPrompt ?? '');
  const [workspaceMode, setWorkspaceMode] =
    useState<GeneratorWorkspaceMode>('illustration');
  const [selectedExampleId, setSelectedExampleId] = useState<string | null>(
    null
  );
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
  const [open, setOpen] = useState(false);
  // Fresh results appear immediately. Completed results from previous visits
  // are loaded from the user's persisted task history below.
  const [recentImages, setRecentImages] = useState<GeneratedImage[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  // Prompt of the in-flight generation, shown as a feed bubble while the
  // figure renders (feed turns only exist once an image completes).
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [registrationPromptOpen, setRegistrationPromptOpen] = useState(false);
  const [shouldAutoGenerate, setShouldAutoGenerate] = useState(false);
  const [paymentPromptOpen, setPaymentPromptOpen] = useState(false);
  // Set when the one-time welcome generation succeeds, when the server rejects
  // a submit for insufficient credits, or right on load when the welcome image
  // is already spent and the balance can't cover a render. Until credits
  // arrive (a checkout redirect reloads the page and resets this flag), any
  // submit opens the paywall instantly — no doomed request, and no generation
  // placeholder flashing in the feed first.
  const [welcomeGenerationUsed, setWelcomeGenerationUsed] = useState(false);
  const [paymentProviderOpen, setPaymentProviderOpen] = useState(false);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [loadingPaymentProvider, setLoadingPaymentProvider] =
    useState<PaymentProvider | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  // The state machine keeps the real provider task visible while it runs.
  const [genState, dispatchGen] = useReducer(generateReducer, initialState);
  // Start with the history canvas closed so the workspace is unobstructed.
  // It opens automatically when a preview is available (generation completes,
  // history thumbnail clicked, etc.).
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const pollingAbortRef = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();
  // Whether the user can afford any render at all. When they can't (welcome
  // image spent, balance below the cheapest 1K low render), the latch above
  // is armed on load so the very first Generate click opens the paywall.
  const paywallStatusQuery = useQuery({
    queryKey: ['ai-image-paywall-status'],
    queryFn: () =>
      apiGet<{ welcomeUsed: boolean; balance: number; paywallDue: boolean }>(
        '/api/ai/images/welcome-status'
      ),
    enabled: Boolean(session?.user),
    staleTime: 30_000,
  });
  useEffect(() => {
    if (paywallStatusQuery.data?.paywallDue) setWelcomeGenerationUsed(true);
  }, [paywallStatusQuery.data]);
  const publicConfigQuery = usePublicConfig();
  const publicConfigs = publicConfigQuery.data ?? {};
  const emailEnabled = publicConfigQuery.data?.email_auth_enabled !== 'false';
  const googleEnabled = publicConfigQuery.data?.google_auth_enabled === 'true';
  const enabledPaymentProviders = useMemo(
    () =>
      PAYMENT_PROVIDERS.filter(
        (provider) => publicConfigs[`${provider}_enabled`] === 'true'
      ),
    [publicConfigs]
  );
  const defaultPaymentProvider =
    (publicConfigs.default_payment_provider as PaymentProvider | undefined) ||
    enabledPaymentProviders[0] ||
    'stripe';
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

  useEffect(() => {
    if (!session?.user) return;
    const savedPrompt = takeGuestPrompt();
    const shouldGenerate = takeGuestAutoGeneration();
    if (!starterPrompt && savedPrompt) setPrompt(savedPrompt);
    if (shouldGenerate && (savedPrompt || starterPrompt)) {
      setShouldAutoGenerate(true);
    }
  }, [session?.user, starterPrompt]);

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
    setPendingPrompt(null);
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
    setPendingPrompt(activeSession.prompt);
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
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  const canSubmit =
    prompt.trim().length >= 3 && !isGenerating && !isUploadingReferences;

  // Chat-style feed: group merged history into per-task turns, oldest first,
  // so the newest result always sits directly above the composer.
  const feedTurns = useMemo(() => {
    const turns: Array<{
      taskId: string;
      prompt: string;
      images: GeneratedImage[];
    }> = [];
    for (const image of images) {
      const taskId = image.id.split(':')[0] || image.id;
      const current = turns[turns.length - 1];
      if (current && current.taskId === taskId) {
        current.images.push(image);
      } else {
        turns.push({ taskId, prompt: image.prompt ?? '', images: [image] });
      }
    }
    return turns.reverse();
  }, [images]);

  const feedScrollRef = useRef<HTMLDivElement>(null);
  // Set while appending older pages so the stick-to-bottom effect below does
  // not yank the viewport when "Load earlier figures" adds content on top.
  const skipNextFeedScrollRef = useRef(false);
  const isGenerationRunning =
    genState.status === 'submitting' || genState.status === 'generating';

  useLayoutEffect(() => {
    const feed = feedScrollRef.current;
    if (!feed) return;
    if (skipNextFeedScrollRef.current) {
      skipNextFeedScrollRef.current = false;
      return;
    }
    feed.scrollTop = feed.scrollHeight;
  }, [images.length, isGenerationRunning]);

  const loadEarlierFeed = async () => {
    const previousHeight = feedScrollRef.current?.scrollHeight ?? 0;
    skipNextFeedScrollRef.current = true;
    try {
      await historyQuery.fetchNextPage();
    } finally {
      requestAnimationFrame(() => {
        const feed = feedScrollRef.current;
        if (feed) feed.scrollTop = feed.scrollHeight - previousHeight;
      });
    }
  };

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

  const handleSubmit = async (override?: {
    prompt?: string;
    aspect?: (typeof IMAGE_SIZES)[number];
  }) => {
    // Regenerate-from-history passes the original values explicitly; a plain
    // submit reads the current composer state.
    const submittedPrompt = (override?.prompt ?? prompt).trim();
    const submittedAspect = override?.aspect ?? aspect;
    if (submittedPrompt.length < 3 || isGenerating || isUploadingReferences) {
      return;
    }
    if (!session?.user) {
      persistGuestPrompt(submittedPrompt);
      setLoginError('');
      setRegistrationPromptOpen(true);
      return;
    }

    // The welcome generation is spent (or a previous submit was rejected for
    // insufficient credits) and no credits have arrived since (a checkout
    // redirect reloads the page and resets this flag) — skip the doomed
    // request and surface the paywall the instant the button fires.
    if (welcomeGenerationUsed) {
      setPaymentPromptOpen(true);
      return;
    }

    // Capture the submitted configuration so edits made during generation do
    // not alter the result record that is added to history.
    const submittedModel = model;
    const submittedReferences = referenceImages;
    const controller = new AbortController();
    pollingAbortRef.current?.abort();
    pollingAbortRef.current = controller;

    setIsGenerating(true);
    setPendingPrompt(submittedPrompt);
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
      if (task.welcomeGeneration) {
        toast.success(m['generator.trial.granted']());
      }
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
        welcome: task.welcomeGeneration === true,
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
          if (activeSession.welcome) setWelcomeGenerationUsed(true);
          completeTask(task.id, currentTask, nextSession);
        }
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      if (isInsufficientCreditsError(error)) {
        // Latch so the next submit is intercepted client-side — the paywall
        // opens the instant the button fires instead of after another round
        // trip. Still session state only: a checkout redirect reloads the
        // page and resets it, so paying users are never blocked.
        setWelcomeGenerationUsed(true);
        clearActiveGenerationSession();
        // The state is still 'submitting' here, and 'reset' only clears
        // 'succeeded'/'failed' — 'cancel' is the action that returns a
        // submit-in-flight back to idle, so no progress card is left behind.
        dispatchGen({ type: 'cancel' });
        setPendingPrompt(null);
        setPaymentPromptOpen(true);
        return;
      }
      const message =
        error instanceof Error ? error.message : 'Image generation failed';
      clearActiveGenerationSession();
      setPendingPrompt(null);
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

  const startCheckout = async (provider: PaymentProvider) => {
    setIsStartingCheckout(true);
    setLoadingPaymentProvider(provider);
    try {
      const checkout = await apiPost<{ checkout_url?: string }>(
        '/api/payment/checkout',
        {
          product_id: 'starter_monthly',
          product_name: 'Starter',
          plan_name: 'Starter',
          price: 900,
          currency: 'usd',
          type: 'subscription',
          description: 'Starter',
          plan: { name: 'Starter', interval: 'month', intervalCount: 1 },
          credits: 612,
          payment_provider: provider,
          // Restore the draft after the hosted checkout returns. The next
          // generation stays a deliberate user action after credits arrive.
          redirect: `/generate?prompt=${encodeURIComponent(prompt.trim())}`,
        }
      );
      if (!checkout.checkout_url) throw new Error('Checkout failed');
      window.location.assign(checkout.checkout_url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Checkout failed');
      setLoadingPaymentProvider(null);
    } finally {
      setIsStartingCheckout(false);
    }
  };

  const continueToPayment = () => {
    const chooseProvider =
      publicConfigs.select_payment_enabled === 'true' &&
      enabledPaymentProviders.length > 1;
    if (chooseProvider) {
      setPaymentPromptOpen(false);
      setPaymentProviderOpen(true);
      return;
    }
    void startCheckout(defaultPaymentProvider);
  };

  // A prompt submitted before authentication is the welcome generation. Wait
  // until the fresh session and restored draft are both ready, then submit it
  // once without asking the user to click Generate again.
  useEffect(() => {
    if (!shouldAutoGenerate || !session?.user || !canSubmit) return;
    setShouldAutoGenerate(false);
    void handleSubmit();
  }, [shouldAutoGenerate, session?.user, canSubmit, handleSubmit]);

  // ESC leaves the workspace for the homepage. Overlays (history panel,
  // dialogs, parameter menus) close themselves on ESC first, so only a bare
  // workspace with nothing open navigates away.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (
        isPanelOpen ||
        registrationPromptOpen ||
        paymentPromptOpen ||
        paymentProviderOpen ||
        openParameterMenu
      ) {
        return;
      }
      router.push('/');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    isPanelOpen,
    registrationPromptOpen,
    paymentPromptOpen,
    paymentProviderOpen,
    openParameterMenu,
    router,
  ]);

  const handleEmailSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoginError('');

    if (!loginEmail.trim() || !loginPassword) {
      setLoginError(m['common.sign.credentials_required']());
      return;
    }

    setIsSigningIn(true);
    try {
      const result: any = await signIn.email({
        email: loginEmail.trim(),
        password: loginPassword,
      });
      if (result.error) {
        setLoginError(
          result.error.message || m['common.sign.sign_in_failed']()
        );
        return;
      }

      persistGuestPrompt(prompt);
      persistGuestAutoGeneration();
      // Reload with the new session cookie before returning to the workspace.
      window.location.assign(localizeHref('/generate'));
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : m['common.sign.sign_in_failed']()
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async () => {
    persistGuestPrompt(prompt);
    persistGuestAutoGeneration();
    setLoginError('');
    setIsSigningIn(true);
    try {
      const result: any = await signIn.social({
        provider: 'google',
        callbackURL: '/generate',
      });
      if (result?.error) {
        setLoginError(
          result.error.message || m['common.sign.sign_in_failed']()
        );
        setIsSigningIn(false);
      }
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : m['common.sign.sign_in_failed']()
      );
      setIsSigningIn(false);
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
    toast.success('Added as a reference for your next generation');
  };

  const editTurnPrompt = (text: string) => {
    // Put the whole prompt back into the composer so it can be refined
    // and resubmitted.
    setPrompt(text);
    window.requestAnimationFrame(() => {
      promptInputRef.current?.focus();
    });
    toast.success('Prompt restored — refine it and click Generate.');
  };

  const restartGeneration = () => {
    clearActiveGenerationSession();
    dispatchGen({ type: 'reset' });
    void handleSubmit();
  };

  const regenerateFromImage = (image: GeneratedImage) => {
    const nextAspect = IMAGE_SIZES.includes(
      image.aspect as (typeof IMAGE_SIZES)[number]
    )
      ? (image.aspect as (typeof IMAGE_SIZES)[number])
      : aspect;
    // Show what is being regenerated in the composer, then submit the
    // original values directly — no stale-state round trip.
    setPrompt(image.prompt);
    setAspect(nextAspect);
    void handleSubmit({ prompt: image.prompt, aspect: nextAspect });
  };

  const previewFeedImage = (image: GeneratedImage) => {
    // Select the clicked figure in the docked preview panel (and open the
    // overlay on small screens).
    setActiveImageId(image.id);
    setIsPanelOpen(true);
    window.history.replaceState(null, '', '#generation-history');
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

  const chooseGenerationExample = (example: GenerationExample) => {
    if (isGenerating || genState.status === 'generating') return;

    setPrompt(example.prompt);
    setAspect(example.aspect);
    setSelectedExampleId(example.id);
    if (genState.status !== 'idle') dispatchGen({ type: 'reset' });

    // The composer is always visible at the bottom — just focus it.
    window.requestAnimationFrame(() => {
      promptInputRef.current?.focus();
    });
    toast.success('Prompt added — refine it or click Generate.');
  };

  const activeSidebarTool = 'generate' as const;
  const showingFigureWorkspace =
    workspaceMode === 'illustration' ||
    workspaceMode === 'flowchart' ||
    workspaceMode === 'plot';

  const selectSidebarTool = () => {
    closeHistoryPanel();
    setWorkspaceMode('illustration');
  };

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-hidden bg-white text-neutral-900 md:flex-row">
      <FigpadWorkspaceSidebar
        open={open}
        onOpenChange={setOpen}
        activeTool={activeSidebarTool}
        onToolSelect={selectSidebarTool}
        signedIn={Boolean(session?.user)}
        accountLabel={session?.user?.name || session?.user?.email}
        onAccountClick={() => {
          if (session?.user) {
            router.push('/settings/profile');
            return;
          }
          setRegistrationPromptOpen(true);
        }}
      />

      {/* Main work panel (mirrors figpad's main > section) */}
      <main className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden bg-white">
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
        {workspaceMode === 'illustration' ? (
          <section
            aria-label="Generation history feed"
            className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white"
          >
            <div
              ref={feedScrollRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Workspace mode tabs (page title hidden) */}
              {showingFigureWorkspace && (
                <div className="mx-auto w-full max-w-[980px] px-4 pt-10 pb-4 text-center">
                  <WorkspaceModeTabs
                    activeMode={workspaceMode}
                    onModeChange={setWorkspaceMode}
                  />
                </div>
              )}

              {/* History feed — oldest turns at the top, the newest result
                  right above the composer. */}
              <div className="mx-auto w-full max-w-[760px] px-4 pb-10">
                {historyQuery.hasNextPage && (
                  <div className="flex justify-center pb-6">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      disabled={historyQuery.isFetchingNextPage}
                      onClick={() => void loadEarlierFeed()}
                    >
                      {historyQuery.isFetchingNextPage
                        ? 'Loading…'
                        : 'Load earlier figures'}
                    </Button>
                  </div>
                )}

                {SHOW_GENERATION_EXAMPLES &&
                feedTurns.length === 0 &&
                !isGenerationRunning &&
                genState.status !== 'failed' &&
                !(session?.user && historyQuery.isLoading) ? (
                  <section
                    aria-labelledby="generation-examples-title"
                    className="mx-auto mt-8 w-full max-w-[640px]"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <h2
                        id="generation-examples-title"
                        className="text-base font-semibold text-slate-900"
                      >
                        Examples
                      </h2>
                      <p className="text-xs text-slate-500">
                        Click to use a prompt
                      </p>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {GENERATION_EXAMPLES.map((example) => {
                        const isSelected = selectedExampleId === example.id;
                        return (
                          <button
                            key={example.id}
                            type="button"
                            aria-pressed={isSelected}
                            disabled={isGenerating}
                            onClick={() => chooseGenerationExample(example)}
                            className={cn(
                              'group overflow-hidden rounded-xl border bg-white text-left transition-colors focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
                              isSelected
                                ? 'border-slate-900'
                                : 'border-slate-200 hover:border-slate-400'
                            )}
                          >
                            <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                              <img
                                src={example.image}
                                alt={`${example.title} example scientific figure`}
                                className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                              />
                            </div>
                            <div className="flex items-center justify-between gap-3 px-3 py-2.5">
                              <h3 className="text-sm font-medium text-slate-900">
                                {example.title}
                              </h3>
                              <span
                                className={cn(
                                  'shrink-0 text-xs',
                                  isSelected
                                    ? 'font-medium text-slate-900'
                                    : 'text-slate-400'
                                )}
                              >
                                {isSelected ? 'Added' : 'Use'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ) : (
                  <div className="flex flex-col gap-8">
                    {feedTurns.map((turn) => (
                      <article
                        key={turn.taskId}
                        className="flex flex-col gap-3"
                      >
                        <div className="flex flex-col items-end gap-1">
                          <p
                            title={turn.prompt}
                            className="line-clamp-6 max-w-[85%] rounded-2xl rounded-tr-md bg-slate-200/80 px-4 py-2.5 text-sm leading-6 break-words whitespace-pre-wrap text-slate-800"
                          >
                            {turn.prompt || 'Untitled figure'}
                          </p>
                          <button
                            type="button"
                            onClick={() => editTurnPrompt(turn.prompt)}
                            aria-label="Edit prompt"
                            title="Edit prompt"
                            className="flex size-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                        </div>
                        {turn.images.map((image) => (
                          <FeedImageCard
                            key={image.id}
                            image={image}
                            copy={SESSION_COPY}
                            onUseAsReference={useGeneratedImageAsReference}
                            onRegenerate={regenerateFromImage}
                            onPreview={previewFeedImage}
                          />
                        ))}
                      </article>
                    ))}
                    {(isGenerationRunning || genState.status === 'failed') && (
                      <article className="flex flex-col gap-3">
                        {/* The prompt of the in-flight generation — feed turns
                            only exist once an image completes, so without this
                            bubble the sent prompt would be invisible. */}
                        {pendingPrompt !== null && (
                          <div className="flex flex-col items-end">
                            <p
                              title={pendingPrompt}
                              className="line-clamp-6 max-w-[85%] rounded-2xl rounded-tr-md bg-slate-200/80 px-4 py-2.5 text-sm leading-6 break-words whitespace-pre-wrap text-slate-800"
                            >
                              {pendingPrompt}
                            </p>
                          </div>
                        )}
                        <FeedProgressCard
                          status={
                            genState.status === 'submitting' ||
                            genState.status === 'generating'
                              ? genState.status
                              : 'failed'
                          }
                          progress={
                            genState.status === 'generating'
                              ? genState.progress
                              : 0
                          }
                          errorMessage={
                            genState.status === 'failed'
                              ? genState.error.message
                              : undefined
                          }
                          copy={SESSION_COPY}
                          onRetry={restartGeneration}
                        />
                      </article>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Composer dock — the prompt card stays put at the bottom of
                the workspace while the history feed scrolls above it. */}
            <div className="shrink-0 bg-white px-4 pt-0 pb-5">
              <div className="mx-auto w-full max-w-[760px]">
                <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_12px_rgba(30,38,47,0.06)] transition-all duration-200 focus-within:border-slate-400 focus-within:shadow-[0_0_0_4px_rgba(15,23,42,0.06),0_16px_42px_rgba(30,41,47,0.14)]">
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
                      ref={promptInputRef}
                      rows={3}
                      placeholder="Describe a scientific figure, e.g. a mitochondrial ultrastructure with cristae and mtDNA labels…"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className={cn(
                        'min-h-[88px] resize-none rounded-none border-0 bg-white px-5 pb-4 text-base shadow-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0',
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
                              {ratio === aspect && (
                                <Check className="size-3.5" />
                              )}
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
                        onClick={() => void handleSubmit()}
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
              </div>
            </div>
          </section>
        ) : (
          <section className="min-h-screen overflow-hidden bg-white">
            {/* Workspace mode tabs (page title hidden) */}
            {showingFigureWorkspace && (
              <div className="mx-auto w-full max-w-[980px] px-4 pt-10 pb-4 text-center">
                <WorkspaceModeTabs
                  activeMode={workspaceMode}
                  onModeChange={setWorkspaceMode}
                />
              </div>
            )}

            <div className="mx-auto mt-6 w-full max-w-[760px] px-4 pb-12">
              {workspaceMode === 'svg-converter' ? (
                <SvgConverterWorkspace />
              ) : workspaceMode === 'svg-editor' ? (
                <SvgEditorWorkspace />
              ) : workspaceMode === 'flowchart' ? (
                <FlowchartWorkspace />
              ) : (
                <PlotWorkspace />
              )}
            </div>
          </section>
        )}
      </main>

      <ImagePreviewPanel
        copy={HISTORY_PANEL_COPY}
        defaultWidth={440}
        open={isPanelOpen}
        images={previewImages}
        activeId={activePreviewId}
        isGenerating={isGenerating}
        isLoadingHistory={historyQuery.isLoading}
        hasMore={historyQuery.hasNextPage}
        isLoadingMore={historyQuery.isFetchingNextPage}
        onLoadMore={() => void historyQuery.fetchNextPage()}
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

      <Dialog
        open={registrationPromptOpen}
        onOpenChange={(open) => {
          setRegistrationPromptOpen(open);
          if (!open) setLoginError('');
        }}
      >
        <DialogContent
          className="gap-5 p-6 sm:max-w-[25rem]"
          overlayClassName="bg-white"
        >
          <DialogTitle className="pr-8 text-center text-xl font-semibold tracking-tight text-slate-900">
            {m['common.sign.sign_in_title']()}
          </DialogTitle>

          <form className="space-y-4" onSubmit={handleEmailSignIn}>
            {loginError && (
              <p
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {loginError}
              </p>
            )}

            {googleEnabled && (
              <>
                <Button
                  className="h-11 w-full text-base"
                  disabled={isSigningIn}
                  onClick={handleGoogleSignIn}
                  type="button"
                  variant="outline"
                >
                  <svg
                    aria-hidden="true"
                    className="size-5"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  {m['common.sign.google_sign_in']()}
                </Button>
                {emailEnabled && (
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span>{m['common.sign.or']()}</span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                )}
              </>
            )}

            {emailEnabled && (
              <>
                <label className="block space-y-1.5 text-sm font-medium text-slate-800">
                  <span>{m['common.sign.email_title']()}</span>
                  <Input
                    autoComplete="email"
                    className="h-11 bg-white px-3"
                    onChange={(event) => setLoginEmail(event.target.value)}
                    placeholder={m['common.sign.email_placeholder']()}
                    required
                    type="email"
                    value={loginEmail}
                  />
                </label>
                <label className="block space-y-1.5 text-sm font-medium text-slate-800">
                  <span>{m['common.sign.password_title']()}</span>
                  <Input
                    autoComplete="current-password"
                    className="h-11 bg-white px-3"
                    onChange={(event) => setLoginPassword(event.target.value)}
                    placeholder={m['common.sign.password_placeholder']()}
                    required
                    type="password"
                    value={loginPassword}
                  />
                </label>
                <Button
                  className="h-11 w-full text-base"
                  disabled={isSigningIn}
                  type="submit"
                >
                  {isSigningIn ? '...' : m['common.sign.sign_in_title']()}
                </Button>
              </>
            )}

            <p className="pt-1 text-center text-sm text-slate-500">
              {m['common.sign.no_account']()}{' '}
              <Link
                className="font-medium text-slate-900 underline underline-offset-4"
                href="/sign-up?callbackUrl=/generate"
                onClick={() => {
                  persistGuestPrompt(prompt);
                  persistGuestAutoGeneration();
                }}
              >
                {m['common.sign.sign_up_title']()}
              </Link>
            </p>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={paymentPromptOpen}
        onOpenChange={(open) => {
          setPaymentPromptOpen(open);
          if (!open) setLoadingPaymentProvider(null);
        }}
      >
        <DialogContent
          className="gap-0 overflow-hidden rounded-3xl p-0 sm:max-w-2xl"
          overlayClassName="bg-white"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{m['generator.paywall.title']()}</DialogTitle>
            <DialogDescription>
              {m['generator.paywall.description']()}
            </DialogDescription>
          </DialogHeader>

          <div className="grid divide-y p-6 sm:p-8 md:grid-cols-2 md:divide-x md:divide-y-0">
            {/* Left — the offer: badge, plan name, price, purchase CTA */}
            <div className="pb-8 text-center md:pr-8 md:pb-0">
              <span className="mx-auto flex h-6 w-fit items-center rounded-full bg-linear-to-br/increasing from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-white/20 ring-inset">
                {m['generator.paywall.title']()}
              </span>
              <h3 className="mt-4 text-2xl font-semibold">
                {m['generator.paywall.plan_name']()}
              </h3>
              <p className="text-muted-foreground mt-2 text-lg">
                {m['generator.paywall.description']()}
              </p>
              <span className="mt-10 mb-6 inline-block text-5xl font-bold sm:text-6xl">
                <span className="align-top text-3xl sm:text-4xl">$</span>9
                <span className="text-muted-foreground ml-1 align-baseline text-lg font-medium sm:text-xl">
                  /mo
                </span>
              </span>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  type="button"
                  disabled={isStartingCheckout}
                  onClick={continueToPayment}
                >
                  {isStartingCheckout
                    ? m['common.pricing.processing']()
                    : m['generator.paywall.purchase']()}
                </Button>
              </div>
            </div>

            {/* Right — what the credits unlock */}
            <div className="pt-8 md:pt-0 md:pl-8">
              <ul role="list" className="space-y-4">
                {[
                  m['landing.pricing.f_612_credits'](),
                  m['landing.pricing.f_credit_rate'](),
                  m['landing.pricing.f_library'](),
                  m['landing.pricing.f_bilingual'](),
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="size-3 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-muted-foreground mt-6 text-sm">
                {m['landing.pricing.starter_desc']()}
              </p>
              <Link
                href="/pricing"
                onClick={() => setPaymentPromptOpen(false)}
                className="text-muted-foreground hover:text-foreground mt-6 inline-block text-sm underline underline-offset-4 transition-colors"
              >
                {m['generator.paywall.view_plans']()}
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PaymentProviderModal
        open={paymentProviderOpen}
        onOpenChange={(open) => {
          setPaymentProviderOpen(open);
          if (!open) setLoadingPaymentProvider(null);
        }}
        providers={
          enabledPaymentProviders.length
            ? enabledPaymentProviders
            : [defaultPaymentProvider]
        }
        loadingProvider={loadingPaymentProvider}
        onSelect={(provider) => void startCheckout(provider)}
        planName={m['generator.paywall.starter_title']()}
        price="$9"
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
  loader: () => {
    const locale = getLocale();

    return {
      title: m['generator.seo.title']({}, { locale }),
      description: m['generator.seo.description']({}, { locale }),
    };
  },
  component: GeneratePage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.title ?? 'Image Generate',
      },
      {
        name: 'description',
        content:
          loaderData?.description ??
          'Create publication-ready scientific figures from a text prompt, sketch, or reference image with AI.',
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
