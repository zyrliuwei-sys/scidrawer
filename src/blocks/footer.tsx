import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { SiteFooter } from '@/components/site-footer';
import { CATEGORIES } from '@/content/games/categories';

export function Footer() {
  return (
    <SiteFooter
      appName={envConfigs.app_name}
      tagline={m['dir.footer.tagline']()}
      columns={[
        {
          title: m['dir.footer.directory'](),
          links: [
            { label: m['dir.nav.trending'](), href: '/#trending' },
            { label: m['dir.nav.browse'](), href: '/browse' },
            { label: m['dir.nav.blog'](), href: '/blog' },
            { label: m['dir.nav.submit'](), href: '/settings/tickets' },
          ],
        },
        {
          title: m['dir.footer.categories'](),
          links: CATEGORIES.map((c) => ({
            label: c.name,
            href: `/category/${c.id}`,
          })),
        },
        {
          title: m['dir.footer.company'](),
          links: [
            { label: m['dir.footer.privacy'](), href: '/privacy-policy' },
            { label: m['dir.footer.terms'](), href: '/terms-of-service' },
          ],
        },
      ]}
      copyright={m['dir.footer.copyright']({
        year: String(new Date().getFullYear()),
        name: envConfigs.app_name,
      })}
    />
  );
}
