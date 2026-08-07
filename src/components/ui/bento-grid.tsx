import { ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type BentoGridItem = {
  title: string;
  description: string;
  /** Visible body inside the card — image, video, custom node, etc. */
  content: ReactNode;
  /**
   * Slot layout. Maps to Tailwind `col-span-* lg:col-span-*` classes. Defaults
   * to a balanced 4-cell arrangement when omitted.
   *
   * `wide` → spans 4 of 6 columns on `lg+` (matches Aceternity's first card).
   * `narrow` → spans 2 of 6 columns.
   * `medium-left` → 3 cols, used on row 2 left.
   * `medium-right` → 3 cols, used on row 2 right.
   */
  layout?: 'wide' | 'narrow' | 'medium-left' | 'medium-right';
};

const LAYOUT_CLASS: Record<NonNullable<BentoGridItem['layout']>, string> = {
  wide: 'col-span-1 lg:col-span-4 border-b lg:border-r',
  narrow: 'col-span-1 lg:col-span-2 border-b',
  'medium-left': 'col-span-1 lg:col-span-3 lg:border-r',
  'medium-right': 'col-span-1 lg:col-span-3 border-b lg:border-none',
};

/**
 * 4-cell responsive bento. Renders an outer rounded grid with the title block
 * + description block above the grid. Mirrors the Aceternity
 * `FeaturesSectionDemo` layout: 4 cols / 2 cols / 3+3.
 */
export function BentoGrid({
  title,
  description,
  items,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  items: BentoGridItem[];
  className?: string;
}) {
  return (
    <div className={cn('relative z-20 mx-auto w-full py-10 lg:py-16', className)}>
      {(title || description) && (
        <div className="px-2">
          {title && (
            <h3 className="mx-auto max-w-5xl text-left text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl lg:leading-tight">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-left text-sm font-normal lg:text-base">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="relative">
        <div className="border-border mt-10 grid grid-cols-1 rounded-2xl border lg:grid-cols-6">
          {items.map((item, idx) => (
            <BentoCell
              key={`${item.title}-${idx}`}
              title={item.title}
              description={item.description}
              layout={item.layout}
            >
              {item.content}
            </BentoCell>
          ))}
        </div>
      </div>
    </div>
  );
}

function BentoCell({
  children,
  title,
  description,
  layout = 'wide',
  href,
}: {
  children: ReactNode;
  title: string;
  description: string;
  layout?: BentoGridItem['layout'];
  href?: string;
}) {
  const Wrapper = href ? 'a' : 'div';
  return (
    <Wrapper
      {...(href ? { href, target: '_blank', rel: 'noreferrer noopener' } : {})}
      className={cn(
        'border-border group/bento relative flex min-h-72 flex-col justify-between gap-4 overflow-hidden p-4 sm:p-6',
        LAYOUT_CLASS[layout ?? 'wide']
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40 opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100" />
      <div className="relative z-10">
        <div className="text-primary inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.14em] uppercase">
          {title}
          {href && (
            <ArrowUpRight
              className="size-3 translate-y-px transition-transform group-hover/bento:translate-x-0.5 group-hover/bento:-translate-y-0.5"
              aria-hidden
            />
          )}
        </div>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-6">
          {description}
        </p>
      </div>
      <div className="relative z-10 flex-1">{children}</div>
    </Wrapper>
  );
}