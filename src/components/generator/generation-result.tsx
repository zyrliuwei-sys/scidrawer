'use client';

import { useState } from 'react';
import { formatElapsed } from '@/routes/generate/-state';
import { Check, Copy, Download, RefreshCw, Sparkles, Star } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

export function GenerationResult({
  image,
  creditsRemaining,
  elapsed,
  model,
  aspect,
  onRegenerate,
  onUseAsReference,
}: {
  image: { src: string; name: string };
  creditsRemaining?: number;
  elapsed: number;
  model: string;
  aspect: string;
  onRegenerate: () => void;
  onUseAsReference: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [rated, setRated] = useState<'up' | 'down' | null>(null);

  return (
    <div className="flex h-full w-full flex-col">
      {/* Figure area — the image with a hover-revealed metadata overlay. */}
      <div className="group/fig relative flex-1 overflow-hidden rounded-t-xl bg-slate-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.src}
          alt={image.name}
          className="h-full w-full object-contain"
        />

        {/* Success toast — slides in from top. */}
        <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-emerald-200 bg-white/95 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur-sm">
            <Check className="size-3.5" />
            Generated · {formatElapsed(elapsed)}
            {creditsRemaining === undefined
              ? ''
              : ` · ${creditsRemaining} credits left`}
          </div>
        </div>

        {/* Metadata overlay — bottom-right, semi-transparent. */}
        <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-1.5 rounded-md bg-slate-900/70 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity group-hover/fig:opacity-100">
          <span className="opacity-80">{aspect}</span>
          <span className="opacity-50">·</span>
          <span className="opacity-80">{model}</span>
          <span className="opacity-50">·</span>
          <span className="tabular-nums opacity-80">
            {formatElapsed(elapsed)}
          </span>
        </div>
      </div>

      {/* Action bar — download, regenerate, use as reference, rate. */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t bg-white px-3 py-2">
        <div className="flex items-center gap-1.5">
          <a
            href={image.src}
            download={image.name}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'gap-1 rounded-full'
            )}
          >
            <Download className="size-3.5" />
            Download image
          </a>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(image.src);
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1500);
            }}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'rounded-full'
            )}
            aria-label="Copy URL"
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                Copied
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                URL
              </>
            )}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            className="rounded-full"
            aria-label="Regenerate"
            title="Regenerate (R)"
          >
            <RefreshCw className="size-3.5" />
            Regenerate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onUseAsReference}
            className="rounded-full"
            aria-label="Use as reference for next generation"
          >
            <Sparkles className="size-3.5" />
            Use as reference
          </Button>
        </div>

        {/* Rate buttons — ML feedback. */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setRated(rated === 'up' ? null : 'up')}
            aria-label="Thumbs up"
            aria-pressed={rated === 'up'}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full border transition-colors',
              rated === 'up'
                ? 'border-amber-300 bg-amber-50 text-amber-600'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            )}
          >
            <Star
              className="size-3.5"
              fill={rated === 'up' ? 'currentColor' : 'none'}
            />
          </button>
          <button
            type="button"
            onClick={() => setRated(rated === 'down' ? null : 'down')}
            aria-label="Thumbs down"
            aria-pressed={rated === 'down'}
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-full border transition-colors',
              rated === 'down'
                ? 'border-rose-300 bg-rose-50 text-rose-600'
                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
            )}
          >
            <Star
              className="size-3.5 rotate-180"
              fill={rated === 'down' ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
