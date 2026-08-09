import { m } from '@/paraglide/messages.js';
import {
  PopularDiagrams,
  type PopularDiagramItem,
} from '@/components/popular-diagrams';

export function PopularDiagramsSection() {
  const items: PopularDiagramItem[] = [
    {
      id: 'plant-cell-labeled',
      imageSrc: '/imgs/diagrams/plant-cell-labeled.svg',
      imageAlt: m['landing.popular_diagrams.items.plant.alt'](),
      icon: '🌱',
      category: m['landing.popular_diagrams.items.plant.category'](),
      title: m['landing.popular_diagrams.items.plant.title'](),
      description: m['landing.popular_diagrams.items.plant.description'](),
      linkLabel: m['landing.popular_diagrams.items.plant.link'](),
      href: '/plant-cell-labeled',
    },
    {
      id: 'graphical-abstract-templates',
      imageSrc: '/imgs/showcase/graphical-abstracts.svg',
      imageAlt: m['landing.popular_diagrams.items.abstract.alt'](),
      icon: '🧬',
      category: m['landing.popular_diagrams.items.abstract.category'](),
      title: m['landing.popular_diagrams.items.abstract.title'](),
      description: m['landing.popular_diagrams.items.abstract.description'](),
      linkLabel: m['landing.popular_diagrams.items.abstract.link'](),
      href: '/#use-cases',
    },
    {
      id: 'mechanism-pathway-diagrams',
      imageSrc: '/imgs/generated/signaling-cascade.png',
      imageAlt: m['landing.popular_diagrams.items.pathway.alt'](),
      icon: '↗',
      category: m['landing.popular_diagrams.items.pathway.category'](),
      title: m['landing.popular_diagrams.items.pathway.title'](),
      description: m['landing.popular_diagrams.items.pathway.description'](),
      linkLabel: m['landing.popular_diagrams.items.pathway.link'](),
      href: '/#how-it-works',
    },
    {
      id: 'lab-equipment-icons',
      imageSrc: '/imgs/showcase/lab-setups.svg',
      imageAlt: m['landing.popular_diagrams.items.lab.alt'](),
      icon: '🧪',
      category: m['landing.popular_diagrams.items.lab.category'](),
      title: m['landing.popular_diagrams.items.lab.title'](),
      description: m['landing.popular_diagrams.items.lab.description'](),
      linkLabel: m['landing.popular_diagrams.items.lab.link'](),
      href: '/#features',
    },
  ];

  return (
    <PopularDiagrams
      eyebrow={m['landing.popular_diagrams.eyebrow']()}
      title={m['landing.popular_diagrams.title']()}
      description={m['landing.popular_diagrams.description']()}
      items={items}
    />
  );
}
