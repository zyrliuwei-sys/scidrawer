import {
  Images,
  LayoutGrid,
  PenLine,
  Presentation,
  Shapes,
  Wand2,
  type LucideIcon,
} from 'lucide-react';

import { tDynamic } from '@/core/i18n/dynamic';
import { m } from '@/paraglide/messages.js';
import { HoverEffect } from '@/components/ui/card-hover-effect';

export function Features() {
  const features: { key: string; icon: LucideIcon }[] = [
    { key: 'text2figure', icon: Wand2 },
    { key: 'sketch', icon: PenLine },
    { key: 'reference', icon: Images },
    { key: 'vector', icon: Shapes },
    { key: 'library', icon: LayoutGrid },
    { key: 'poster', icon: Presentation },
  ];

  return (
    <section id="features" className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-20 text-center">
          <h2 className="font-serif text-4xl font-normal tracking-tight sm:text-5xl">
            {m['landing.features.title']()}
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-lg">
            {m['landing.features.description']()}
          </p>
        </div>
        <HoverEffect
          className="py-0"
          items={features.map(({ key, icon }) => ({
            title: tDynamic(`landing.features.${key}.title`),
            description: tDynamic(`landing.features.${key}.description`),
            icon,
          }))}
        />
      </div>
    </section>
  );
}
