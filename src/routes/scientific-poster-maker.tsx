import { createFileRoute } from '@tanstack/react-router';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { m } from '@/paraglide/messages.js';
import { getLocale, locales } from '@/paraglide/runtime.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';

export const Route = createFileRoute('/scientific-poster-maker')({
  loader: () => {
    const locale = getLocale() as (typeof locales)[number];
    return {
      title: m['scientific_poster_page.title']({}, { locale }),
      description: m['scientific_poster_page.description']({}, { locale }),
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
  component: ScientificPosterMakerPage,
});

function ScientificPosterMakerPage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-14 sm:px-6 sm:py-20">
        <nav
          aria-label={m['scientific_poster_page.breadcrumb_label']()}
          className="mx-auto mb-6 max-w-6xl"
        >
          <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <a href="/" className="hover:text-foreground transition-colors">
                {m['scientific_poster_page.breadcrumb_home']()}
              </a>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li>
              <a
                href="/templates"
                className="hover:text-foreground transition-colors"
              >
                {m['scientific_poster_page.breadcrumb_templates']()}
              </a>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li aria-current="page" className="text-foreground font-medium">
              {m['scientific_poster_page.breadcrumb_current']()}
            </li>
          </ol>
        </nav>

        <article className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-sky-900/15 bg-[linear-gradient(135deg,oklch(0.985_0.008_225),oklch(0.95_0.018_245))] shadow-[0_24px_60px_oklch(0.24_0.04_245_/_0.13)] lg:grid-cols-[0.94fr_1.06fr] dark:border-sky-200/15 dark:bg-[linear-gradient(135deg,oklch(0.19_0.022_245),oklch(0.15_0.018_265))]">
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
            <p className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase">
              {m['scientific_poster_page.eyebrow']()}
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[1.04] tracking-tight sm:text-6xl">
              {m['scientific_poster_page.title']()}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-base leading-7 sm:text-lg">
              {m['scientific_poster_page.description']()}
            </p>
            <a
              href="/generate"
              className="bg-primary text-primary-foreground focus-visible:ring-ring mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {m['scientific_poster_page.cta']()}
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>

          <div className="relative min-h-100 overflow-hidden bg-sky-950/10 p-6 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_9%,oklch(0.79_0.11_225_/_0.35),transparent_32%)]" />
            <div className="relative mx-auto h-full max-w-md rotate-[2deg] overflow-hidden rounded-sm border-[7px] border-white/85 bg-white shadow-[0_28px_54px_oklch(0.19_0.06_245_/_0.26)] dark:border-slate-100/85">
              <div className="absolute inset-x-0 top-0 z-10 border-b border-slate-900/10 bg-white/90 px-5 py-4 backdrop-blur-sm">
                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-600 uppercase">
                  {m['scientific_poster_page.poster_label']()}
                </span>
                <div className="mt-2 h-2.5 w-3/4 rounded-full bg-slate-800" />
                <div className="mt-1.5 h-1.5 w-2/5 rounded-full bg-slate-300" />
              </div>
              <img
                src="/imgs/hero/therapeutic-response.png"
                alt={m['scientific_poster_page.image_alt']()}
                width={1920}
                height={1080}
                className="h-full w-full object-cover pt-20"
              />
              <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 gap-2 bg-white/94 p-4">
                <span className="h-8 rounded-sm bg-sky-100" />
                <span className="h-8 rounded-sm bg-amber-100" />
                <span className="h-8 rounded-sm bg-emerald-100" />
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
