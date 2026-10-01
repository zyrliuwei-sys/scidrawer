import { cn } from '@/lib/utils';

/** Letter-mark logo tile generated from a product name and gradient. */
export function ProductLogo({
  name,
  color,
  size = 'md',
  className,
}: {
  name: string;
  /** Tailwind gradient stops, e.g. `from-rose-500 to-orange-400`. */
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const initials = name
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-bold text-white shadow-sm',
        color,
        size === 'sm' && 'size-9 text-xs',
        size === 'md' && 'size-12 text-sm',
        size === 'lg' && 'size-16 rounded-2xl text-xl',
        className
      )}
    >
      {initials}
    </span>
  );
}
