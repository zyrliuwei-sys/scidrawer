import { ArrowUpRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { ProductLogo } from '@/components/directory/product-logo';

export interface ProductCardData {
  name: string;
  tagline: string;
  color: string;
  platform: string;
  tags: string[];
  /** Internal detail page (locale-free path). */
  href: string;
  /** External official / play link. */
  url: string;
  featured?: boolean;
}

/** Microlaunch-style listing row: logo, name, tagline, tags, visit arrow. */
export function ProductCard({
  product,
  rank,
  visitLabel,
  featuredLabel,
  className,
}: {
  product: ProductCardData;
  rank?: number;
  visitLabel: string;
  featuredLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group border-border bg-card hover:border-primary/40 relative flex items-start gap-4 rounded-xl border p-4 transition-all hover:shadow-[0_6px_24px_-12px_oklch(0.585_0.233_277/0.45)]',
        className
      )}
    >
      {rank !== undefined && (
        <span className="text-muted-foreground w-5 pt-3 text-center text-sm font-semibold tabular-nums">
          {rank}
        </span>
      )}
      <ProductLogo name={product.name} color={product.color} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={product.href}
            className="truncate font-semibold tracking-tight after:absolute after:inset-0"
          >
            {product.name}
          </Link>
          {product.featured && featuredLabel && (
            <span className="bg-primary/10 text-primary shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium">
              {featuredLabel}
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-0.5 line-clamp-2 text-sm">
          {product.tagline}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="bg-secondary text-secondary-foreground rounded-md px-1.5 py-0.5 text-[11px] font-medium">
            {product.platform}
          </span>
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="border-border text-muted-foreground rounded-md border px-1.5 py-0.5 text-[11px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <a
        href={product.url}
        target="_blank"
        rel="noopener nofollow"
        aria-label={`${visitLabel}: ${product.name}`}
        className="border-border text-muted-foreground hover:text-primary hover:border-primary/50 relative z-10 hidden shrink-0 rounded-lg border p-2 transition-colors sm:inline-flex"
      >
        <ArrowUpRight className="size-4" />
      </a>
    </div>
  );
}
