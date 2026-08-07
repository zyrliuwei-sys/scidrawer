"use client";

import { useEffect, useRef, useState, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Direction = 'left' | 'right';
type Speed = 'fast' | 'normal' | 'slow';

export type InfiniteMovingCardsProps<T> = {
  /** Data items to render. The component is generic over the item shape —
   *  pass a `renderItem` function to control how each one is displayed. */
  items: T[];
  /** Render each item as a card. Required when the item shape isn't the
   *  built-in `quote / name / title` testimonial. */
  renderItem?: (item: T, index: number) => ReactNode;
  /** Default testimonial layout (used when no `renderItem` is provided). */
  quote?: never;
  /** Scroll direction. Default is "left". */
  direction?: Direction;
  /** Animation duration. "slow" = 60s, "normal" = 40s, "fast" = 20s. */
  speed?: Speed;
  /** Pause the animation on hover. */
  pauseOnHover?: boolean;
  /** Extra classes for the outer wrapper. */
  className?: string;
};

const SPEED_DURATION: Record<Speed, string> = {
  fast: '20s',
  normal: '40s',
  slow: '60s',
};

/**
 * Seamless horizontal marquee.
 *
 * The track is rendered twice (back-to-back) and translated by -50% over
 * one cycle — the moment the first copy scrolls off-screen the second
 * copy is in the same position, so the loop reads as continuous.
 *
 * Generic over the item shape; pass a `renderItem` to control the card
 * layout. Without one, each item is rendered as a testimonial card using
 * the { quote, name, title } shape (matching the aceternity-ui pattern).
 */
export function InfiniteMovingCards<T>({
  items,
  renderItem,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Slight delay before starting the animation — prevents a flash where the
  // track renders at the un-translated position before the first keyframe
  // tick lands. Cheap, no layout shift, only one frame.
  useEffect(() => {
    if (!containerRef.current) return;
    const id = window.setTimeout(() => setIsReady(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  // Default testimonial layout — used when the consumer passes plain
  // objects matching { quote, name, title } (the aceternity-ui pattern).
  const renderDefault = (item: unknown, _idx: number): ReactNode => {
    const t = item as { quote?: string; name?: string; title?: string };
    return (
      <blockquote className="flex h-full w-[28rem] shrink-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
        <p className="line-clamp-6 text-[14px] leading-relaxed text-slate-700">
          &ldquo;{t.quote}&rdquo;
        </p>
        <footer className="mt-4 flex flex-col">
          <cite className="text-[13px] font-semibold not-italic text-slate-900">
            {t.name}
          </cite>
          <span className="text-[12px] text-slate-500">{t.title}</span>
        </footer>
      </blockquote>
    );
  };

  const render = renderItem ?? renderDefault;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full overflow-hidden',
        '[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <ul
        className={cn(
          'flex w-max shrink-0 flex-nowrap gap-3 py-3',
          isReady && 'animate-scroll',
          pauseOnHover && 'hover:[animation-play-state:paused]',
          'motion-reduce:[animation-play-state:paused]'
        )}
        style={
          {
            '--scroll-duration': SPEED_DURATION[speed],
            '--scroll-direction': direction === 'left' ? 'forwards' : 'reverse',
          } as React.CSSProperties
        }
      >
        {[0, 1].map((dup) => (
          <ul
            key={dup}
            className="flex shrink-0 flex-nowrap gap-3"
            aria-hidden={dup === 1}
          >
            {items.map((item, idx) => (
              <li
                key={`${dup}-${idx}-${String((item as { key?: string }).key ?? idx)}`}
                className="relative shrink-0"
              >
                {render(item, idx)}
              </li>
            ))}
          </ul>
        ))}
      </ul>
    </div>
  );
}
