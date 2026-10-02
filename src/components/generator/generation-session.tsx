import { formatElapsed } from '@/routes/generate/-state';
import {
  AlertCircle,
  Check,
  Clipboard,
  Download,
  Image as ImageIcon,
  ImageOff,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useImagePreview } from '@/hooks/use-image-preview';
import type { PreviewImage } from '@/components/image-preview-panel';
import { Button } from '@/components/ui/button';

export type GenerationSessionCopy = {
  title: string;
  preparing: string;
  rendering: string;
  complete: string;
  failed: string;
  prompt: string;
  image: string;
  generatingOne: string;
  elapsed: string;
  close: string;
  retry: string;
  regenerate: string;
  download: string;
  useAsReference: string;
  copyPrompt: string;
  imageUnavailable: string;
  imageUnavailableHint: string;
  renderingHint: string;
};

type SessionStatus = 'submitting' | 'generating' | 'succeeded' | 'failed';

type Props = {
  status: SessionStatus;
  progress: number;
  elapsed: number;
  prompt: string;
  image?: PreviewImage;
  errorMessage?: string;
  copy: GenerationSessionCopy;
  onClose: () => void;
  onRetry: () => void;
  onRegenerate: () => void;
  onUseAsReference: () => void;
  onCopyPrompt: () => void;
};

/** A quiet, single-purpose task surface for the image generator. */
export function GenerationSession({
  status,
  progress,
  elapsed,
  prompt,
  image,
  copy,
  onClose,
  onRetry,
  onRegenerate,
  onUseAsReference,
  onCopyPrompt,
}: Props) {
  const {
    objectUrl,
    status: imageState,
    retry: retryImagePreview,
  } = useImagePreview(image?.src);
  const isRunning = status === 'submitting' || status === 'generating';
  const isSuccess = status === 'succeeded';
  const safeProgress = Math.max(0, Math.min(100, Math.round(progress)));

  const retryPreview = () => {
    retryImagePreview();
    onRetry();
  };

  const title = isRunning
    ? status === 'submitting'
      ? copy.preparing
      : copy.rendering
    : isSuccess
      ? copy.complete
      : copy.failed;

  return (
    <section
      aria-label={copy.title}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_38px_rgba(30,41,59,0.08)]"
    >
      <div className="p-5 sm:p-6">
        {isRunning ? (
          <div className="flex min-h-[156px] items-center gap-5 rounded-xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5">
            <div className="flex h-24 w-32 shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm">
              <ImageIcon className="size-5" />
              <span className="mt-2 text-xs font-medium">{copy.image}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {copy.rendering}
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                {copy.renderingHint}
              </p>
              <div
                role="progressbar"
                aria-label={copy.rendering}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={safeProgress}
                className="mt-3 max-w-sm"
              >
                <div className="h-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-[width] duration-500"
                    style={{ width: `${safeProgress}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <span className="hidden sm:inline">{copy.generatingOne}</span>
                <LoaderCircle className="size-5 animate-spin text-sky-600" />
              </div>
            </div>
          </div>
        ) : isSuccess && image && imageState !== 'error' ? (
          <div className="space-y-4">
            <div className="relative flex min-h-[220px] items-center justify-center rounded-xl border border-slate-100 bg-slate-50 p-4">
              {imageState === 'loading' && (
                <LoaderCircle className="absolute size-5 animate-spin text-slate-400" />
              )}
              {objectUrl && (
                <img
                  key={image.id}
                  src={objectUrl}
                  alt={image.name ?? copy.title}
                  onError={retryPreview}
                  className={cn(
                    'max-h-[360px] w-full object-contain transition-opacity duration-200',
                    imageState === 'ready' ? 'opacity-100' : 'opacity-0'
                  )}
                />
              )}
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
              <div className="flex items-start gap-x-3">
                <p className="shrink-0 font-semibold text-slate-900">
                  {copy.prompt}
                </p>
                <p className="min-w-0 break-words whitespace-pre-wrap">
                  {prompt}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl border border-slate-100 bg-slate-50 px-6 text-center">
            <ImageOff className="size-6 text-slate-400" />
            <Button
              variant="outline"
              size="sm"
              onClick={onRegenerate}
              className="mt-4 rounded-full"
            >
              <RefreshCw className="size-3.5" />
              {copy.failed}
            </Button>
          </div>
        )}
      </div>

      {!isRunning && (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5">
          {isSuccess && imageState !== 'error' ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                nativeButton={false}
                render={
                  <a
                    href={image?.downloadUrl ?? image?.src}
                    download={image?.name}
                  />
                }
                className="h-10 gap-2.5 rounded-full border-slate-200 bg-white px-4 text-sm font-medium shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 [&_svg]:size-4"
              >
                <Download className="size-4" />
                {copy.download}
              </Button>
              <Button
                variant="outline"
                onClick={onUseAsReference}
                className="h-10 gap-2.5 rounded-full border-slate-200 bg-white px-4 text-sm font-medium shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 [&_svg]:size-4"
              >
                <Sparkles className="size-4" />
                {copy.useAsReference}
              </Button>
              <Button
                variant="outline"
                onClick={onCopyPrompt}
                className="h-10 gap-2.5 rounded-full border-slate-200 bg-white px-4 text-sm font-medium shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 [&_svg]:size-4"
              >
                <Clipboard className="size-4" />
                {copy.copyPrompt}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={onClose}
              className="h-10 gap-2.5 rounded-full border-slate-200 bg-white px-4 text-sm font-medium shadow-[0_1px_2px_rgba(15,23,42,0.04)] hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
            >
              {copy.close}
            </Button>
          )}
          <Button
            onClick={onRegenerate}
            className="h-10 gap-2.5 rounded-full bg-slate-800 px-4 text-sm font-medium hover:bg-slate-900"
          >
            <RefreshCw className="size-4" />
            {copy.regenerate}
          </Button>
        </footer>
      )}
    </section>
  );
}
