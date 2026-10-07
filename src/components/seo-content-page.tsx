import type { ReactNode } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { localizeHref } from '@/paraglide/runtime.js';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { SeoPresetTool } from '@/components/seo-preset-tool';
import type { SeoLink, SeoPageContent } from '@/content/seo-pages';

function InlineText({ text }: { text: string }) {
  const linkPattern = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    nodes.push(
      <a
        key={`${match.index}-${match[1]}`}
        href={localizeHref(match[2])}
        className="text-primary decoration-primary/35 hover:decoration-primary font-semibold underline underline-offset-4 transition-colors"
      >
        {match[1]}
      </a>
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes.length > 0 ? nodes : text;
}

function LinkList({ links }: { links?: SeoLink[] }) {
  if (!links?.length) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
      {links.map((link) => (
        <a
          key={`${link.href}-${link.label}`}
          href={localizeHref(link.href)}
          className="text-primary decoration-primary/35 hover:decoration-primary font-semibold underline underline-offset-4 transition-colors"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

export function SeoContentPage({ content }: { content: SeoPageContent }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 px-4 py-14 sm:px-6 sm:py-20">
        <nav
          aria-label={content.breadcrumbCurrent}
          className="mx-auto mb-6 max-w-6xl"
        >
          <ol className="text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm">
            <li>
              <a
                href={localizeHref('/')}
                className="hover:text-foreground transition-colors"
              >
                {content.breadcrumbHome}
              </a>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li>
              <a
                href={localizeHref('/templates')}
                className="hover:text-foreground transition-colors"
              >
                {content.breadcrumbLibrary}
              </a>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li aria-current="page" className="text-foreground font-medium">
              {content.breadcrumbCurrent}
            </li>
          </ol>
        </nav>

        <article className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-emerald-900/15 bg-[linear-gradient(135deg,oklch(0.985_0.012_165),oklch(0.955_0.024_100))] shadow-[0_24px_60px_oklch(0.24_0.05_165_/_0.12)] lg:grid-cols-[0.94fr_1.06fr] dark:border-emerald-200/15 dark:bg-[linear-gradient(135deg,oklch(0.19_0.026_165),oklch(0.15_0.018_100))]">
          <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-14">
            <p className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase">
              {content.eyebrow}
            </p>
            <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[1.04] tracking-tight sm:text-6xl">
              {content.h1}
            </h1>
            <p className="text-muted-foreground mt-6 max-w-xl text-base leading-7 sm:text-lg">
              {content.intro}
            </p>
            {content.tool ? null : (
              <a
                href={localizeHref('/generate')}
                className="bg-primary text-primary-foreground focus-visible:ring-ring mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {content.ctaLabel}
                <ArrowRight className="size-4" aria-hidden />
              </a>
            )}
            {content.tool ? (
              <div className="mt-8 hidden max-w-md rounded-2xl border border-white/80 bg-white/90 p-3 lg:block dark:border-white/10 dark:bg-white/5">
                <img
                  src={content.heroImage}
                  alt={content.heroImageAlt}
                  width={960}
                  height={640}
                  className="h-auto w-full"
                />
              </div>
            ) : null}
          </div>

          <div className="relative min-h-100 overflow-hidden bg-emerald-950/10 p-4 sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_88%_8%,oklch(0.8_0.13_95_/_0.36),transparent_30%)]" />
            {content.tool ? (
              <div className="relative mx-auto max-w-xl">
                <SeoPresetTool tool={content.tool} />
              </div>
            ) : (
              <div className="relative mx-auto flex h-full max-w-lg items-center rounded-2xl border border-white/80 bg-white/90 p-4 shadow-[0_28px_54px_oklch(0.19_0.06_165_/_0.22)] backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                <img
                  src={content.heroImage}
                  alt={content.heroImageAlt}
                  width={960}
                  height={640}
                  className="h-auto w-full"
                />
              </div>
            )}
          </div>
        </article>

        <div className="mx-auto mt-8 max-w-4xl space-y-8">
          {content.sections.map((section) => (
            <section
              key={section.heading}
              className="border-border bg-card rounded-[1.5rem] border px-7 py-8 sm:px-10 sm:py-10"
            >
              <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
                {section.heading}
              </h2>
              <div className="text-foreground/90 mt-5 space-y-4 text-[15px] leading-7">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    <InlineText text={paragraph} />
                  </p>
                ))}
              </div>

              {section.bullets?.length ? (
                <ul className="text-foreground/90 mt-5 list-disc space-y-2 pl-5 text-[15px] leading-7">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}

              {section.subsections?.length ? (
                <div className="mt-7 space-y-7">
                  {section.subsections.map((subsection) => (
                    <div key={subsection.heading}>
                      <h3 className="text-lg font-semibold tracking-tight">
                        {subsection.heading}
                      </h3>
                      <div className="text-foreground/90 mt-3 space-y-3 text-[15px] leading-7">
                        {subsection.paragraphs.map((paragraph) => (
                          <p key={paragraph}>
                            <InlineText text={paragraph} />
                          </p>
                        ))}
                      </div>
                      <LinkList links={subsection.links} />
                    </div>
                  ))}
                </div>
              ) : null}

              {section.examples?.length ? (
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  {section.examples.map((example) => (
                    <figure
                      key={example.title}
                      className="border-border overflow-hidden rounded-2xl border"
                    >
                      <div className="bg-muted aspect-[16/10] overflow-hidden">
                        <img
                          src={example.image}
                          alt={example.alt}
                          width={960}
                          height={640}
                          loading="lazy"
                          className="size-full object-cover"
                        />
                      </div>
                      <figcaption className="p-5">
                        <h3 className="font-semibold">{example.title}</h3>
                        <p className="text-muted-foreground mt-2 text-sm leading-6">
                          {example.description}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}

              <LinkList links={section.links} />
            </section>
          ))}

          <section
            id="faq"
            className="border-border bg-card rounded-[1.5rem] border px-7 py-8 sm:px-10 sm:py-10"
          >
            <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
              {content.faqHeading}
            </h2>
            <div className="divide-border mt-5 divide-y">
              {content.faq.map((item) => (
                <details
                  key={item.question}
                  className="group py-4 first:pt-0 last:pb-0"
                >
                  <summary className="group-open:text-primary cursor-pointer list-none pr-8 text-base font-semibold marker:hidden">
                    {item.question}
                  </summary>
                  <p className="text-muted-foreground mt-3 text-[15px] leading-7">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="border-border bg-card rounded-[1.5rem] border px-7 py-8 sm:px-10 sm:py-10">
            <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
              {content.tryHeading}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-3xl text-[15px] leading-7">
              {content.tryParagraph}
            </p>
            <a
              href={localizeHref('/generate')}
              className="bg-primary text-primary-foreground focus-visible:ring-ring mt-7 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {content.tryLabel}
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </section>

          <section className="border-border bg-card rounded-[1.5rem] border px-7 py-8 sm:px-10 sm:py-10">
            <h2 className="font-serif text-2xl tracking-tight sm:text-3xl">
              {content.relatedHeading}
            </h2>
            <p className="text-muted-foreground mt-3 text-[15px] leading-7">
              {content.relatedDescription}
            </p>
            <LinkList links={content.relatedLinks} />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
