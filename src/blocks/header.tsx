import { m } from '@/paraglide/messages.js';
import { SiteHeader, type NavLink } from '@/components/site-header';

export function Header() {
  const navLinks: NavLink[] = [
    { href: '/generate', label: m['common.nav.generate']() },
    { href: '/pricing', label: m['landing.footer.pricing']() },
    { href: '/#faq', label: m['landing.footer.faq']() },
  ];

  return <SiteHeader navLinks={navLinks} />;
}
