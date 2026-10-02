import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';

const GUIDE_ITEMS = ['brief', 'structure', 'review'] as const;

export function ResearchFigureGuide() {
  return (
    <section
      aria-labelledby="research-figure-guide-title"
      className="border-border/70 bg-muted/25 border-y px-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
            {m['landing.research_guide.eyebrow']()}
          </p>
          <h2
            id="research-figure-guide-title"
            className="mt-3 font-serif text-4xl font-normal tracking-tight sm:text-5xl"
          >
            {m['landing.research_guide.title']()}
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-7 sm:text-lg">
            {m['landing.research_guide.description']()}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {GUIDE_ITEMS.map((item, index) => (
            <article
              className="border-border/70 bg-background rounded-2xl border p-6 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.5)]"
              key={item}
            >
              <span className="text-muted-foreground text-sm tabular-nums">
                0{index + 1}
              </span>
              <h3 className="mt-8 text-lg font-semibold tracking-tight">
                {tDynamic(`landing.research_guide.${item}.title`)}
              </h3>
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                {tDynamic(`landing.research_guide.${item}.description`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
