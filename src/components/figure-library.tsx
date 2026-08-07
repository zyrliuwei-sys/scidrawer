import { ArrowRight } from 'lucide-react';

import { useRouter } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';

export type FigureLibraryItem = {
  id: string;
  category: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  prompt: string;
};

type FigureLibraryProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: FigureLibraryItem[];
  exampleLabel: string;
  viewLabel: string;
  startLabel: string;
};

export function FigureLibrary({
  eyebrow,
  title,
  description,
  items,
  exampleLabel,
  viewLabel,
  startLabel,
}: FigureLibraryProps) {
  const router = useRouter();

  const openGenerator = (prompt?: string) => {
    router.push(
      prompt ? `/generate?prompt=${encodeURIComponent(prompt)}` : '/generate'
    );
  };
  const [featuredItem, ...supportingItems] = items;

  return (
    <section
      id="examples"
      aria-labelledby="figure-library-title"
      className="border-border bg-secondary/30 border-y px-4 py-24 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-primary text-xs font-bold tracking-[0.16em] uppercase">
            {eyebrow}
          </p>
          <h2
            id="figure-library-title"
            className="mt-4 min-w-0 font-serif text-4xl leading-[1.12] font-normal tracking-tight [overflow-wrap:anywhere] sm:text-5xl"
          >
            {title}
          </h2>
          <p className="text-muted-foreground mt-5 text-base leading-7 sm:text-lg">
            {description}
          </p>
        </div>

        {featuredItem && (
          <button
            type="button"
            onClick={() => openGenerator(featuredItem.prompt)}
            aria-label={`${viewLabel}: ${featuredItem.title}`}
            className="group border-border bg-card focus-visible:ring-ring hover:border-primary/45 mt-10 grid min-w-0 overflow-hidden rounded-[1.5rem] border text-left transition-[border-color,box-shadow,transform] duration-300 ease-out hover:shadow-[0_22px_50px_oklch(0.28_0.03_240_/_0.11)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]"
          >
            <div className="flex min-w-0 flex-col justify-between p-7 sm:p-9 lg:py-10">
              <div>
                <p className="text-primary text-[11px] font-bold tracking-[0.16em] uppercase">
                  {exampleLabel}
                </p>
                <h3 className="mt-4 min-w-0 font-serif text-3xl leading-[1.13] font-normal [overflow-wrap:anywhere] sm:text-4xl">
                  {featuredItem.title}
                </h3>
                <p className="text-muted-foreground mt-5 max-w-md text-base leading-7">
                  {featuredItem.description}
                </p>
              </div>
              <span className="text-primary mt-8 inline-flex w-fit items-center gap-2 text-sm font-semibold whitespace-nowrap">
                {startLabel}
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>

            <div className="bg-muted relative min-h-72 overflow-hidden lg:min-h-[31rem]">
              <img
                src={featuredItem.imageSrc}
                alt={featuredItem.imageAlt}
                width={1774}
                height={887}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
            </div>
          </button>
        )}

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {supportingItems.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openGenerator(item.prompt)}
              aria-label={`${viewLabel}: ${item.title}`}
              className={cn(
                'group border-border bg-card focus-visible:ring-ring flex min-w-0 flex-col rounded-2xl border p-3 text-left transition-[border-color,box-shadow,transform] duration-300 ease-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none md:h-full md:p-4',
                'hover:border-primary/45 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_oklch(0.28_0.03_240_/_0.1)] active:translate-y-0'
              )}
            >
              <div className="flex min-h-29 flex-col px-2 pt-2 pb-5 sm:px-3">
                <span className="text-primary text-[11px] font-bold tracking-[0.15em] uppercase">
                  {String(index + 2).padStart(2, '0')}
                </span>
                <h3 className="mt-2 line-clamp-2 min-h-[3.5rem] min-w-0 font-serif text-2xl leading-tight font-normal [overflow-wrap:anywhere]">
                  {item.title}
                </h3>
                <p className="text-muted-foreground mt-3 line-clamp-2 min-h-12 text-sm leading-6">
                  {item.description}
                </p>
              </div>

              <div className="bg-muted relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-black/5">
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  width={1774}
                  height={887}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-9 flex justify-center">
          <button
            type="button"
            onClick={() => openGenerator()}
            className="text-primary focus-visible:ring-ring hover:bg-primary/8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {startLabel}
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
