import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Search, Sparkles } from 'lucide-react';

import { Link, useRouter } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { GuideCard, KeywordChip } from '@/components/directory/keyword-chip';
import { ProductCard } from '@/components/directory/product-card';
import { ProductLogo } from '@/components/directory/product-logo';
import { buttonVariants } from '@/components/ui/button';
import type { HomeData } from '@/content/games/server';

export function SearchBox({
  defaultValue = '',
  className,
}: {
  defaultValue?: string;
  className?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  return (
    <form
      role="search"
      className={cn(
        'border-border bg-card focus-within:border-primary/60 focus-within:ring-primary/15 flex items-center gap-2 rounded-xl border p-1.5 pl-3 shadow-sm focus-within:ring-4',
        className
      )}
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/browse?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <Search className="text-muted-foreground size-4 shrink-0" aria-hidden />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={m['dir.hero.search_placeholder']()}
        aria-label={m['dir.hero.search_placeholder']()}
        className="placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-sm outline-none"
      />
      <button type="submit" className={cn(buttonVariants({ size: 'sm' }))}>
        {m['dir.hero.search_button']()}
      </button>
    </form>
  );
}

function SectionTitle({
  title,
  desc,
  href,
  id,
}: {
  title: string;
  desc?: string;
  href?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="mb-4 flex scroll-mt-24 items-end justify-between gap-4"
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {desc && <p className="text-muted-foreground mt-0.5 text-sm">{desc}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="text-primary inline-flex shrink-0 items-center gap-1 text-sm font-medium hover:underline"
        >
          {m['dir.home.view_all']()}
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}

export function DirectoryHome({ data }: { data: HomeData }) {
  const visit = m['dir.common.visit']();
  const featured = m['dir.common.featured']();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="grid gap-8 pt-10 pb-8 md:grid-cols-[1.25fr_1fr] md:items-center md:pt-14">
        <div>
          <span className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium">
            <span className="relative flex size-1.5">
              <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-75" />
              <span className="bg-primary relative inline-flex size-1.5 rounded-full" />
            </span>
            {m['dir.hero.badge']()}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            {m['dir.hero.title']()}
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl text-base text-pretty">
            {m['dir.hero.subtitle']()}
          </p>
          <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <span>
              {m['dir.hero.guides']({ count: String(data.stats.guides) })}
            </span>
            <span>
              {m['dir.hero.games']({ count: String(data.stats.games) })}
            </span>
            <span>
              {m['dir.hero.categories']({
                count: String(data.stats.categories),
              })}
            </span>
          </div>
          <SearchBox className="mt-6 max-w-xl" />
        </div>

        {/* Spotlight card */}
        <div className="border-border from-primary/10 via-card to-card relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm">
          <span className="text-primary inline-flex items-center gap-1 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="size-3.5" />
            {m['dir.home.spotlight']()}
          </span>
          <div className="mt-3 flex items-center gap-3">
            <ProductLogo
              name={data.spotlight.name}
              color={data.spotlight.color}
              size="lg"
            />
            <div>
              <Link
                href={data.spotlight.href}
                className="text-lg font-bold tracking-tight hover:underline"
              >
                {data.spotlight.name}
              </Link>
              <p className="text-muted-foreground text-sm">
                {data.spotlight.tagline}
              </p>
            </div>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-2">
            {data.spotlight.facts.slice(0, 4).map(([label, value]) => (
              <div
                key={label}
                className="bg-background/70 rounded-lg px-3 py-2"
              >
                <dt className="text-muted-foreground text-[11px]">{label}</dt>
                <dd className="text-sm font-medium">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex gap-2">
            <Link
              href={data.spotlight.href}
              className={cn(buttonVariants({ size: 'sm' }))}
            >
              {data.spotlight.name}
              <ArrowRight className="size-3.5" />
            </Link>
            <a
              href={data.spotlight.url}
              target="_blank"
              rel="noopener nofollow"
              className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}
            >
              {visit}
              <ArrowUpRight className="size-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* Trending searches */}
      <section className="py-6">
        <SectionTitle
          id="trending"
          title={m['dir.home.trending_title']()}
          desc={m['dir.home.trending_desc']()}
          href="/browse"
        />
        <div className="flex flex-wrap gap-2">
          {data.trending.map((t, i) => (
            <KeywordChip
              key={t.slug}
              href={`/games/${t.slug}`}
              label={t.heading}
              hot={i < 6}
            />
          ))}
        </div>
      </section>

      {/* Leaderboard + categories */}
      <section className="grid gap-8 py-8 lg:grid-cols-[1fr_300px]">
        <div>
          <SectionTitle
            title={m['dir.home.leaderboard_title']()}
            desc={m['dir.home.leaderboard_desc']()}
          />
          <div className="grid gap-3">
            {data.leaderboard.map((p, i) => (
              <ProductCard
                key={p.href}
                product={p}
                rank={i + 1}
                visitLabel={visit}
                featuredLabel={featured}
              />
            ))}
          </div>
        </div>
        <aside>
          <SectionTitle
            id="categories"
            title={m['dir.home.categories_title']()}
          />
          <ul className="border-border bg-card divide-border divide-y rounded-xl border">
            {data.categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/category/${c.id}`}
                  className="hover:bg-accent flex items-center gap-3 px-4 py-3 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className="text-lg" aria-hidden>
                    {c.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{c.name}</span>
                    <span className="text-muted-foreground block text-xs">
                      {m['dir.common.games_count']({ count: String(c.games) })}{' '}
                      ·{' '}
                      {m['dir.common.guides_count']({
                        count: String(c.guides),
                      })}
                    </span>
                  </span>
                  <ArrowRight className="text-muted-foreground size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Category sections */}
      {data.sections.map(({ category, products }) => (
        <section key={category.id} className="py-6">
          <SectionTitle
            title={`${category.emoji} ${category.name}`}
            desc={category.description}
            href={`/category/${category.id}`}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard
                key={p.href + p.name}
                product={p}
                visitLabel={visit}
                featuredLabel={featured}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Latest guides */}
      <section className="py-6">
        <SectionTitle
          title={m['dir.home.latest_title']()}
          desc={m['dir.home.latest_desc']()}
          href="/browse"
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.latest.map((g) => (
            <GuideCard
              key={g.slug}
              href={`/games/${g.slug}`}
              title={g.heading}
              summary={g.summary}
              meta={g.categoryName}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
