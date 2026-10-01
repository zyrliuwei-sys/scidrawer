import { ArrowLeft, ArrowUpRight, CalendarDays, Info } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { KeywordChip } from '@/components/directory/keyword-chip';
import { ProductCard } from '@/components/directory/product-card';
import { ProductLogo } from '@/components/directory/product-logo';
import { buttonVariants } from '@/components/ui/button';
import type { GamePageData } from '@/content/games/server';
import type { Block } from '@/content/games/types';

const anchor = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case 'p':
      return <p className="text-foreground/85 leading-7">{block.text}</p>;
    case 'list':
      return (
        <ul className="text-foreground/85 marker:text-primary list-disc space-y-1.5 pl-5 leading-7">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'steps':
      return (
        <ol className="space-y-2.5">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-3 leading-7">
              <span className="bg-primary/10 text-primary mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                {i + 1}
              </span>
              <span className="text-foreground/85">{item}</span>
            </li>
          ))}
        </ol>
      );
    case 'note':
      return (
        <p className="border-primary/30 bg-primary/5 text-foreground/85 flex gap-2 rounded-lg border px-4 py-3 text-sm leading-6">
          <Info className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
          {block.text}
        </p>
      );
  }
}

export function GameDetail({ data }: { data: GamePageData }) {
  const { page, product, category, related, more } = data;
  const visit = m['dir.common.visit']();

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm"
      >
        <Link
          href="/"
          className="hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowLeft className="size-3.5" />
          {m['dir.detail.back']()}
        </Link>
        <span aria-hidden>/</span>
        <Link
          href={`/category/${category.id}`}
          className="hover:text-foreground"
        >
          {category.name}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-foreground truncate">{page.heading}</span>
      </nav>

      {/* Title row */}
      <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">
        <ProductLogo name={product.name} color={product.color} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              {page.heading}
            </h1>
            <span className="bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-medium">
              {category.emoji} {category.name}
            </span>
          </div>
          <p className="text-muted-foreground mt-2 max-w-3xl text-base text-pretty">
            {page.summary}
          </p>
        </div>
        <a
          href={product.url}
          target="_blank"
          rel="noopener nofollow"
          className={cn(buttonVariants(), 'shrink-0 gap-1.5')}
        >
          {product.cta}
          <ArrowUpRight className="size-4" />
        </a>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Article */}
        <article className="min-w-0">
          <section aria-labelledby="overview">
            <h2
              id="overview"
              className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
            >
              {m['dir.detail.overview']()}
            </h2>
            <p className="text-foreground/90 mt-3 text-[17px] leading-8">
              {page.intro}
            </p>
          </section>

          {page.sections.map((section) => (
            <section
              key={section.heading}
              id={anchor(section.heading)}
              className="mt-10 scroll-mt-24"
            >
              <h2 className="text-xl font-bold tracking-tight">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.blocks.map((block, i) => (
                  <RenderBlock key={i} block={block} />
                ))}
              </div>
            </section>
          ))}

          {page.faq.length > 0 && (
            <section id="faq" className="mt-12 scroll-mt-24">
              <h2 className="text-xl font-bold tracking-tight">
                {m['dir.detail.faq']()}
              </h2>
              <div className="border-border divide-border mt-4 divide-y rounded-xl border">
                {page.faq.map((f) => (
                  <div key={f.q} className="px-5 py-4">
                    <h3 className="font-medium">{f.q}</h3>
                    <p className="text-muted-foreground mt-2 leading-7">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <p className="text-muted-foreground mt-8 flex items-center gap-2 text-sm">
            <CalendarDays className="size-4" aria-hidden />
            {m['dir.detail.updated']()}{' '}
            <time dateTime={page.updated}>{formatDate(page.updated)}</time>
          </p>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="border-border bg-card rounded-xl border p-5">
            <div className="flex items-center gap-3">
              <ProductLogo
                name={product.name}
                color={product.color}
                size="sm"
              />
              <h2 className="font-semibold tracking-tight">
                {m['dir.detail.about']({ name: product.name })}
              </h2>
            </div>
            <p className="text-muted-foreground mt-3 text-sm leading-6">
              {product.description}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">
                  {m['dir.detail.platform']()}
                </dt>
                <dd className="text-right font-medium">{product.platform}</dd>
              </div>
              {product.facts?.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-right font-medium">{value}</dd>
                </div>
              ))}
            </dl>
            <a
              href={product.url}
              target="_blank"
              rel="noopener nofollow"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'mt-4 w-full gap-1.5'
              )}
            >
              {visit}
              <ArrowUpRight className="size-4" />
            </a>
          </div>

          <div>
            <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {m['dir.detail.tags']()}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[category.name, ...product.tags].map((tag) => (
                <span
                  key={tag}
                  className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <nav aria-label={m['dir.detail.on_this_page']()}>
            <h2 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {m['dir.detail.on_this_page']()}
            </h2>
            <ul className="mt-2 space-y-1.5 text-sm">
              {page.sections.map((s) => (
                <li key={s.heading}>
                  <a
                    href={`#${anchor(s.heading)}`}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
              {page.faq.length > 0 && (
                <li>
                  <a
                    href="#faq"
                    className="text-muted-foreground hover:text-primary"
                  >
                    {m['dir.detail.faq']()}
                  </a>
                </li>
              )}
            </ul>
          </nav>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-border mt-14 border-t pt-8">
          <h2 className="text-lg font-bold tracking-tight">
            {m['dir.detail.related']()}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {related.map((r) => (
              <KeywordChip
                key={r.slug}
                href={`/games/${r.slug}`}
                label={r.heading}
              />
            ))}
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold tracking-tight">
            {m['dir.detail.more_in']({ category: category.name })}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <ProductCard
                key={p.href + p.name}
                product={p}
                visitLabel={visit}
                featuredLabel={m['dir.common.featured']()}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
