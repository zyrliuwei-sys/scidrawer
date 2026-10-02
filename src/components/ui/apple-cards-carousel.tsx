"use client";

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';

export type AppleCardData = {
  category: string;
  title: string;
  src: string;
  /** Content rendered inside the modal that opens when the card is
   *  clicked. Typically a few paragraphs + extra images. */
  content?: ReactNode;
};

type CarouselProps = {
  items: ReactNode[];
  /** Optional scrolling sentinel used by the left/right gradient masks
   *  to fade out cards at the edges. */
  className?: string;
};

/**
 * Horizontal carousel with edge-fade masks. The track is a flex row that
 * scrolls natively; cards snap to the start edge. The first/last cards
 * peek at the edge so users can tell there's more to scroll.
 */
export function Carousel({ items, className }: CarouselProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        // Edge fade — tells the user the row scrolls.
        'before:from-background before:to-background/0 before:absolute before:top-0 before:left-0 before:z-10 before:h-full before:w-12 before:bg-gradient-to-r before:content-[""]',
        'after:from-background after:to-background/0 after:absolute after:top-0 after:right-0 after:z-10 after:h-full after:w-12 after:bg-gradient-to-l after:content-[""]',
        className
      )}
    >
      <div className="flex w-max flex-row gap-5 py-6 pl-4 pr-12">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: 'easeOut' }}
          >
            {item}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

type CardProps = {
  card: AppleCardData;
  index: number;
  /** Called when the user clicks the card. Parent opens a modal. */
  onOpen: (card: AppleCardData, index: number) => void;
};

/**
 * Single carousel card. Image-dominant layout with a category badge
 * pinned to the top-left and a title at the bottom. Click anywhere on
 * the card to open the parent modal.
 */
export function Card({ card, onOpen, index }: CardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(card, index)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.04, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group relative flex h-[440px] w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_32px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Image area — fixed-height so all cards line up regardless of
          the source image's natural aspect. */}
      <div className="relative h-[300px] w-full overflow-hidden bg-gradient-to-b from-sky-50/60 to-white">
        <img
          src={card.src}
          alt={card.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {/* Category badge */}
        <span className="absolute top-3 left-3 inline-flex items-center rounded-full border border-slate-200 bg-white/95 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.06)] backdrop-blur-sm">
          {card.category}
        </span>
      </div>

      {/* Title area */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-[16px] font-semibold leading-snug text-slate-900">
          {card.title}
        </h3>
        <p className="text-[12px] text-slate-500">
          via Generated with SciDrawer AI
        </p>
      </div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal — slides in from the right, full-height, with close + scroll body.
// ─────────────────────────────────────────────────────────────────────────────

type ModalProps = {
  open: boolean;
  onClose: () => void;
  card: AppleCardData | null;
};

export function AppleCardModal({ open, onClose, card }: ModalProps) {
  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Lock body scroll while the modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && card && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            key="sheet"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="bg-background fixed inset-y-0 right-0 z-50 flex w-full max-w-[640px] flex-col overflow-hidden border-l shadow-2xl"
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
              <span className="truncate text-sm font-medium text-slate-600">
                {card.category}
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                title="Close"
                className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <img
                src={card.src}
                alt={card.title}
                className="block w-full"
              />
              <div className="flex flex-col gap-4 p-6">
                <h2 className="text-2xl font-semibold leading-tight text-slate-900">
                  {card.title}
                </h2>
                {card.content ? (
                  <div className="text-[14px] leading-relaxed text-slate-600">
                    {card.content}
                  </div>
                ) : (
                  <p className="text-[14px] leading-relaxed text-slate-600">
                    Generated with SciDrawer AI from a single prompt. Adjust
                    the prompt, regenerate, or download the original image.
                  </p>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo wrapper — paste-ready example matching the aceternity-ui usage.
// Consumers should compose their own data + layout around Carousel/Card.
// ─────────────────────────────────────────────────────────────────────────────

export function AppleCardsCarouselDemo({ cards }: { cards: AppleCardData[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = cards.map((card, index) => (
    <Card key={card.src} card={card} index={index} onOpen={(_, i) => setOpenIndex(i)} />
  ));
  return (
    <>
      <Carousel items={items} />
      <AppleCardModal
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        card={openIndex !== null ? cards[openIndex] : null}
      />
    </>
  );
}
