import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { m } from '@/paraglide/messages.js';
import { getLocale, locales, localizeHref } from '@/paraglide/runtime.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { PopularDiagramsSection } from '@/blocks/popular-diagrams';

export const Route = createFileRoute('/templates')({
  loader: () => {
    const locale = getLocale() as (typeof locales)[number];
    return {
      title: m['templates_page.title']({}, { locale }),
      description: m['templates_page.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.title },
          { name: 'description', content: loaderData.description },
        ]
      : [],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative isolate overflow-hidden px-4 pt-18 pb-16 sm:px-6 sm:pt-24 sm:pb-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-28 left-1/2 -z-10 size-125 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-300/10"
          />
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase">
              {m['templates_page.eyebrow']()}
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.05] tracking-tight sm:text-6xl">
              {m['templates_page.title']()}
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-7 sm:text-lg">
              {m['templates_page.description']()}
            </p>
            <a
              href="/generate"
              className="bg-primary text-primary-foreground focus-visible:ring-ring mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {m['templates_page.cta']()}
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </section>

        <section
          aria-labelledby="template-landing-pages"
          className="px-4 pb-16 sm:px-6 sm:pb-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-5 md:grid-cols-2">
              <a
                href={localizeHref('/plant-cell-labeled')}
                className="border-border bg-card group hover:border-primary/40 hover:bg-accent/40 block rounded-[1.5rem] border p-7 transition-colors sm:p-8"
              >
                <p className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase">
                  {m['plant_cell_page.eyebrow']()}
                </p>
                <h2
                  id="template-landing-pages"
                  className="group-hover:text-primary mt-3 font-serif text-2xl tracking-tight transition-colors"
                >
                  {m['plant_cell_page.title']()}
                </h2>
                <p className="text-muted-foreground mt-3 leading-7">
                  {m['plant_cell_page.description']()}
                </p>
                <span className="text-primary mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  {m['plant_cell_page.title']()}
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </a>

              <a
                href={localizeHref('/graphical-abstract-maker')}
                className="border-border bg-card group hover:border-primary/40 hover:bg-accent/40 block rounded-[1.5rem] border p-7 transition-colors sm:p-8"
              >
                <p className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase">
                  {m['graphical_abstract_page.eyebrow']()}
                </p>
                <h2 className="group-hover:text-primary mt-3 font-serif text-2xl tracking-tight transition-colors">
                  {m['graphical_abstract_page.title']()}
                </h2>
                <p className="text-muted-foreground mt-3 leading-7">
                  {m['graphical_abstract_page.description']()}
                </p>
                <span className="text-primary mt-5 inline-flex items-center gap-2 text-sm font-semibold">
                  {m['graphical_abstract_page.title']()}
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </a>
            </div>
          </div>
        </section>
        <PopularDiagramsSection />
      </main>
      <Footer />
    </div>
  );
}
