import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { getSiteUrl } from '@/config';
import { m } from '@/paraglide/messages.js';
import {
  getLocale,
  locales,
  localizeHref,
  localizeUrl,
} from '@/paraglide/runtime.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';

export const Route = createFileRoute('/plant-cell-labeled')({
  loader: () => {
    const locale = getLocale() as (typeof locales)[number];
    return {
      locale,
      title: m['plant_cell_page.title']({}, { locale }),
      description: m['plant_cell_page.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const urlFor = (loc: string) =>
      localizeUrl(`${getSiteUrl()}/plant-cell-labeled`, {
        locale: loc as (typeof locales)[number],
      }).href;
    return {
      meta: [
        { title: loaderData.title },
        { name: 'description', content: loaderData.description },
      ],
      links: [
        { rel: 'canonical', href: urlFor(loaderData.locale) },
        ...locales.map((loc) => ({
          rel: 'alternate',
          hrefLang: loc,
          href: urlFor(loc),
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: urlFor('en') },
      ],
    };
  },
  component: PlantCellLabeledPage,
});

function PlantCellLabeledPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-14 sm:px-6 sm:py-20">
        <nav
          aria-label={m['plant_cell_page.breadcrumb_label']()}
          className="mx-auto mb-6 max-w-6xl"
        >
          <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <a href="/" className="hover:text-foreground transition-colors">
                {m['plant_cell_page.breadcrumb_home']()}
              </a>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li>
              <a
                href="/templates"
                className="hover:text-foreground transition-colors"
              >
                {m['plant_cell_page.breadcrumb_templates']()}
              </a>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li aria-current="page" className="text-foreground font-medium">
              {m['plant_cell_page.breadcrumb_current']()}
            </li>
          </ol>
        </nav>

        <article className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-emerald-900/15 bg-[linear-gradient(135deg,oklch(0.985_0.009_125),oklch(0.95_0.022_145))] shadow-[0_24px_60px_oklch(0.24_0.04_155_/_0.13)] lg:grid-cols-2 dark:border-emerald-200/15 dark:bg-[linear-gradient(135deg,oklch(0.2_0.024_155),oklch(0.16_0.02_185))]">
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
            <p className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase">
              {m['plant_cell_page.eyebrow']()}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.04] tracking-tight sm:text-6xl">
              {m['plant_cell_page.title']()}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-base leading-7 sm:text-lg">
              {m['plant_cell_page.description']()}
            </p>
            <p className="text-muted-foreground mt-6 max-w-xl text-sm leading-6">
              {m['plant_cell_page.home_link_first_before']()}{' '}
              <a
                href="/"
                className="text-primary decoration-primary/35 hover:decoration-primary font-semibold underline underline-offset-4 transition-colors"
              >
                {m['plant_cell_page.home_link_label']()}
              </a>{' '}
              {m['plant_cell_page.home_link_first_after']()}
            </p>
          </div>

          <div className="relative min-h-80 overflow-hidden bg-emerald-950/10 lg:min-h-full">
            <img
              src="/imgs/diagrams/plant-cell-labeled.svg"
              alt={m['plant_cell_page.image_alt']()}
              width={800}
              height={600}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.94_0.05_150_/_0.18),transparent_45%)]" />
          </div>
        </article>

        <section className="border-border bg-card mx-auto mt-8 max-w-6xl rounded-[1.5rem] border px-7 py-8 sm:px-10 sm:py-10">
          <p className="text-muted-foreground max-w-3xl text-base leading-7">
            {m['plant_cell_page.home_link_second_before']()}{' '}
            <a
              href="/"
              className="text-primary decoration-primary/35 hover:decoration-primary font-semibold underline underline-offset-4 transition-colors"
            >
              {m['plant_cell_page.home_link_label']()}
            </a>{' '}
            {m['plant_cell_page.home_link_second_after']()}
          </p>
          <a
            href="/generate"
            className="bg-primary text-primary-foreground focus-visible:ring-ring mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {m['plant_cell_page.cta']()}
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </section>

        <section className="border-border bg-card mx-auto mt-8 max-w-6xl rounded-[1.5rem] border px-7 py-8 sm:px-10 sm:py-10">
          <h2 className="font-serif text-2xl tracking-tight">
            {m['template_links.more_templates']()}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-3xl leading-7">
            {m['template_links.description']()}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <a
              href={localizeHref('/graphical-abstract-maker')}
              className="text-primary decoration-primary/35 hover:decoration-primary font-semibold underline underline-offset-4 transition-colors"
            >
              {m['graphical_abstract_page.title']()}
            </a>
            <a
              href={localizeHref('/templates')}
              className="text-primary decoration-primary/35 hover:decoration-primary font-semibold underline underline-offset-4 transition-colors"
            >
              {m['template_links.all_templates']()}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
