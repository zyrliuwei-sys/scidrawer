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

export const Route = createFileRoute('/graphical-abstract-maker')({
  loader: () => {
    const locale = getLocale() as (typeof locales)[number];
    return {
      locale,
      title: m['graphical_abstract_page.title']({}, { locale }),
      description: m['graphical_abstract_page.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const urlFor = (loc: string) =>
      localizeUrl(`${getSiteUrl()}/graphical-abstract-maker`, {
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
  component: GraphicalAbstractMakerPage,
});

function GraphicalAbstractMakerPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-14 sm:px-6 sm:py-20">
        <nav
          aria-label={m['graphical_abstract_page.breadcrumb_label']()}
          className="mx-auto mb-6 max-w-6xl"
        >
          <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <a href="/" className="hover:text-foreground transition-colors">
                {m['graphical_abstract_page.breadcrumb_home']()}
              </a>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li>
              <a
                href="/templates"
                className="hover:text-foreground transition-colors"
              >
                {m['graphical_abstract_page.breadcrumb_templates']()}
              </a>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li aria-current="page" className="text-foreground font-medium">
              {m['graphical_abstract_page.breadcrumb_current']()}
            </li>
          </ol>
        </nav>

        <article className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-emerald-900/15 bg-[linear-gradient(135deg,oklch(0.985_0.012_165),oklch(0.955_0.024_100))] shadow-[0_24px_60px_oklch(0.24_0.05_165_/_0.12)] lg:grid-cols-[0.94fr_1.06fr] dark:border-emerald-200/15 dark:bg-[linear-gradient(135deg,oklch(0.19_0.026_165),oklch(0.15_0.018_100))]">
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
            <p className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase">
              {m['graphical_abstract_page.eyebrow']()}
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[1.04] tracking-tight sm:text-6xl">
              {m['graphical_abstract_page.title']()}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-base leading-7 sm:text-lg">
              {m['graphical_abstract_page.description']()}
            </p>
            <a
              href="/generate"
              className="bg-primary text-primary-foreground focus-visible:ring-ring mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {m['graphical_abstract_page.cta']()}
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>

          <div className="relative min-h-100 overflow-hidden bg-emerald-950/10 p-6 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,oklch(0.8_0.13_95_/_0.36),transparent_30%)]" />
            <div className="relative mx-auto flex h-full max-w-lg items-center rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_28px_54px_oklch(0.19_0.06_165_/_0.22)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
              <img
                src="/imgs/showcase/graphical-abstracts.svg"
                alt={m['graphical_abstract_page.image_alt']()}
                width={960}
                height={640}
                className="h-auto w-full"
              />
            </div>
          </div>
        </article>

        <section className="border-border bg-card mx-auto mt-8 max-w-6xl rounded-[1.5rem] border px-7 py-8 sm:px-10 sm:py-10">
          <h2 className="font-serif text-2xl tracking-tight">
            {m['template_links.more_templates']()}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-3xl leading-7">
            {m['template_links.description']()}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            <a
              href={localizeHref('/plant-cell-labeled')}
              className="text-primary decoration-primary/35 hover:decoration-primary font-semibold underline underline-offset-4 transition-colors"
            >
              {m['plant_cell_page.title']()}
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
