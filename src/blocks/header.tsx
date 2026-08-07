import { m } from '@/paraglide/messages.js';
import { SiteHeader } from '@/components/site-header';

export function Header() {
  const navLinks = [
    { href: '/#features', label: m['landing.nav.features']() },
    { href: '/#how-it-works', label: m['landing.nav.how_it_works']() },
    { href: '/#examples', label: m['landing.nav.examples']() },
    { href: '/#pricing', label: m['landing.nav.pricing']() },
    { href: '/#faq', label: m['landing.nav.faq']() },
  ];

  return <SiteHeader navLinks={navLinks} />;
}
