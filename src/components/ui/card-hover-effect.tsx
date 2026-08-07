'use client';

import { useState, type ComponentType, type ReactNode, type SVGProps } from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { cn } from '@/lib/utils';

export type HoverEffectItem = {
  title: string;
  description: string;
  /** Optional href — the card becomes a link when provided. */
  link?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

export function HoverEffect({
  items,
  className,
}: {
  items: HoverEffectItem[];
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        'grid grid-cols-1 py-10 md:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {items.map((item, idx) => {
        const Wrapper = item.link ? 'a' : 'div';

        return (
          <Wrapper
            key={item.title}
            href={item.link}
            className="group relative block h-full w-full p-2"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  layoutId="hoverBackground"
                  className="bg-accent absolute inset-0 block h-full w-full rounded-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.15 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                />
              )}
            </AnimatePresence>

            <Card>
              {item.icon && (
                <div className="bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 inline-flex size-10 items-center justify-center rounded-xl transition-colors">
                  <item.icon className="size-5" strokeWidth={1.75} />
                </div>
              )}
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </Card>
          </Wrapper>
        );
      })}
    </div>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        'border-border bg-card relative z-20 h-full w-full overflow-hidden rounded-2xl border p-6 transition-colors group-hover:border-transparent',
        className
      )}
    >
      <div className="relative z-50">{children}</div>
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <h3 className={cn('text-foreground font-medium tracking-tight', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        'text-muted-foreground mt-2 text-sm leading-relaxed',
        className
      )}
    >
      {children}
    </p>
  );
}
