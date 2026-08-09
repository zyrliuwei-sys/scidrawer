import { m } from '@/paraglide/messages.js';
import { SiteHeader } from '@/components/site-header';

export function Header() {
  const navLinks = [
    { href: '/#features', label: m['landing.nav.features']() },
    { href: '/#how-it-works', label: m['landing.nav.how_it_works']() },
    { href: '/#examples', label: m['landing.nav.examples']() },
    { href: '/#pricing', label: m['landing.nav.pricing']() },
    {
      href: '/templates',
      label: m['landing.nav.diagrams'](),
      children: [
        {
          href: '/plant-cell-labeled',
          label: m['landing.nav.plant_cell_labeled'](),
        },
        {
          href: '/graphical-abstract-maker',
          label: m['landing.nav.graphical_abstract_maker'](),
        },
        {
          href: '/scientific-poster-maker',
          label: m['landing.nav.scientific_poster_maker'](),
        },
        {
          href: '/templates',
          label: m['landing.nav.view_all_templates'](),
        },
      ],
    },
    { href: '/#faq', label: m['landing.nav.faq']() },
  ];

  return <SiteHeader navLinks={navLinks} />;
}
