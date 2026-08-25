import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Check,
  ChevronDown,
  Clock3,
  Download,
  FileImage,
  FolderOpen,
  ImagePlus,
  Layers3,
  LoaderCircle,
  PanelTop,
  Plus,
  Send,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { apiGet, apiPatch, apiPost, apiPostForm } from '@/lib/api-client';
import { getUuid } from '@/lib/hash';
import { cn } from '@/lib/utils';
import { useImagePreview } from '@/hooks/use-image-preview';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';

const ASPECTS = ['1:1', '4:3', '3:4', '16:9'] as const;
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

type InputIntent = 'enhance' | 'sketch' | 'reference';
type FigureStyle = 'flat' | 'detailed';

type ReferenceImage = {
  id: string;
  name: string;
  url: string;
};

type GenerationTask = {
  id: string;
  status: string;
  taskStatus?: string;
  progress: number;
  estimatedTime: number | null;
  results?: string[];
  error?: string;
};

type HistoryItem = {
  id: string;
  src: string;
  prompt: string;
  model: string;
  createdAt: string;
  aspect: string;
  referenceCount: number;
};

type HistoryResponse = {
  items: HistoryItem[];
  hasMore: boolean;
  nextPage: number | null;
};

type ProjectSettings = {
  aspect: (typeof ASPECTS)[number];
  resolution: (typeof RESOLUTIONS)[number];
  quality: (typeof QUALITIES)[number];
  style: FigureStyle;
};

type FigureProject = {
  id: string;
  title: string;
  prompt: string;
  settings: string;
  referenceImages: string;
  latestImageUrl: string | null;
  updatedAt: string;
};

type StudioResult = {
  id: string;
  previewUrl: string;
  downloadUrl: string;
  referenceUrl?: string;
  prompt: string;
  elapsedMs: number;
};

export type FigureStudioTemplate = {
  id: string;
  title: string;
  description: string;
  image: string;
  prompt: string;
  aspect: (typeof ASPECTS)[number];
  quality: (typeof QUALITIES)[number];
  style: FigureStyle;
};

export type FigureStudioCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  illustration: string;
  flowchart: string;
  plot: string;
  beta: string;
  comingSoon: string;
  enhance: string;
  sketch: string;
  addReference: string;
  promptPlaceholder: string;
  enhancePlaceholder: string;
  sketchPlaceholder: string;
  referencePlaceholder: string;
  attach: string;
  removeReference: (name: string) => string;
  style: string;
  flat: string;
  detailed: string;
  aspect: string;
  resolution: string;
  quality: string;
  model: string;
  generate: string;
  generating: string;
  signInNotice: string;
  signIn: string;
  templates: string;
  templateHint: string;
  promptApplied: string;
  recent: string;
  recentEmpty: string;
  working: string;
  elapsed: string;
  download: string;
  retry: string;
  useAsReference: string;
  referenceUploaded: (count: number) => string;
  referenceUnavailable: string;
  referenceUnsupported: string;
  referenceTooLarge: string;
  referenceLimit: string;
  storagePublicRequired: string;
  uploadFailed: string;
  generated: string;
  projects: string;
  projectHint: string;
  projectNew: string;
  projectEmpty: string;
  projectOpened: string;
  projectDraft: string;
};

type Props = {
  copy: FigureStudioCopy;
  templates: FigureStudioTemplate[];
  signInHref: string;
};

export function FigureStudioWorkspace({ copy, templates, signInHref }: Props) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [intent, setIntent] = useState<InputIntent>('reference');
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<FigureStyle>('flat');
  const [aspect, setAspect] = useState<(typeof ASPECTS)[number]>('4:3');
  const [resolution, setResolution] =
    useState<(typeof RESOLUTIONS)[number]>('1K');
  const [quality, setQuality] = useState<(typeof QUALITIES)[number]>('medium');
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTask, setActiveTask] = useState<GenerationTask | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [result, setResult] = useState<StudioResult | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );

  const historyQuery = useQuery({
    queryKey: ['figure-studio-history'],
    queryFn: () => apiGet<HistoryResponse>('/api/ai/images?limit=6&page=1'),
    enabled: Boolean(session?.user),
    staleTime: 30_000,
  });

  const projectsQuery = useQuery({
    queryKey: ['figure-studio-projects'],
    queryFn: () => apiGet<FigureProject[]>('/api/figure-projects?limit=6'),
    enabled: Boolean(session?.user),
    staleTime: 20_000,
  });

  const isGenerating = activeTask !== null;
  const isBusy = isGenerating || isSavingProject;
  const canGenerate =
    Boolean(session?.user) &&
    prompt.trim().length >= 3 &&
    !isBusy &&
    !isUploading;
  const activeProject = projectsQuery.data?.find(
    (project) => project.id === activeProjectId
  );

  useEffect(() => {
    if (!startedAt || !isGenerating) return;
    setElapsedMs(Date.now() - startedAt);
    const timer = window.setInterval(
      () => setElapsedMs(Date.now() - startedAt),
      1_000
    );
    return () => window.clearInterval(timer);
  }, [isGenerating, startedAt]);

  useEffect(() => {
    if (!activeTask) return;
    let stopped = false;

    const poll = async () => {
      try {
        const currentTask = await apiGet<GenerationTask>(
          `/api/ai/images/${encodeURIComponent(activeTask.id)}`
        );
        if (stopped) return;

        const isComplete =
          currentTask.status === 'completed' ||
          currentTask.status === 'success' ||
          currentTask.taskStatus === 'success';
        if (isComplete && currentTask.results?.[0]) {
          const preview = taskPreviewUrls(currentTask.id, 0, Date.now());
          setResult({
            id: `${currentTask.id}:0`,
            previewUrl: preview.previewUrl,
            downloadUrl: preview.downloadUrl,
            referenceUrl: currentTask.results[0],
            prompt,
            elapsedMs: startedAt ? Date.now() - startedAt : 0,
          });
          setActiveTask(null);
          setStartedAt(null);
          queryClient.invalidateQueries({
            queryKey: ['figure-studio-history'],
          });
          queryClient.invalidateQueries({
            queryKey: ['figure-studio-projects'],
          });
          toast.success(copy.generated);
          return;
        }

        const isFailed =
          currentTask.status === 'failed' ||
          currentTask.taskStatus === 'failed' ||
          currentTask.taskStatus === 'canceled' ||
          currentTask.taskStatus === 'cancelled';
        if (isFailed) {
          setActiveTask(null);
          setStartedAt(null);
          toast.error(currentTask.error || copy.retry);
          return;
        }

        setActiveTask(currentTask);
      } catch (error) {
        if (!stopped) {
          setActiveTask(null);
          setStartedAt(null);
          toast.error(error instanceof Error ? error.message : copy.retry);
        }
      }
    };

    void poll();
    const interval = window.setInterval(
      () => void poll(),
      TASK_POLL_INTERVAL_MS
    );
    return () => {
      stopped = true;
      window.clearInterval(interval);
    };
  }, [
    activeTask?.id,
    copy.promptApplied,
    copy.retry,
    prompt,
    queryClient,
    startedAt,
  ]);

  const beginInputIntent = (nextIntent: InputIntent) => {
    setIntent(nextIntent);
    fileInputRef.current?.click();
  };

  const uploadReferences = async (files: File[]) => {
    if (files.length === 0) return;
    const unsupported = files.find(
      (file) => !REFERENCE_IMAGE_TYPES.has(file.type)
    );
    if (unsupported) {
      toast.error(copy.referenceUnsupported);
      return;
    }
    const oversized = files.find(
      (file) => file.size > REFERENCE_IMAGE_MAX_BYTES
    );
    if (oversized) {
      toast.error(copy.referenceTooLarge);
      return;
    }

    const remaining = 16 - referenceImages.length;
    if (remaining <= 0) {
      toast.error(copy.referenceLimit);
      return;
    }

    const form = new FormData();
    files.slice(0, remaining).forEach((file) => form.append('files', file));
    setIsUploading(true);
    try {
      const uploaded = await apiPostForm<{
        results: Array<{
          filename: string;
          url: string;
          publiclyAccessible?: boolean;
        }>;
      }>('/api/storage/upload-image?purpose=reference', form);
      const accessible = uploaded.results.filter(
        (image) => image.publiclyAccessible && /^https?:\/\//i.test(image.url)
      );
      if (accessible.length !== uploaded.results.length) {
        toast.error(copy.storagePublicRequired);
      }
      if (accessible.length) {
        setReferenceImages((current) => [
          ...current,
          ...accessible.map((image) => ({
            id: getUuid(),
            name: image.filename,
            url: image.url,
          })),
        ]);
        toast.success(copy.referenceUploaded(accessible.length));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.uploadFailed);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    const visualDirection =
      style === 'flat'
        ? 'Use a clean, flat, publication-ready scientific illustration style.'
        : 'Use a detailed, polished scientific illustration style with clear labels.';
    const submittedPrompt = `${prompt.trim()}\n\n${visualDirection}`;
    setResult(null);
    setIsSavingProject(true);
    try {
      const project = await saveProject({
        activeProjectId,
        prompt: prompt.trim(),
        aspect,
        resolution,
        quality,
        style,
        referenceImages,
      });
      setActiveProjectId(project.id);
      const task = await apiPost<GenerationTask>('/api/ai/images', {
        model: 'gpt-image-2',
        prompt: submittedPrompt,
        size: aspect,
        resolution,
        quality,
        n: 1,
        image_urls: referenceImages.map((image) => image.url),
      });
      await apiPatch(`/api/figure-projects/${encodeURIComponent(project.id)}`, {
        latestTaskId: task.id,
      });
      setStartedAt(Date.now());
      setElapsedMs(0);
      setActiveTask(task);
      queryClient.invalidateQueries({ queryKey: ['figure-studio-projects'] });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.retry);
    } finally {
      setIsSavingProject(false);
    }
  };

  const applyTemplate = (template: FigureStudioTemplate) => {
    setPrompt(template.prompt);
    setAspect(template.aspect);
    setQuality(template.quality);
    setStyle(template.style);
    setSelectedTemplateId(template.id);
    setActiveProjectId(null);
    window.requestAnimationFrame(() => promptInputRef.current?.focus());
    toast.success(copy.promptApplied);
  };

  const restoreFromHistory = (item: HistoryItem) => {
    setPrompt(stripStyleDirection(item.prompt));
    if (ASPECTS.includes(item.aspect as (typeof ASPECTS)[number])) {
      setAspect(item.aspect as (typeof ASPECTS)[number]);
    }
    setSelectedTemplateId(null);
    setActiveProjectId(null);
    window.requestAnimationFrame(() => promptInputRef.current?.focus());
  };

  const openProject = (project: FigureProject) => {
    const settings = parseProjectSettings(project.settings);
    if (!settings) {
      toast.error(copy.retry);
      return;
    }
    setPrompt(project.prompt);
    setAspect(settings.aspect);
    setResolution(settings.resolution);
    setQuality(settings.quality);
    setStyle(settings.style);
    setReferenceImages(
      parseReferenceUrls(project.referenceImages).map((url, index) => ({
        id: getUuid(),
        name: `reference-${index + 1}`,
        url,
      }))
    );
    setResult(null);
    setSelectedTemplateId(null);
    setActiveProjectId(project.id);
    window.requestAnimationFrame(() => promptInputRef.current?.focus());
    toast.success(copy.projectOpened);
  };

  const startNewDraft = () => {
    setActiveProjectId(null);
    setPrompt('');
    setStyle('flat');
    setAspect('4:3');
    setResolution('1K');
    setQuality('medium');
    setReferenceImages([]);
    setResult(null);
    setSelectedTemplateId(null);
    window.requestAnimationFrame(() => promptInputRef.current?.focus());
  };

  const useResultAsReference = () => {
    if (!result?.referenceUrl || !/^https?:\/\//i.test(result.referenceUrl)) {
      toast.error(copy.referenceUnavailable);
      return;
    }
    setReferenceImages((current) =>
      current.some((image) => image.url === result.referenceUrl)
        ? current
        : [
            ...current,
            {
              id: getUuid(),
              name: 'generated-figure.png',
              url: result.referenceUrl,
            },
          ]
    );
    setResult(null);
    window.requestAnimationFrame(() => promptInputRef.current?.focus());
  };

  const placeholder =
    intent === 'enhance'
      ? copy.enhancePlaceholder
      : intent === 'sketch'
        ? copy.sketchPlaceholder
        : copy.referencePlaceholder || copy.promptPlaceholder;

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-slate-950 sm:px-6 lg:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <header className="text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            {copy.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            {copy.subtitle}
          </p>
        </header>

        <section className="mx-auto mt-8 max-w-4xl" aria-label={copy.title}>
          <div className="mx-auto flex w-full max-w-2xl justify-center gap-2">
            <ModeButton active icon={<Sparkles />} label={copy.illustration} />
            <ModeButton
              icon={<Layers3 />}
              label={copy.flowchart}
              badge={copy.comingSoon}
              disabled
            />
            <ModeButton
              icon={<PanelTop />}
              label={copy.plot}
              badge={copy.beta}
              disabled
            />
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            <InputPathButton
              active={intent === 'enhance'}
              icon={<WandSparkles />}
              label={copy.enhance}
              disabled={isBusy || isUploading}
              onClick={() => beginInputIntent('enhance')}
            />
            <InputPathButton
              active={intent === 'sketch'}
              icon={<FileImage />}
              label={copy.sketch}
              disabled={isBusy || isUploading}
              onClick={() => beginInputIntent('sketch')}
            />
            <InputPathButton
              active={intent === 'reference'}
              icon={<ImagePlus />}
              label={copy.addReference}
              disabled={isBusy || isUploading}
              onClick={() => beginInputIntent('reference')}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.gif"
            multiple
            className="hidden"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              event.target.value = '';
              void uploadReferences(files);
            }}
          />

          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
            {referenceImages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3">
                {referenceImages.map((image) => (
                  <div
                    key={image.id}
                    className="group relative size-14 shrink-0"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="size-full rounded-lg border border-slate-200 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setReferenceImages((current) =>
                          current.filter((item) => item.id !== image.id)
                        )
                      }
                      aria-label={copy.removeReference(image.name)}
                      className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full border border-white bg-slate-800 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus:opacity-100"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Textarea
              ref={promptInputRef}
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={placeholder}
              rows={6}
              disabled={isBusy}
              className="min-h-44 resize-none rounded-none border-0 px-5 py-4 text-base shadow-none focus-visible:ring-0"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isBusy || isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label={copy.attach}
                  className="grid size-9 place-items-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <ImagePlus className="size-4" />
                  )}
                </button>
                <PillMenu
                  label={copy.aspect}
                  value={aspect}
                  values={ASPECTS}
                  disabled={isBusy}
                  onValueChange={setAspect}
                />
                <PillMenu
                  label={copy.resolution}
                  value={resolution}
                  values={RESOLUTIONS}
                  disabled={isBusy}
                  onValueChange={setResolution}
                />
                <PillMenu
                  label={copy.quality}
                  value={quality}
                  values={QUALITIES}
                  disabled={isBusy}
                  format={(value) => value[0].toUpperCase() + value.slice(1)}
                  onValueChange={setQuality}
                />
              </div>

              <div className="flex items-center gap-2">
                <PillMenu
                  label={copy.style}
                  value={style}
                  values={['flat', 'detailed'] as const}
                  disabled={isBusy}
                  format={(value) =>
                    value === 'flat' ? copy.flat : copy.detailed
                  }
                  onValueChange={setStyle}
                />
                <Button
                  type="button"
                  disabled={!canGenerate}
                  onClick={() => void handleGenerate()}
                  className="size-10 rounded-xl bg-slate-900 p-0 shadow-[0_8px_18px_rgba(15,23,42,0.18)] hover:bg-slate-800"
                  aria-label={copy.generate}
                  title={copy.generate}
                >
                  {isBusy ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-1.5 border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
              <FolderOpen className="size-3.5" />
              <span className="truncate">
                {activeProject?.title || copy.projectDraft}
              </span>
            </div>
          </div>

          {!session?.user && (
            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
              <span>{copy.signInNotice}</span>
              <Link
                href={signInHref}
                className="font-semibold text-slate-900 underline underline-offset-4"
              >
                {copy.signIn}
              </Link>
            </div>
          )}

          {activeTask && (
            <GenerationStatus
              copy={copy}
              progress={activeTask.progress}
              elapsedMs={elapsedMs}
              estimatedTime={activeTask.estimatedTime}
            />
          )}

          {result && (
            <ResultCard
              result={result}
              copy={copy}
              onRetry={() => void handleGenerate()}
              onUseAsReference={useResultAsReference}
            />
          )}
        </section>

        <section
          className="mx-auto mt-10 max-w-6xl"
          aria-labelledby="studio-templates-title"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="studio-templates-title"
              className="text-lg font-semibold tracking-tight"
            >
              {copy.templates}
            </h2>
            <p className="text-xs text-slate-500">{copy.templateHint}</p>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                disabled={isBusy}
                onClick={() => applyTemplate(template)}
                className={cn(
                  'group overflow-hidden rounded-xl border bg-white text-left transition-all focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
                  selectedTemplateId === template.id
                    ? 'border-slate-900 ring-1 ring-slate-900/10'
                    : 'border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md'
                )}
              >
                <img
                  src={template.image}
                  alt={template.title}
                  className="aspect-[16/9] w-full object-cover"
                />
                <div className="flex items-start justify-between gap-3 px-3 py-3">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {template.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      {template.description}
                    </p>
                  </div>
                  {selectedTemplateId === template.id && (
                    <Check className="mt-0.5 size-4 shrink-0 text-slate-900" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {session?.user && (
          <section
            className="mx-auto mt-10 max-w-6xl"
            aria-labelledby="studio-projects-title"
          >
            <div className="flex items-baseline justify-between gap-4">
              <div>
                <h2
                  id="studio-projects-title"
                  className="text-lg font-semibold tracking-tight"
                >
                  {copy.projects}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {copy.projectHint}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={startNewDraft}
                disabled={isBusy}
                className="gap-1.5"
              >
                <Plus className="size-3.5" />
                {copy.projectNew}
              </Button>
            </div>
            {projectsQuery.isLoading ? (
              <div className="mt-4 h-24 animate-pulse rounded-xl bg-slate-200/70" />
            ) : projectsQuery.data?.length ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {projectsQuery.data.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    disabled={isBusy}
                    onClick={() => openProject(project)}
                    className={cn(
                      'flex min-w-0 items-center gap-3 rounded-xl border bg-white p-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60',
                      project.id === activeProjectId
                        ? 'border-slate-900 ring-1 ring-slate-900/10'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    <ProjectThumbnail project={project} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900">
                        {project.title}
                      </span>
                      <span className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                        <Clock3 className="size-3" />
                        {formatDate(project.updatedAt)}
                      </span>
                    </span>
                    {project.id === activeProjectId && (
                      <Check className="ml-auto size-4 shrink-0 text-slate-900" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">{copy.projectEmpty}</p>
            )}
          </section>
        )}

        <section
          className="mx-auto mt-10 max-w-6xl pb-10"
          aria-labelledby="studio-recent-title"
        >
          <h2
            id="studio-recent-title"
            className="text-lg font-semibold tracking-tight"
          >
            {copy.recent}
          </h2>
          {!session?.user ? null : historyQuery.isLoading ? (
            <div className="mt-4 h-24 animate-pulse rounded-xl bg-slate-200/70" />
          ) : historyQuery.data?.items.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {historyQuery.data.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => restoreFromHistory(item)}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <HistoryThumbnail item={item} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-900">
                      {item.prompt}
                    </span>
                    <span className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <Clock3 className="size-3" />
                      {formatDate(item.createdAt)}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-500">{copy.recentEmpty}</p>
          )}
        </section>
      </div>
    </main>
  );
}

function ModeButton({
  active,
  badge,
  disabled,
  icon,
  label,
}: {
  active?: boolean;
  badge?: string;
  disabled?: boolean;
  icon: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'relative inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors',
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-slate-200 bg-white text-slate-400 disabled:cursor-not-allowed'
      )}
    >
      <span className="[&_svg]:size-4">{icon}</span>
      {label}
      {badge && (
        <span className="absolute -top-2 right-1 rounded-full border border-slate-300 bg-white px-1.5 text-[10px] leading-4 text-slate-500">
          {badge}
        </span>
      )}
    </button>
  );
}

function InputPathButton({
  active,
  disabled,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  disabled: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-10 items-center justify-center gap-2 rounded-xl border bg-white text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        active
          ? 'border-slate-900 bg-slate-900 text-white'
          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
      )}
    >
      <span className="[&_svg]:size-4">{icon}</span>
      {label}
    </button>
  );
}

function PillMenu<T extends string>({
  disabled,
  format = (value) => value,
  label,
  onValueChange,
  value,
  values,
}: {
  disabled?: boolean;
  format?: (value: T) => string;
  label: string;
  onValueChange: (value: T) => void;
  value: T;
  values: readonly T[];
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        aria-label={label}
        className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors outline-none hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span>{format(value)}</span>
        <ChevronDown className="size-3.5 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32">
        {values.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onValueChange(option)}
            className="justify-between"
          >
            {format(option)}
            {option === value && <Check className="size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GenerationStatus({
  copy,
  elapsedMs,
  estimatedTime,
  progress,
}: {
  copy: FigureStudioCopy;
  elapsedMs: number;
  estimatedTime: number | null;
  progress: number;
}) {
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));
  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        <LoaderCircle className="size-5 animate-spin text-slate-700" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">{copy.working}</p>
          <p className="mt-1 text-xs text-slate-500">
            {copy.elapsed}: {formatElapsed(elapsedMs)}
            {estimatedTime ? ` · ~${estimatedTime}s` : ''}
          </p>
        </div>
        <span className="text-sm font-semibold text-slate-700 tabular-nums">
          {safeProgress}%
        </span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-slate-900 transition-[width] duration-500"
          style={{ width: `${safeProgress}%` }}
        />
      </div>
    </div>
  );
}

function ResultCard({
  copy,
  onRetry,
  onUseAsReference,
  result,
}: {
  copy: FigureStudioCopy;
  onRetry: () => void;
  onUseAsReference: () => void;
  result: StudioResult;
}) {
  const { objectUrl, status } = useImagePreview(result.previewUrl);
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="relative flex min-h-72 items-center justify-center bg-slate-50 p-4">
        {status === 'loading' && (
          <LoaderCircle className="size-5 animate-spin text-slate-400" />
        )}
        {objectUrl && (
          <img
            src={objectUrl}
            alt={result.prompt}
            className="max-h-[520px] w-full object-contain"
          />
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-4 py-3">
        <span className="text-xs text-slate-500">
          {copy.elapsed}: {formatElapsed(result.elapsedMs)}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={result.downloadUrl}
            download="scientific-figure.png"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Download className="size-3.5" />
            {copy.download}
          </a>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onUseAsReference}
          >
            <ImagePlus className="size-3.5" />
            {copy.useAsReference}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            <WandSparkles className="size-3.5" />
            {copy.retry}
          </Button>
        </div>
      </div>
    </div>
  );
}

async function saveProject(params: {
  activeProjectId: string | null;
  prompt: string;
  aspect: ProjectSettings['aspect'];
  resolution: ProjectSettings['resolution'];
  quality: ProjectSettings['quality'];
  style: ProjectSettings['style'];
  referenceImages: ReferenceImage[];
}): Promise<FigureProject> {
  const payload = {
    prompt: params.prompt,
    settings: {
      aspect: params.aspect,
      resolution: params.resolution,
      quality: params.quality,
      style: params.style,
    },
    referenceImages: params.referenceImages.map((image) => image.url),
  };
  if (params.activeProjectId) {
    return apiPatch<FigureProject>(
      `/api/figure-projects/${encodeURIComponent(params.activeProjectId)}`,
      payload
    );
  }
  return apiPost<FigureProject>('/api/figure-projects', payload);
}

function ProjectThumbnail({ project }: { project: FigureProject }) {
  return project.latestImageUrl ? (
    <img
      src={project.latestImageUrl}
      alt=""
      className="size-14 shrink-0 rounded-lg border border-slate-200 object-cover"
    />
  ) : (
    <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-400">
      <FolderOpen className="size-4" />
    </span>
  );
}

function HistoryThumbnail({ item }: { item: HistoryItem }) {
  const [taskId, index] = splitImageId(item.id);
  const { objectUrl } = useImagePreview(
    taskPreviewUrls(taskId, index, item.createdAt).previewUrl
  );
  return objectUrl ? (
    <img
      src={objectUrl}
      alt=""
      className="size-14 shrink-0 rounded-lg border border-slate-200 object-cover"
    />
  ) : (
    <span className="grid size-14 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-400">
      <FileImage className="size-4" />
    </span>
  );
}

function taskPreviewUrls(
  taskId: string,
  index: number,
  version?: string | number
) {
  const base = `/api/ai/images/${encodeURIComponent(taskId)}/preview/${index}`;
  const previewVersion = version
    ? `preview_version=${encodeURIComponent(String(version))}`
    : '';
  return {
    previewUrl: previewVersion ? `${base}?${previewVersion}` : base,
    downloadUrl: `${base}?download=1${previewVersion ? `&${previewVersion}` : ''}`,
  };
}

function splitImageId(id: string): [string, number] {
  const match = /^(.*):(\d+)$/.exec(id);
  return match ? [match[1], Number(match[2])] : [id, 0];
}

function parseProjectSettings(value: string): ProjectSettings | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }
    const settings = parsed as Record<string, unknown>;
    if (
      typeof settings.aspect !== 'string' ||
      typeof settings.resolution !== 'string' ||
      typeof settings.quality !== 'string' ||
      typeof settings.style !== 'string' ||
      !(ASPECTS as readonly string[]).includes(settings.aspect) ||
      !(RESOLUTIONS as readonly string[]).includes(settings.resolution) ||
      !(QUALITIES as readonly string[]).includes(settings.quality) ||
      !(['flat', 'detailed'] as const).includes(settings.style as FigureStyle)
    ) {
      return null;
    }
    return {
      aspect: settings.aspect as ProjectSettings['aspect'],
      resolution: settings.resolution as ProjectSettings['resolution'],
      quality: settings.quality as ProjectSettings['quality'],
      style: settings.style as FigureStyle,
    };
  } catch {
    return null;
  }
}

function parseReferenceUrls(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is string =>
            typeof item === 'string' && /^https?:\/\//i.test(item)
        )
      : [];
  } catch {
    return [];
  }
}

function stripStyleDirection(value: string) {
  return value
    .replace(
      /\n\nUse a clean, flat, publication-ready scientific illustration style\.$/,
      ''
    )
    .replace(
      /\n\nUse a detailed, polished scientific illustration style with clear labels\.$/,
      ''
    );
}

function formatElapsed(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1_000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}
