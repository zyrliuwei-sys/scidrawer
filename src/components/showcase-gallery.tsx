import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  AppleCardModal,
  Card,
  Carousel,
  type AppleCardData,
} from '@/components/ui/apple-cards-carousel';
import { Button } from '@/components/ui/button';

type CategoryKey =
  | 'all'
  | 'mechanism'
  | 'process'
  | 'microstructure'
  | 'network'
  | 'graphical'
  | 'lab';

const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'mechanism', label: '机制示意图' },
  { key: 'process', label: '流程示意图' },
  { key: 'graphical', label: '图形摘要' },
  { key: 'lab', label: '实验仪器图' },
  { key: 'microstructure', label: '微观结构图' },
  { key: 'network', label: '网络示意图' },
];

/**
 * Full showcase gallery — a horizontally-scrolling row of cards matching
 * the Apple-cards-carousel pattern. Each card has a category badge, a
 * title, an image, and a "via Generated with SciDrawer AI" subtitle.
 * Clicking a card opens a side-sheet modal with the full preview.
 *
 * The data is intentionally small and self-contained: it reuses the 4
 * high-fidelity SVGs from `public/imgs/showcase/` under different titles
 * so the carousel can demonstrate the layout without external assets.
 */
const SHOWCASE_CARDS: AppleCardData[] = [
  {
    category: 'Mechanism Diagram',
    title: 'Extrinsic apoptosis pathway',
    src: '/imgs/showcase/mechanism-pathways.svg',
    content: (
      <>
        <p>
          A canonical extrinsic apoptosis diagram (FasL → Fas receptor →
          Caspase-8 → Caspase-3 → Apoptosis). Generated with SciDrawer AI from a
          single prompt and refined with the inline editor.
        </p>
        <p>
          Researchers use this template to map receptor-level signaling to
          downstream effector caspases and to annotate therapeutic targets (BRAF
          inhibitors, MEK inhibitors, etc.).
        </p>
      </>
    ),
  },
  {
    category: 'Mechanism Diagram',
    title: 'MAPK / ERK signaling cascade',
    src: '/imgs/showcase/mechanism-pathways.svg',
    content: (
      <p>
        Receptor tyrosine kinase (RTK) activation recruits Ras → Raf → MEK →
        ERK, ultimately driving transcription factor activity in the nucleus.
        The cascade is mutated in roughly 30% of human cancers.
      </p>
    ),
  },
  {
    category: 'Process Flow Diagram',
    title: 'Polymerase chain reaction (PCR)',
    src: '/imgs/showcase/lab-setups.svg',
    content: (
      <p>
        Three-step thermocycler workflow — denature, anneal, extend — repeated
        25–35× to amplify a target DNA region. The diagram includes a DNA
        amplification curve and per-step temperature annotations.
      </p>
    ),
  },
  {
    category: 'Lab Equipment Diagram',
    title: 'Western blot workflow',
    src: '/imgs/showcase/lab-setups.svg',
    content: (
      <>
        <p>
          Five-stage Western blot: sample prep → SDS-PAGE → transfer → block +
          antibody → chemiluminescent detection. Includes band positions at
          25/37/50/75 kDa and a representative developed blot.
        </p>
        <p>
          Use the prompt &ldquo;A Western blot workflow with band
          annotations&rdquo; to generate a similar figure for your manuscript
          methods section.
        </p>
      </>
    ),
  },
  {
    category: 'Microstructure Diagram',
    title: 'Eukaryotic cell — cross-section',
    src: '/imgs/showcase/microscopic-structures.svg',
    content: (
      <p>
        Cross-section of a eukaryotic cell labeling the nucleus, nucleolus,
        mitochondrion (with cristae), rough endoplasmic reticulum (with
        ribosomes), Golgi apparatus, and lysosomes.
      </p>
    ),
  },
  {
    category: 'Microstructure Diagram',
    title: 'Chloroplast — thylakoid & grana',
    src: '/imgs/showcase/microscopic-structures.svg',
    content: (
      <p>
        A chloroplast cross-section showing thylakoid stacks (grana) and the
        surrounding stroma. Useful for photosynthesis methods figures.
      </p>
    ),
  },
  {
    category: 'Graphical Abstract',
    title: 'mRNA-LNP vaccine study',
    src: '/imgs/showcase/graphical-abstracts.svg',
    content: (
      <p>
        Three-section graphical abstract: lipid nanoparticle formulation →
        intramuscular injection → antigen expression with titer trajectory over
        6 months.
      </p>
    ),
  },
  {
    category: 'Graphical Abstract',
    title: 'Journal cover — graphical abstract',
    src: '/imgs/showcase/graphical-abstracts.svg',
    content: (
      <p>
        Journal-cover style abstract for a deep-learning guided design of
        membrane protein scaffolds. Includes abstract body, keywords, authors,
        and a highlights strip.
      </p>
    ),
  },
];

/** Map a card's category string to one of the filter keys. */
const categoryToFilter = (cat: string): CategoryKey => {
  if (cat.startsWith('Mechanism')) return 'mechanism';
  if (cat.startsWith('Process')) return 'process';
  if (cat.startsWith('Lab')) return 'lab';
  if (cat.startsWith('Microstructure')) return 'microstructure';
  if (cat.startsWith('Network')) return 'network';
  if (cat.startsWith('Graphical')) return 'graphical';
  return 'all';
};

export function ShowcaseGallery() {
  const [filter, setFilter] = useState<CategoryKey>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Filtered list — recompute only when the active filter changes.
  const visibleCards = useMemo(() => {
    if (filter === 'all') return SHOWCASE_CARDS;
    return SHOWCASE_CARDS.filter(
      (c) => categoryToFilter(c.category) === filter
    );
  }, [filter]);

  const items = visibleCards.map((card, i) => (
    <Card
      key={`${card.title}-${i}`}
      card={card}
      index={i}
      onOpen={() => setOpenIndex(i)}
    />
  ));

  return (
    <section className="w-full">
      {/* Header — small caps label + headline + supporting line */}
      <div className="px-8">
        <p className="text-[12px] font-semibold tracking-[0.3em] text-sky-700 uppercase">
          Showcases
        </p>
        <h2 className="text-foreground mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          研究者用 SciDrawer AI 生成的图
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed">
          浏览为论文、海报、汇报生成的示意图。按分类筛选,
          找到适合下一篇手稿的图。
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-2 px-8">
        {CATEGORIES.map((cat) => {
          const isActive = filter === cat.key;
          return (
            <Button
              key={cat.key}
              type="button"
              variant={isActive ? 'default' : 'outline'}
              onClick={() => {
                setFilter(cat.key);
                setOpenIndex(null);
              }}
              className={cn(
                'h-9 rounded-full px-4 text-[13px]',
                isActive && 'shadow-sm'
              )}
            >
              {cat.label}
            </Button>
          );
        })}
        <div className="ml-auto hidden items-center gap-2 text-[12px] text-slate-500 sm:flex">
          <Search className="size-3.5" />
          {visibleCards.length} 张图
        </div>
      </div>

      {/* Grid — 2 rows × 4 cols of large cards (matches the reference
          screenshot). 8 cards fit on one screen; if more are added the
          grid grows vertically with the same column count. */}
      <div className="mt-8 px-8">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleCards.map((card, i) => (
              <Card
                key={`${card.title}-${i}`}
                card={card}
                index={i}
                onOpen={() => setOpenIndex(i)}
              />
            ))}
          </div>
        ) : (
          <p className="px-8 py-12 text-center text-[14px] text-slate-500">
            该分类下还没有图。
          </p>
        )}
      </div>

      {/* Modal */}
      <AppleCardModal
        open={openIndex !== null}
        onClose={() => setOpenIndex(null)}
        card={openIndex !== null ? visibleCards[openIndex] : null}
      />
    </section>
  );
}
