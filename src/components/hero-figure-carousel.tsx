import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { cn } from '@/lib/utils';

export interface HeroFigure {
  src: string;
  alt: string;
}

interface HeroFigureCarouselProps {
  figures: HeroFigure[];
  className?: string;
}

const ROTATION_INTERVAL_MS = 5_000;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0.45,
  }),
  center: {
    x: '0%',
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0.45,
  }),
};

export function HeroFigureCarousel({
  figures,
  className,
}: HeroFigureCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const prefersReducedMotion = useReducedMotion();
  const figureCount = figures.length;
  const activeFigure = figures[activeIndex] ?? figures[0];

  const goTo = useCallback(
    (index: number, nextDirection: number) => {
      setDirection(nextDirection);
      setActiveIndex((index + figureCount) % figureCount);
    },
    [figureCount]
  );

  useEffect(() => {
    if (figureCount < 2 || paused || prefersReducedMotion) return;

    const rotation = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((index) => (index + 1) % figureCount);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(rotation);
  }, [figureCount, paused, prefersReducedMotion]);

  if (!activeFigure) return null;

  return (
    <div
      className={cn(
        'group relative aspect-[3/2] overflow-hidden rounded-2xl bg-slate-100',
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setPaused(false);
        }
      }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={activeFigure.src}
          custom={direction}
          src={activeFigure.src}
          alt={activeFigure.alt}
          width={1536}
          height={1024}
          loading={activeIndex === 0 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={activeIndex === 0 ? 'high' : 'auto'}
          variants={slideVariants}
          initial={prefersReducedMotion ? false : 'enter'}
          animate="center"
          exit={prefersReducedMotion ? undefined : 'exit'}
          transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/15 to-transparent" />

      <div className="absolute right-3 bottom-3 flex items-center gap-1.5">
        {figures.map((figure, index) => (
          <button
            key={figure.src}
            type="button"
            aria-label={`Show figure ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => goTo(index, index > activeIndex ? 1 : -1)}
            className={cn(
              'h-1.5 rounded-full bg-white/70 shadow-sm transition-[width,background-color] duration-300 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2',
              index === activeIndex ? 'w-6 bg-white' : 'w-1.5 hover:bg-white'
            )}
          />
        ))}
      </div>

      <button
        type="button"
        aria-label="Show previous figure"
        title="Previous figure"
        onClick={() => goTo(activeIndex - 1, -1)}
        className="absolute top-1/2 left-3 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Show next figure"
        title="Next figure"
        onClick={() => goTo(activeIndex + 1, 1)}
        className="absolute top-1/2 right-3 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-slate-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </div>
  );
}
