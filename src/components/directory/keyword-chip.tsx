import { TrendingUp } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';

/** Pill link to a trending keyword guide page. */
export function KeywordChip({
  href,
  label,
  hot,
  className,
}: {
  href: string;
  label: string;
  hot?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'border-border bg-card hover:border-primary/50 hover:text-primary inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors',
        className
      )}
    >
      {hot && <TrendingUp className="text-primary size-3.5" aria-hidden />}
      {label}
    </Link>
  );
}

/** Compact guide card: title, summary, meta line. */
export function GuideCard({
  href,
  title,
  summary,
  meta,
}: {
  href: string;
  title: string;
  summary: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="border-border bg-card hover:border-primary/40 group flex flex-col rounded-xl border p-4 transition-colors"
    >
      <span className="text-muted-foreground text-[11px] font-medium tracking-wide uppercase">
        {meta}
      </span>
      <span className="group-hover:text-primary mt-1 font-semibold tracking-tight transition-colors">
        {title}
      </span>
      <span className="text-muted-foreground mt-1 line-clamp-2 text-sm">
        {summary}
      </span>
    </Link>
  );
}
