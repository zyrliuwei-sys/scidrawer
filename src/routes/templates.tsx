import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import { m } from '@/paraglide/messages.js';
import { getLocale, locales } from '@/paraglide/runtime.js';
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
        <PopularDiagramsSection />
      </main>
      <Footer />
    </div>
  );
}
