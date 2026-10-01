import { ArrowLeft } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { GuideCard } from '@/components/directory/keyword-chip';
import {
  ProductCard,
  type ProductCardData,
} from '@/components/directory/product-card';
import type { GuideLite } from '@/content/games/server';
import type { Category } from '@/content/games/types';

export function CategoryPage({
  category,
  products,
  guides,
}: {
  category: Category;
  products: ProductCardData[];
  guides: GuideLite[];
}) {
  const visit = m['dir.common.visit']();
  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-3.5" />
        {m['dir.detail.back']()}
      </Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">
        <span aria-hidden>{category.emoji} </span>
        {m['dir.category.title']({ name: category.name })}
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        {category.description}
      </p>

      <h2 className="mt-10 text-lg font-bold tracking-tight">
        {m['dir.category.games']()}{' '}
        <span className="text-muted-foreground font-normal">
          ({products.length})
        </span>
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard
            key={p.href + p.name}
            product={p}
            visitLabel={visit}
            featuredLabel={m['dir.common.featured']()}
          />
        ))}
      </div>

      <h2 className="mt-12 text-lg font-bold tracking-tight">
        {m['dir.category.guides']()}{' '}
        <span className="text-muted-foreground font-normal">
          ({guides.length})
        </span>
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((g) => (
          <GuideCard
            key={g.slug}
            href={`/games/${g.slug}`}
            title={g.heading}
            summary={g.summary}
            meta={g.categoryName}
          />
        ))}
      </div>
    </main>
  );
}
