'use client';

import { m } from '@/paraglide/messages.js';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

type MarqueeCategory = {
  key: string;
  label: string;
  image: string;
  frameClassName: string;
  annotationLines: string[];
  annotationClassName: string;
};

export function GenerateMarquee() {
  const categories: MarqueeCategory[] = [
    {
      key: 'signaling-cascade',
      label: m['landing.gallery.signaling.title'](),
      image: '/imgs/generated/signaling-cascade.png',
      frameClassName: 'w-[22rem] sm:w-[25rem]',
      annotationLines: ['codex --search', '"trace receptor signaling"'],
      annotationClassName:
        'top-3 left-3 border-l border-slate-700/35 text-left',
    },
    {
      key: 'microfluidic-workflow',
      label: m['landing.gallery.microfluidic.title'](),
      image: '/imgs/generated/microfluidic-workflow.png',
      frameClassName: 'w-[22rem] sm:w-[25rem]',
      annotationLines: ['codex exec', '"diagram the assay workflow"'],
      annotationClassName:
        'top-3 right-3 border-r border-slate-700/35 text-right',
    },
    {
      key: 'cellular-architecture',
      label: m['landing.gallery.cellular.title'](),
      image: '/imgs/generated/cellular-architecture.png',
      frameClassName: 'w-[22rem] sm:w-[25rem]',
      annotationLines: ['codex --image', './cell-architecture.png'],
      annotationClassName:
        'bottom-3 left-3 border-t border-slate-700/40 text-left',
    },
    {
      key: 'rna-therapeutic-delivery',
      label: m['landing.gallery.rna.title'](),
      image: '/imgs/generated/rna-therapeutic-delivery.png',
      frameClassName: 'w-[22rem] sm:w-[25rem]',
      annotationLines: ['codex resume --last', '"compare delivery routes"'],
      annotationClassName:
        'right-3 bottom-3 border-b border-slate-700/40 text-right',
    },
    {
      key: 'synapse-transmission',
      label: m['landing.gallery.synapse.title'](),
      image: '/imgs/generated/synapse-transmission.png',
      frameClassName: 'w-[22rem] sm:w-[25rem]',
      annotationLines: ['codex --image', './synapse-transmission.png'],
      annotationClassName: 'top-3 left-3 border-t border-primary/65 text-left',
    },
    {
      key: 'single-cell-workflow',
      label: m['landing.gallery.single_cell.title'](),
      image: '/imgs/generated/single-cell-workflow.png',
      frameClassName: 'w-[22rem] sm:w-[25rem]',
      annotationLines: ['codex exec', '"cluster the cell atlas"'],
      annotationClassName:
        'right-3 bottom-3 border-r border-primary/65 text-right',
    },
    {
      key: 'crispr-repair',
      label: m['landing.gallery.crispr.title'](),
      image: '/imgs/generated/crispr-repair.png',
      frameClassName: 'w-[22rem] sm:w-[25rem]',
      annotationLines: ['codex --search', '"inspect repair pathways"'],
      annotationClassName:
        'bottom-3 left-3 border-l border-slate-700/40 text-left',
    },
    {
      key: 'mechanism-analysis',
      label: m['landing.gallery.mechanism.title'](),
      image: '/imgs/hero/mechanism-analysis.png',
      frameClassName: 'w-[18rem] sm:w-[20rem]',
      annotationLines: ['codex review', '--uncommitted'],
      annotationClassName:
        'top-3 left-3 border-l-2 border-primary/65 text-left',
    },
    {
      key: 'therapeutic-response',
      label: m['landing.gallery.therapeutic.title'](),
      image: '/imgs/hero/therapeutic-response.png',
      frameClassName: 'w-[18rem] sm:w-[20rem]',
      annotationLines: ['codex --model', 'gpt-5.6-sol'],
      annotationClassName:
        'top-3 right-3 border-t border-primary/65 text-right',
    },
    {
      key: 'spatial-omics',
      label: m['landing.gallery.spatial.title'](),
      image: '/imgs/hero/spatial-omics.png',
      frameClassName: 'w-[18rem] sm:w-[20rem]',
      annotationLines: ['codex', '--dangerously-bypass-approvals-and-sandbox'],
      annotationClassName:
        'bottom-3 left-3 border-r border-primary/65 text-left',
    },
    {
      key: 'mechanism-pathways',
      label: m['landing.gallery.pathways.title'](),
      image: '/imgs/showcase/mechanism-pathways.svg',
      frameClassName: 'w-[18rem] sm:w-[21rem]',
      annotationLines: ['codex fork --last', '"map the pathway"'],
      annotationClassName:
        'top-3 right-3 border-r border-slate-700/40 text-right',
    },
    {
      key: 'lab-setups',
      label: m['landing.gallery.lab.title'](),
      image: '/imgs/showcase/lab-setups.svg',
      frameClassName: 'w-[18rem] sm:w-[21rem]',
      annotationLines: ['codex resume', '"document the setup"'],
      annotationClassName:
        'bottom-3 left-3 border-t border-primary/65 text-left',
    },
    {
      key: 'microscopic-structures',
      label: m['landing.gallery.microscopy.title'](),
      image: '/imgs/showcase/microscopic-structures.svg',
      frameClassName: 'w-[18rem] sm:w-[21rem]',
      annotationLines: ['codex --image', './microscopic-structure.svg'],
      annotationClassName:
        'top-3 left-3 border-b border-slate-700/40 text-left',
    },
    {
      key: 'graphical-abstracts',
      label: m['landing.gallery.abstract.title'](),
      image: '/imgs/showcase/graphical-abstracts.svg',
      frameClassName: 'w-[18rem] sm:w-[21rem]',
      annotationLines: ['codex exec', '"compose the graphical abstract"'],
      annotationClassName:
        'right-3 bottom-3 border-l-2 border-primary/65 text-right',
    },
  ];

  return (
    <section
      aria-labelledby="gallery-title"
      className="bg-background w-full py-10 md:py-14"
    >
      <h2 id="gallery-title" className="sr-only">
        {m['landing.gallery.title']()}
      </h2>
      <div className="space-y-3">
        <InfiniteMovingCards
          items={categories.slice(0, 7)}
          direction="left"
          speed="fast"
          pauseOnHover
          className="[mask-image:linear-gradient(to_right,transparent,white_4%,white_96%,transparent)]"
          renderItem={(cat) => <ScientificFigure item={cat} />}
        />
        <InfiniteMovingCards
          items={categories.slice(7)}
          direction="right"
          speed="fast"
          pauseOnHover
          className="[mask-image:linear-gradient(to_right,transparent,white_4%,white_96%,transparent)]"
          renderItem={(cat) => <ScientificFigure item={cat} />}
        />
      </div>
    </section>
  );
}

function ScientificFigure({ item }: { item: MarqueeCategory }) {
  return (
    <figure
      className={`border-border bg-card relative h-[12.5rem] shrink-0 overflow-hidden rounded-[1.6rem] border shadow-[0_8px_22px_oklch(0.28_0.03_240_/_0.09)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_oklch(0.28_0.03_240_/_0.14)] sm:h-[14rem] ${item.frameClassName}`}
    >
      <img
        src={item.image}
        alt={item.label}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className={`pointer-events-none absolute max-w-[calc(100%-1.5rem)] px-1.5 py-1 font-mono text-[8px] leading-3 text-slate-800 [text-shadow:0_1px_0_rgb(255_255_255_/_0.75)] sm:text-[9px] ${item.annotationClassName}`}
      >
        <code className="block">
          {item.annotationLines.map((line) => (
            <span key={line} className="block break-all">
              {line}
            </span>
          ))}
        </code>
      </div>
    </figure>
  );
}
