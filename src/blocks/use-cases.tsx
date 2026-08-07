import {
  Atom,
  ImageIcon,
  Microscope,
  Presentation,
  type LucideIcon,
} from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';

const CASES: {
  key: 'mechanism' | 'abstract' | 'poster' | 'reference';
  icon: LucideIcon;
}[] = [
  { key: 'mechanism', icon: Atom },
  { key: 'abstract', icon: ImageIcon },
  { key: 'poster', icon: Presentation },
  { key: 'reference', icon: Microscope },
];

export function UseCases() {
  return (
    <section
      id="use-cases"
      aria-labelledby="use-cases-title"
      className="border-border border-t px-4 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <p className="text-muted-foreground mb-3 text-sm font-medium tracking-widest uppercase">
            {m['landing.use_cases.eyebrow']()}
          </p>
          <h2
            id="use-cases-title"
            className="font-serif text-4xl font-normal tracking-tight sm:text-5xl"
          >
            {m['landing.use_cases.title']()}
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-3xl text-base leading-relaxed">
            {m['landing.use_cases.description']()}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {CASES.map(({ key, icon: Icon }) => (
            <article
              key={key}
              className="border-border/60 bg-card/30 rounded-2xl border p-6 sm:p-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-xl font-semibold tracking-tight">
                  {tDynamic(`landing.use_cases.${key}.title`)}
                </h3>
              </div>
              <p className="text-muted-foreground text-base leading-relaxed">
                {tDynamic(`landing.use_cases.${key}.body`)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
