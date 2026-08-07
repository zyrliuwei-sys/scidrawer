'use client';

import { useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'motion/react';

import { cn } from '@/lib/utils';

export type StickyScrollItem = {
  title: string;
  description: string;
  content?: ReactNode;
};

export function StickyScroll({
  content,
  contentClassName,
}: {
  content: StickyScrollItem[];
  contentClassName?: string;
}) {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll within the inner scroll container so the panel swaps as each
  // step passes the midpoint.
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ['start start', 'end start'],
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const breakpoints = content.map((_, index) => index / cardLength);
    const closest = breakpoints.reduce((acc, breakpoint, index) => {
      const distance = Math.abs(latest - breakpoint);
      return distance < Math.abs(latest - breakpoints[acc]) ? index : acc;
    }, 0);
    setActiveCard(closest);
  });

  return (
    <motion.div
      ref={ref}
      className="relative flex h-[30rem] justify-center space-x-10 overflow-y-auto rounded-3xl p-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div className="relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="font-serif text-2xl font-normal"
              >
                {item.title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-muted-foreground mt-4 max-w-sm text-base leading-7"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>

      <div
        className={cn(
          'border-border bg-card sticky top-10 hidden h-72 w-96 overflow-hidden rounded-2xl border lg:block',
          contentClassName
        )}
      >
        {content[activeCard]?.content ?? null}
      </div>
    </motion.div>
  );
}
