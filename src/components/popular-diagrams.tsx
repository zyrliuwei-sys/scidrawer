import { ArrowUpRight } from 'lucide-react';

export type PopularDiagramItem = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  icon: string;
  category: string;
  title: string;
  description: string;
  linkLabel: string;
  href: string;
};

type PopularDiagramsProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: PopularDiagramItem[];
};

/**
 * A compact, browse-first collection of high-intent diagram starting points.
 * Content and translations are supplied by the landing-page block so this
 * component remains reusable on a future library or category page.
 */
export function PopularDiagrams({
  eyebrow,
  title,
  description,
  items,
}: PopularDiagramsProps) {
  return (
    <section
      id="popular-diagrams"
      aria-labelledby="popular-diagrams-title"
      className="border-border relative isolate overflow-hidden border-y bg-[linear-gradient(125deg,oklch(0.98_0.007_120),oklch(0.955_0.014_145))] px-4 py-20 sm:px-6 sm:py-28 dark:bg-[linear-gradient(125deg,oklch(0.21_0.02_155),oklch(0.17_0.016_190))]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-28 -right-28 size-80 rounded-full border border-emerald-800/10 bg-emerald-400/10 blur-3xl dark:border-emerald-200/10 dark:bg-emerald-300/5"
      />
      <div className="relative mx-auto max-w-[88rem]">
        <div className="flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-primary text-[11px] font-bold tracking-[0.2em] uppercase">
              {eyebrow}
            </p>
            <h2
              id="popular-diagrams-title"
              className="mt-3 font-serif text-4xl leading-[1.08] tracking-tight sm:text-5xl"
            >
              {title}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md text-sm leading-6 sm:pb-1 sm:text-right">
            {description}
          </p>
        </div>

        <div className="mt-10 overflow-x-auto pb-4">
          <ol className="grid min-w-[1300px] grid-cols-4 gap-5">
            {items.map((item, index) => (
              <li key={item.id} className="min-w-0">
                <a
                  href={item.href}
                  aria-label={item.linkLabel}
                  className="group border-border bg-background/85 focus-visible:ring-ring dark:bg-card/80 block h-full overflow-hidden rounded-2xl border shadow-[0_10px_25px_oklch(0.26_0.035_160_/_0.07)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-emerald-700/45 hover:shadow-[0_20px_40px_oklch(0.26_0.035_160_/_0.16)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none dark:hover:border-emerald-300/40"
                >
                  <div className="bg-muted relative aspect-square min-h-[300px] overflow-hidden">
                    <img
                      src={item.imageSrc}
                      alt={item.imageAlt}
                      width={600}
                      height={600}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 grid size-9 place-items-center rounded-full border border-white/55 bg-white/88 text-lg shadow-sm backdrop-blur-sm dark:border-white/20 dark:bg-slate-950/65">
                      <span aria-hidden>{item.icon}</span>
                    </span>
                    <span className="absolute right-3 bottom-3 font-mono text-[11px] font-semibold tracking-[0.14em] text-white/90">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex min-h-48 flex-col p-5">
                    <p className="text-primary text-[10px] font-bold tracking-[0.16em] uppercase">
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl leading-tight tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground mt-3 text-sm leading-6">
                      {item.description}
                    </p>
                    <span className="text-primary mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold">
                      {item.linkLabel}
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
