import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';
import {
  StickyScroll,
  type StickyScrollItem,
} from '@/components/ui/sticky-scroll-reveal';

const STEPS = [
  { key: 'step1', image: '/imgs/hero/mechanism-analysis.png' },
  { key: 'step2', image: '/imgs/generated/how-it-works-organ-chip.png' },
  { key: 'step3', image: '/imgs/generated/cellular-architecture.png' },
] as const;

export function HowItWorks() {
  const content: StickyScrollItem[] = STEPS.map(({ key, image }, i) => ({
    title: `${i + 1}. ${tDynamic(`landing.how_it_works.${key}.title`)}`,
    description: tDynamic(`landing.how_it_works.${key}.description`),
    content: (
      <img
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    ),
  }));

  return (
    <section
      id="how-it-works"
      className="border-border border-t px-4 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl">
            {m['landing.how_it_works.title']()}
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl">
            {m['landing.how_it_works.description']()}
          </p>
        </div>
        <StickyScroll content={content} />
      </div>
    </section>
  );
}
