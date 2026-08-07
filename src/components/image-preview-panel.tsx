import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import {
  Check,
  ChevronDown,
  Download,
  ImageOff,
  LayoutGrid,
  Loader2,
  Maximize2,
  Minimize2,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import { apiGetBlob } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { useImagePreview } from '@/hooks/use-image-preview';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

export type PreviewImage = {
  id: string;
  src: string;
  /** Original provider/storage address, retained when it is needed as a public reference input. */
  sourceUrl?: string;
  /** Authenticated download endpoint. Falls back to src for local showcase assets. */
  downloadUrl?: string;
  /** Optional fallback name — derived from the URL when omitted. */
  name?: string;
  /** Optional generation prompt shown beside compact history thumbnails. */
  prompt?: string;
  /** Optional generation timestamp used by history consumers. */
  createdAt?: number;
  /** Optional generation model, displayed in the history contact sheet. */
  model?: string;
  /** Optional requested aspect ratio, displayed in the history contact sheet. */
  aspect?: string;
  /** Optional number of reference images used for generation. */
  referenceCount?: number;
};

export type ImageHistoryCopy = {
  imageCounter: (current: number, total: number) => string;
  imageTotal: (total: number) => string;
  download: string;
  expand: string;
  restore: string;
  close: string;
  gallery: string;
  preview: string;
  clear: string;
  searchPlaceholder: string;
  allModels: string;
  allAspects: string;
  today: string;
  yesterday: string;
  earlier: string;
  untitled: string;
  noMatches: string;
  loadMore: string;
  loadingMore: string;
  generated: string;
  references: (count: number) => string;
  loading: string;
  unavailable: string;
  dateLocale: string;
};

type Props = {
  /** Label shown above the gallery controls, supplied by the consuming page. */
  title?: string;
  /** Whether the full preview surface is expanded from its right-edge rail. */
  open: boolean;
  images: PreviewImage[];
  activeId: string | null;
  /** Expands the panel, normally when the user hovers its edge rail. */
  onOpen?: () => void;
  onClose: () => void;
  onSelect: (id: string) => void;
  /** Fires when the user clicks the Clear button. Parent should drop
   *  every image and reset the active id. */
  onClear?: () => void;
  /** When true, shows a generating indicator instead of the empty state. */
  isGenerating?: boolean;
  /** Whether the panel should collapse after the pointer leaves it. */
  closeOnPointerLeave?: boolean;
  /** Initial width in px when the panel first opens. */
  defaultWidth?: number;
  /** Hard min/max bounds in px. */
  minWidth?: number;
  maxWidth?: number;
  /** Content shown in the main canvas before the user has any images. */
  emptyState?: ReactNode;
  /** Labels supplied by the page so this reusable component stays i18n-free. */
  copy: ImageHistoryCopy;
  /** Loads the next persisted history page when one is available. */
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  /** Indicates the initial history query is still resolving. */
  isLoadingHistory?: boolean;
};

/**
 * Right-side slide-out preview panel.
 *
 * Reusable — all content comes through props. No i18n reads inside (this is a
 * component, not a block). Designed to mirror the figpad preview chrome:
 *
 *  ┌─ Header ───────────────────────────────┐
 *  │ Image 1 of 3      [markup] [open] [dl] │
 *  │                            [close]     │
 *  ├────────────────────────────────────────┤
 *  │                                        │
 *  │             <active image>             │
 *  │                                        │
 *  ├────────────────────────────────────────┤
 *  │ [thumb 1] [thumb 2] [thumb 3]          │
 *  └────────────────────────────────────────┘
 *
 * The left edge has a draggable col-resize handle. The panel is fixed to the
 * viewport on small screens (slides in from the right) and docks inline on
 * large screens so it can sit alongside the main work area.
 */
export function ImagePreviewPanel({
  title,
  open,
  images,
  activeId,
  onOpen,
  onClose,
  onSelect,
  onClear,
  isGenerating = false,
  closeOnPointerLeave = true,
  defaultWidth = 760,
  minWidth = 360,
  maxWidth = 1200,
  emptyState,
  copy,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  isLoadingHistory = false,
}: Props) {
  const [width, setWidth] = useState(defaultWidth);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const [search, setSearch] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [aspectFilter, setAspectFilter] = useState('all');
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'gallery'>('preview');
  const dragStateRef = useRef<{ startX: number; startWidth: number } | null>(
    null
  );
  const activeHistoryItemRef = useRef<HTMLButtonElement | null>(null);

  const models = useMemo(
    () =>
      Array.from(
        new Set(images.map((image) => image.model).filter(Boolean))
      ).sort() as string[],
    [images]
  );
  const aspects = useMemo(
    () =>
      Array.from(
        new Set(images.map((image) => image.aspect).filter(Boolean))
      ).sort() as string[],
    [images]
  );
  const filteredImages = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    return images.filter((image) => {
      const matchesSearch =
        !needle ||
        `${image.prompt ?? ''} ${image.name ?? ''}`
          .toLocaleLowerCase()
          .includes(needle);
      const matchesModel = modelFilter === 'all' || image.model === modelFilter;
      const matchesAspect =
        aspectFilter === 'all' || image.aspect === aspectFilter;
      return matchesSearch && matchesModel && matchesAspect;
    });
  }, [images, search, modelFilter, aspectFilter]);
  const historyGroups = useMemo(
    () => groupHistoryImages(filteredImages, copy),
    [filteredImages, copy]
  );

  const visibleImages = viewMode === 'gallery' ? filteredImages : images;
  const activeIndex = Math.max(
    0,
    visibleImages.findIndex((img) => img.id === activeId)
  );
  const activeImage = visibleImages[activeIndex] ?? null;
  const total = images.length;
  const visibleTotal = visibleImages.length;
  const counter = visibleTotal > 0 ? activeIndex + 1 : 0;

  // Reset width when the panel re-opens so a stale full-width toggle doesn't
  // surprise the user.
  useEffect(() => {
    if (open) {
      setIsFullWidth(false);
      setWidth(defaultWidth);
      setViewMode('preview');
    }
  }, [open, defaultWidth]);

  // Opening history before its query resolves used to leave the right panel
  // blank. Keep the current selection when possible, otherwise select the
  // newest figure as soon as the data arrives. Gallery filters must never
  // silently replace that selection; a gallery item becomes active only when
  // the user chooses it.
  useEffect(() => {
    if (!open || viewMode !== 'preview' || images.length === 0) return;
    if (!images.some((image) => image.id === activeId)) {
      onSelect(images[0].id);
    }
  }, [open, viewMode, images, activeId, onSelect]);

  useEffect(() => {
    if (!open || !activeHistoryItemRef.current) return;
    activeHistoryItemRef.current.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth',
    });
  }, [open, activeId, viewMode]);

  // Keyboard: Escape to close, ←/→ to cycle.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (
        viewMode === 'preview' &&
        e.key === 'ArrowRight' &&
        visibleTotal > 1
      ) {
        e.preventDefault();
        onSelect(visibleImages[(activeIndex + 1) % visibleTotal].id);
      } else if (
        viewMode === 'preview' &&
        e.key === 'ArrowLeft' &&
        visibleTotal > 1
      ) {
        e.preventDefault();
        onSelect(
          visibleImages[(activeIndex - 1 + visibleTotal) % visibleTotal].id
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    open,
    onClose,
    onSelect,
    visibleImages,
    activeIndex,
    visibleTotal,
    viewMode,
  ]);

  const beginResize = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isFullWidth) return;
      e.preventDefault();
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);
      dragStateRef.current = { startX: e.clientX, startWidth: width };
    },
    [isFullWidth, width]
  );

  const onResizeMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const state = dragStateRef.current;
      if (!state) return;
      // Panel grows when the handle is dragged left (negative delta).
      const next = Math.min(
        maxWidth,
        Math.max(minWidth, state.startWidth - (e.clientX - state.startX))
      );
      setWidth(next);
    },
    [maxWidth, minWidth]
  );

  const endResize = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragStateRef.current = null;
  }, []);

  const name =
    activeImage?.name ?? activeImage?.src.split('/').pop() ?? 'image';
  const panelStyle =
    open && !isFullWidth
      ? ({ '--preview-width': `${width}px` } as CSSProperties)
      : undefined;

  const downloadActiveImage = useCallback(async () => {
    if (!activeImage || isDownloading) return;

    setIsDownloading(true);
    try {
      const blob = await apiGetBlob(activeImage.downloadUrl ?? activeImage.src);
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = name;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch (error) {
      console.error('Unable to download generated image:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [activeImage, isDownloading, name]);

  return (
    <div className="contents">
      <aside
        id="generation-history"
        tabIndex={-1}
        role="region"
        aria-label="Image preview"
        data-state={open ? 'open' : 'closed'}
        onPointerEnter={() => onOpen?.()}
        onPointerLeave={closeOnPointerLeave ? onClose : undefined}
        className={cn(
          // On small screens history becomes a modal-like overlay so it never
          // steals the whole viewport from the generator. A slim rail keeps
          // the desktop preview reachable without occupying the workspace.
          open
            ? 'fixed inset-3 z-50 flex h-[calc(100dvh-1.5rem)] flex-col lg:relative lg:inset-auto lg:z-auto lg:h-dvh lg:shrink-0'
            : 'hidden lg:relative lg:z-auto lg:flex lg:h-dvh lg:shrink-0 lg:flex-col',
          'transition-[width] duration-200 ease-out',
          open
            ? 'lg:p-2 lg:pl-0'
            : 'border-border/70 bg-background/80 cursor-e-resize border-l',
          open
            ? isFullWidth
              ? 'lg:w-[min(96vw,1400px)]'
              : 'lg:w-[var(--preview-width)]'
            : 'lg:w-3'
        )}
        style={panelStyle}
      >
        {!open && (
          <button
            type="button"
            aria-label="Show image preview"
            aria-expanded="false"
            title="Move over to preview images"
            onFocus={() => onOpen?.()}
            onClick={() => onOpen?.()}
            className="absolute inset-0 w-full cursor-e-resize"
          />
        )}

        {open && (
          <>
            {/* Col-resize handle — only on lg+ */}
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize preview panel"
              onPointerDown={beginResize}
              onPointerMove={onResizeMove}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              className={cn(
                'group absolute top-6 bottom-6 -left-1.5 hidden w-3 cursor-col-resize lg:block',
                isFullWidth && 'pointer-events-none opacity-0'
              )}
            >
              <span className="group-hover:bg-primary/50 group-active:bg-primary absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-transparent transition-colors" />
            </div>

            <div className="bg-background flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl shadow-2xl lg:shadow-sm">
              {/* Header stays intentionally calm: history navigation is an
                  optional mode, while the default surface is for looking. */}
              <div className="flex min-h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  {title && (
                    <p className="truncate text-base font-semibold tracking-tight text-slate-900">
                      {title}
                    </p>
                  )}
                  {total > 0 && (
                    <p className="mt-0.5 text-xs text-slate-500">
                      {viewMode === 'gallery'
                        ? copy.imageTotal(visibleTotal)
                        : copy.imageCounter(counter, total)}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {total > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={
                        viewMode === 'gallery' ? copy.preview : copy.gallery
                      }
                      onClick={() =>
                        setViewMode((mode) =>
                          mode === 'gallery' ? 'preview' : 'gallery'
                        )
                      }
                      className="h-8 gap-1.5 rounded-lg border-slate-200 px-2.5 text-xs text-slate-700 shadow-none"
                    >
                      {viewMode === 'preview' && (
                        <LayoutGrid className="size-3.5" />
                      )}
                      {viewMode === 'gallery' ? copy.preview : copy.gallery}
                    </Button>
                  )}
                  {viewMode === 'preview' && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={copy.download}
                        title={copy.download}
                        disabled={!activeImage || isDownloading}
                        onClick={downloadActiveImage}
                      >
                        {isDownloading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Download />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={isFullWidth ? copy.restore : copy.expand}
                        title={isFullWidth ? copy.restore : copy.expand}
                        onClick={() => setIsFullWidth((v) => !v)}
                        disabled={!activeImage}
                      >
                        {isFullWidth ? (
                          <Minimize2 />
                        ) : (
                          <Maximize2 className="rotate-90" />
                        )}
                      </Button>
                    </>
                  )}
                  {onClear && total > 0 && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={copy.clear}
                      title={copy.clear}
                      onClick={onClear}
                    >
                      <Trash2 />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={copy.close}
                    title={copy.close}
                    onClick={onClose}
                  >
                    <X />
                  </Button>
                </div>
              </div>

              {/* The default is deliberately just one figure and a filmstrip.
                  Search, filters and metadata live behind the gallery action. */}
              <div className="flex min-h-0 flex-1 flex-col">
                {viewMode === 'preview' ? (
                  <>
                    <div className="flex min-h-0 flex-1 bg-[#fbfbfd] p-4 sm:p-6">
                      <div className="flex h-full min-h-[18rem] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:p-3">
                        {activeImage ? (
                          <PreviewAsset
                            image={activeImage}
                            alt={name}
                            containerClassName="h-full w-full"
                            className="h-full w-full rounded-xl object-contain"
                            fallbackClassName="h-full w-full rounded-xl bg-[#f8fafc]"
                            copy={copy}
                          />
                        ) : isGenerating || isLoadingHistory ? (
                          <div className="flex flex-col items-center gap-3 text-sm text-slate-500">
                            <span className="flex size-10 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-sky-600">
                              <Loader2 className="size-5 animate-spin" />
                            </span>
                            <p>{copy.loading}</p>
                          </div>
                        ) : (
                          (emptyState ?? null)
                        )}
                      </div>
                    </div>

                    {total > 0 && (
                      <section className="shrink-0 border-t border-slate-200 bg-white px-4 py-4 sm:px-5">
                        <div
                          role="list"
                          aria-label={title ?? copy.gallery}
                          className="flex gap-3 overflow-x-auto overscroll-x-contain pb-1"
                        >
                          {images.map((image, index) => {
                            const label =
                              image.prompt?.trim() ||
                              image.name ||
                              copy.untitled;
                            const selected = image.id === activeId;
                            return (
                              <button
                                key={image.id}
                                ref={selected ? activeHistoryItemRef : null}
                                type="button"
                                title={label}
                                aria-label={`${copy.generated} ${index + 1}: ${label}`}
                                aria-current={selected}
                                onClick={() => onSelect(image.id)}
                                className={cn(
                                  'focus-visible:ring-ring flex size-22 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-[#f6f7fb] p-1.5 transition-all focus-visible:ring-2 focus-visible:outline-none sm:size-24',
                                  selected
                                    ? 'border-sky-500 ring-2 ring-sky-500/20'
                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                )}
                              >
                                <PreviewAsset
                                  image={image}
                                  alt=""
                                  loading="lazy"
                                  containerClassName="size-full"
                                  className="size-full rounded-lg object-contain"
                                  fallbackClassName="size-full rounded-lg bg-[#f6f7fb]"
                                  compact
                                  copy={copy}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    )}
                  </>
                ) : (
                  <section className="flex min-h-0 flex-1 flex-col bg-[#f8fafc]">
                    <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 bg-white px-3 py-2.5 sm:px-4">
                      <label className="relative min-w-36 flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-slate-400" />
                        <Input
                          value={search}
                          onChange={(event) => setSearch(event.target.value)}
                          placeholder={copy.searchPlaceholder}
                          aria-label={copy.searchPlaceholder}
                          className="h-8 border-slate-200 bg-slate-50 pr-2 pl-8 text-xs shadow-none focus-visible:bg-white"
                        />
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={copy.allModels}
                          className="flex h-8 max-w-32 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-500 shadow-[0_1px_3px_rgba(30,38,47,0.06)] transition-colors outline-none hover:bg-slate-50 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                        >
                          <span className="truncate font-medium">
                            {modelFilter === 'all'
                              ? copy.allModels
                              : modelFilter}
                          </span>
                          <ChevronDown className="size-3 shrink-0 opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                          <DropdownMenuItem
                            onClick={() => setModelFilter('all')}
                            className="justify-between"
                          >
                            {copy.allModels}
                            {modelFilter === 'all' && (
                              <Check className="size-3.5" />
                            )}
                          </DropdownMenuItem>
                          {models.map((model) => (
                            <DropdownMenuItem
                              key={model}
                              onClick={() => setModelFilter(model)}
                              className="justify-between"
                            >
                              {model}
                              {modelFilter === model && (
                                <Check className="size-3.5" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          aria-label={copy.allAspects}
                          className="flex h-8 max-w-28 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-500 shadow-[0_1px_3px_rgba(30,38,47,0.06)] transition-colors outline-none hover:bg-slate-50 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                        >
                          <span className="truncate font-medium">
                            {aspectFilter === 'all'
                              ? copy.allAspects
                              : aspectFilter}
                          </span>
                          <ChevronDown className="size-3 shrink-0 opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-28">
                          <DropdownMenuItem
                            onClick={() => setAspectFilter('all')}
                            className="justify-between"
                          >
                            {copy.allAspects}
                            {aspectFilter === 'all' && (
                              <Check className="size-3.5" />
                            )}
                          </DropdownMenuItem>
                          {aspects.map((aspect) => (
                            <DropdownMenuItem
                              key={aspect}
                              onClick={() => setAspectFilter(aspect)}
                              className="justify-between"
                            >
                              {aspect}
                              {aspectFilter === aspect && (
                                <Check className="size-3.5" />
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-4">
                      {historyGroups.length > 0 ? (
                        <div className="space-y-4">
                          {historyGroups.map((group) => (
                            <section key={group.key} aria-label={group.label}>
                              <div className="sticky top-0 z-10 mb-2 flex items-center gap-2 bg-[#f8fafc]/95 py-1 text-[11px] font-semibold tracking-[0.08em] text-slate-500 uppercase backdrop-blur">
                                <span>{group.label}</span>
                                <span className="h-px flex-1 bg-slate-200" />
                                <span className="font-medium tracking-normal text-slate-400 normal-case">
                                  {group.images.length}
                                </span>
                              </div>
                              <div
                                role="list"
                                aria-label={group.label}
                                className="grid grid-cols-[repeat(auto-fill,minmax(116px,1fr))] gap-2.5"
                              >
                                {group.images.map((image, index) => {
                                  const label =
                                    image.prompt?.trim() ||
                                    image.name ||
                                    copy.untitled;
                                  const selected = image.id === activeId;
                                  return (
                                    <button
                                      key={image.id}
                                      ref={
                                        selected ? activeHistoryItemRef : null
                                      }
                                      type="button"
                                      title={label}
                                      aria-label={`${copy.generated} ${index + 1}: ${label}`}
                                      aria-current={selected}
                                      onClick={() => {
                                        onSelect(image.id);
                                        setViewMode('preview');
                                      }}
                                      className={cn(
                                        'group focus-visible:ring-ring rounded-xl border bg-white p-1.5 text-left shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none',
                                        selected
                                          ? 'border-sky-500 ring-2 ring-sky-500/20'
                                          : 'border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.09)]'
                                      )}
                                    >
                                      <span className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                                        <PreviewAsset
                                          image={image}
                                          alt=""
                                          loading="lazy"
                                          containerClassName="size-full"
                                          className="size-full object-contain"
                                          fallbackClassName="size-full bg-slate-50"
                                          compact
                                          copy={copy}
                                        />
                                      </span>
                                      <span className="mt-1.5 flex items-center justify-between gap-1 text-[10px] text-slate-400">
                                        <span>
                                          {formatHistoryTime(
                                            image.createdAt,
                                            copy
                                          )}
                                        </span>
                                        <span className="max-w-[64%] truncate text-right">
                                          {formatHistoryMeta(image, copy)}
                                        </span>
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            </section>
                          ))}

                          {hasMore && (
                            <div className="flex justify-center pt-1 pb-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onLoadMore}
                                disabled={isLoadingMore}
                                className="h-8 rounded-full border-slate-200 bg-white px-3 text-xs text-slate-600 shadow-sm"
                              >
                                {isLoadingMore && (
                                  <Loader2 className="size-3.5 animate-spin" />
                                )}
                                {isLoadingMore
                                  ? copy.loadingMore
                                  : copy.loadMore}
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-1.5 text-center text-xs text-slate-500">
                          <Search className="size-4 text-slate-300" />
                          <p>{copy.noMatches}</p>
                          {hasMore && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={onLoadMore}
                              disabled={isLoadingMore}
                              className="mt-1 h-8 rounded-full border-slate-200 bg-white px-3 text-xs text-slate-600 shadow-sm"
                            >
                              {isLoadingMore && (
                                <Loader2 className="size-3.5 animate-spin" />
                              )}
                              {isLoadingMore ? copy.loadingMore : copy.loadMore}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function groupHistoryImages(images: PreviewImage[], copy: ImageHistoryCopy) {
  const groups = new Map<string, { label: string; images: PreviewImage[] }>();

  for (const image of images) {
    const { key, label } = historyDateGroup(image.createdAt, copy);
    const group = groups.get(key) ?? { label, images: [] };
    group.images.push(image);
    groups.set(key, group);
  }

  return Array.from(groups, ([key, group]) => ({ key, ...group }));
}

function historyDateGroup(
  timestamp: number | undefined,
  copy: ImageHistoryCopy
) {
  if (!timestamp || !Number.isFinite(timestamp)) {
    return { key: 'unknown', label: copy.earlier };
  }

  const date = new Date(timestamp);
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  ).getTime();
  const dateStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
  const dayDifference = Math.round((todayStart - dateStart) / 86_400_000);
  const key = new Intl.DateTimeFormat('en-CA').format(date);

  if (dayDifference === 0) return { key, label: copy.today };
  if (dayDifference === 1) return { key, label: copy.yesterday };
  return {
    key,
    label: new Intl.DateTimeFormat(copy.dateLocale, {
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    }).format(date),
  };
}

function formatHistoryTime(
  timestamp: number | undefined,
  copy: ImageHistoryCopy
) {
  if (!timestamp || !Number.isFinite(timestamp)) return '—';
  return new Intl.DateTimeFormat(copy.dateLocale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
}

function formatHistoryMeta(image: PreviewImage, copy: ImageHistoryCopy) {
  const details = [image.aspect, image.model]
    .filter((detail): detail is string => Boolean(detail))
    .map((detail) => detail.replace('GPT Image ', 'GPT '));
  if (image.referenceCount) details.push(copy.references(image.referenceCount));
  return details.join(' · ') || 'auto';
}

function PreviewAsset({
  image,
  alt,
  className,
  containerClassName,
  fallbackClassName,
  compact = false,
  loading,
  copy,
}: {
  image: PreviewImage;
  alt: string;
  className: string;
  containerClassName: string;
  fallbackClassName: string;
  compact?: boolean;
  loading?: 'eager' | 'lazy';
  copy: ImageHistoryCopy;
}) {
  const previewTargetRef = useRef<HTMLSpanElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(loading !== 'lazy');

  // Native `loading="lazy"` cannot defer the authenticated Blob fetch in the
  // hook. Observe thumbnail cards instead, so a long history never downloads
  // every full-size scientific figure at once.
  useEffect(() => {
    if (loading !== 'lazy') {
      setIsNearViewport(true);
      return;
    }

    const target = previewTargetRef.current;
    if (!target || !('IntersectionObserver' in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: '240px 0px' }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [loading]);

  const { objectUrl, status, retry } = useImagePreview(
    isNearViewport ? image.src : undefined
  );

  let content: ReactNode;
  if (!isNearViewport) {
    content = (
      <span
        className={cn(
          'flex items-center justify-center text-slate-400',
          fallbackClassName
        )}
        aria-label={copy.loading}
      >
        <Loader2
          className={compact ? 'size-3.5 animate-spin' : 'size-6 animate-spin'}
          aria-hidden="true"
        />
      </span>
    );
  } else if (status === 'error') {
    content = (
      <span
        className={cn(
          'flex items-center justify-center text-slate-400',
          fallbackClassName
        )}
        title={compact ? undefined : copy.unavailable}
      >
        <ImageOff
          className={compact ? 'size-3.5' : 'size-7'}
          aria-hidden="true"
        />
      </span>
    );
  } else if (!objectUrl) {
    content = (
      <span
        className={cn(
          'flex items-center justify-center text-slate-400',
          fallbackClassName
        )}
        aria-label={copy.loading}
      >
        <Loader2
          className={compact ? 'size-3.5 animate-spin' : 'size-6 animate-spin'}
          aria-hidden="true"
        />
      </span>
    );
  } else {
    content = (
      <img
        src={objectUrl}
        alt={alt}
        loading={loading}
        onError={retry}
        className={className}
      />
    );
  }

  return (
    <span ref={previewTargetRef} className={cn('block', containerClassName)}>
      {content}
    </span>
  );
}
