import { m } from '@/paraglide/messages.js';
import { SiteHeader, type NavLink } from '@/components/site-header';
import { CATEGORIES } from '@/content/games/categories';

export function Header() {
  const navLinks: NavLink[] = [
    { href: '/#trending', label: m['dir.nav.trending']() },
    { href: '/browse', label: m['dir.nav.browse']() },
    {
      href: '/#categories',
      label: m['dir.nav.categories'](),
      children: CATEGORIES.map((c) => ({
        href: `/category/${c.id}`,
        label: `${c.emoji} ${c.name}`,
      })),
    },
    { href: '/blog', label: m['dir.nav.blog']() },
  ];

  return (
    <SiteHeader
      navLinks={navLinks}
      cta={{ href: '/settings/tickets', label: m['dir.nav.submit']() }}
    />
  );
}
