import { useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { GuideCard } from '@/components/directory/keyword-chip';
import type { CategoryId } from '@/content/games/types';

export interface BrowseGuide {
  slug: string;
  heading: string;
  summary: string;
  categoryName: string;
  category: CategoryId;
  productName: string;
}

export function Browse({
  guides,
  categories,
  initialQuery = '',
}: {
  guides: BrowseGuide[];
  categories: Array<{ id: CategoryId; name: string; emoji: string }>;
  initialQuery?: string;
}) {
  const [q, setQ] = useState(initialQuery);
  const [cat, setCat] = useState<CategoryId | 'all'>('all');

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return guides.filter(
      (g) =>
        (cat === 'all' || g.category === cat) &&
        (!needle ||
          `${g.heading} ${g.summary} ${g.productName}`
            .toLowerCase()
            .includes(needle))
    );
  }, [guides, q, cat]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {m['dir.browse.title']()}
      </h1>
      <p className="text-muted-foreground mt-2">
        {m['dir.browse.description']()}
      </p>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={m['dir.hero.search_placeholder']()}
        aria-label={m['dir.hero.search_placeholder']()}
        className="border-border bg-card focus:border-primary/60 focus:ring-primary/15 mt-6 w-full max-w-xl rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-4"
      />

      <div className="mt-4 flex flex-wrap gap-2" role="tablist">
        {[
          { id: 'all' as const, name: m['dir.browse.all'](), emoji: '' },
          ...categories,
        ].map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={cat === c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm transition-colors',
              cat === c.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card hover:border-primary/50'
            )}
          >
            {c.emoji ? `${c.emoji} ` : ''}
            {c.name}
          </button>
        ))}
      </div>

      <p className="text-muted-foreground mt-6 text-sm">
        {results.length === 0
          ? m['dir.browse.no_results']({ query: q })
          : m['dir.browse.results']({ count: String(results.length) })}
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((g) => (
          <GuideCard
            key={g.slug}
            href={`/games/${g.slug}`}
            title={g.heading}
            summary={g.summary}
            meta={`${g.categoryName} · ${g.productName}`}
          />
        ))}
      </div>
    </main>
  );
}
