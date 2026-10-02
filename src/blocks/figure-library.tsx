import { m } from '@/paraglide/messages.js';
import {
  FigureLibrary,
  type FigureLibraryItem,
} from '@/components/figure-library';

export function FigureLibrarySection() {
  const items: FigureLibraryItem[] = [
    {
      id: 'signaling-cascade',
      category: 'mechanism',
      imageSrc: '/imgs/generated/signaling-cascade.png',
      imageAlt: m['landing.figure_library.items.signaling.alt'](),
      title: m['landing.figure_library.items.signaling.title'](),
      description: m['landing.figure_library.items.signaling.description'](),
      prompt: m['landing.figure_library.items.signaling.prompt'](),
    },
    {
      id: 'cellular-architecture',
      category: 'cellular',
      imageSrc: '/imgs/generated/cellular-architecture.png',
      imageAlt: m['landing.figure_library.items.cellular.alt'](),
      title: m['landing.figure_library.items.cellular.title'](),
      description: m['landing.figure_library.items.cellular.description'](),
      prompt: m['landing.figure_library.items.cellular.prompt'](),
    },
    {
      id: 'spatial-omics',
      category: 'cellular',
      imageSrc: '/imgs/hero/spatial-omics.png',
      imageAlt: m['landing.figure_library.items.spatial.alt'](),
      title: m['landing.figure_library.items.spatial.title'](),
      description: m['landing.figure_library.items.spatial.description'](),
      prompt: m['landing.figure_library.items.spatial.prompt'](),
    },
    {
      id: 'rna-delivery',
      category: 'abstract',
      imageSrc: '/imgs/generated/rna-therapeutic-delivery.png',
      imageAlt: m['landing.figure_library.items.rna.alt'](),
      title: m['landing.figure_library.items.rna.title'](),
      description: m['landing.figure_library.items.rna.description'](),
      prompt: m['landing.figure_library.items.rna.prompt'](),
    },
  ];

  return (
    <FigureLibrary
      eyebrow={m['landing.figure_library.eyebrow']()}
      title={m['landing.figure_library.title']()}
      description={m['landing.figure_library.description']()}
      items={items}
      exampleLabel={m['landing.figure_library.example_label']()}
      viewLabel={m['landing.figure_library.view_label']()}
      startLabel={m['landing.figure_library.start_label']()}
    />
  );
}
