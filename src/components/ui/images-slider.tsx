import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const DEFAULT_INTERVAL_MS = 5000;

export type ImagesSliderProps = {
  /** Image URLs (or data URIs) — the first one is shown on mount. */
  images: string[];
  /** Optional class for the outer container. Use this to set height. */
  className?: string;
  /** Overlay content rendered above the active image. */
  children?: React.ReactNode;
  /** Auto-advance interval in ms. Set to 0 to disable. */
  interval?: number;
  /** Optional class for the active-image element. */
  imageClassName?: string;
};

/**
 * Aceternity-style full-bleed image slider.
 *
 * One image is shown at a time. The next image slides up from below,
 * the current image slides up and out. The overlay (`children`) stays
 * pinned above the active image the whole time.
 */
export function ImagesSlider({
  images,
  className,
  children,
  interval = DEFAULT_INTERVAL_MS,
  imageClassName,
}: ImagesSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance on a fixed interval. Pause by setting `interval` to 0
  // (e.g. for hover-to-pause behavior wired in by the consumer).
  useEffect(() => {
    if (interval <= 0 || images.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [interval, images.length]);

  const current = images[activeIndex] ?? images[0];

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-slate-900',
        className
      )}
    >
      <AnimatePresence mode="pop-layout" initial={false}>
        <motion.img
          key={activeIndex}
          src={current}
          alt=""
          initial={{ y: '100%', opacity: 0, scale: 1.05 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: '-100%', opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y < -80 && images.length > 1) {
              setActiveIndex((i) => (i + 1) % images.length);
            } else if (info.offset.y > 80 && images.length > 1) {
              setActiveIndex((i) => (i - 1 + images.length) % images.length);
            }
          }}
          className={cn(
            'absolute inset-0 h-full w-full select-none object-cover',
            imageClassName
          )}
        />
      </AnimatePresence>

      {/* Gradient overlay — improves readability of the foreground
          (title + button) against any image. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/40" />

      {/* Pinned overlay content (e.g. title + CTA) */}
      {children && (
        <div className="relative z-50 flex h-full w-full flex-col items-center justify-center px-6 text-center text-white">
          {children}
        </div>
      )}
    </div>
  );
}
