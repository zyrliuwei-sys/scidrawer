import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from 'react';
import type { MDXComponents } from 'mdx/types';

import { cn } from '@/lib/utils';

export const mdxComponents: MDXComponents = {
  h1: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className={cn(
        'text-foreground mt-6 mb-2 text-xl font-semibold tracking-tight md:text-2xl',
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'text-foreground mt-6 mb-2 text-lg font-semibold tracking-tight md:text-xl',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        'text-foreground mt-4 mb-1.5 text-base font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn('text-foreground/90 mt-2 leading-7', className)}
      {...props}
    />
  ),
  a: ({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn(
        'text-primary font-medium underline-offset-4 hover:underline',
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        'marker:text-muted-foreground mt-2 ml-6 list-disc space-y-1',
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        'marker:text-muted-foreground mt-2 ml-6 list-decimal space-y-1',
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: HTMLAttributes<HTMLLIElement>) => (
    <li className={cn('text-foreground/90 leading-7', className)} {...props} />
  ),
  strong: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <strong
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        'border-border text-muted-foreground my-4 border-l-2 pl-4 italic',
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
    <code
      className={cn(
        'bg-muted text-foreground rounded px-[0.4rem] py-[0.2rem] font-mono text-sm',
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: HTMLAttributes<HTMLHRElement>) => (
    <hr className={cn('border-border my-8', className)} {...props} />
  ),
  // GFM tables (remark-gfm). The wrapper scrolls horizontally so wide
  // comparison tables never force page-level overflow on phones.
  table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="border-border my-6 w-full overflow-x-auto rounded-lg border">
      <table
        className={cn(
          'w-full min-w-[560px] border-collapse text-sm',
          className
        )}
        {...props}
      />
    </div>
  ),
  thead: ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn('bg-muted/60', className)} {...props} />
  ),
  tr: ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
    <tr
      className={cn('border-border border-b last:border-b-0', className)}
      {...props}
    />
  ),
  th: ({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'text-foreground px-3 py-2 text-left align-top font-semibold',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn('text-foreground/90 px-3 py-2 align-top', className)}
      {...props}
    />
  ),
};
