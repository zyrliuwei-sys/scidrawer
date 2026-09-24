import { createFileRoute } from '@tanstack/react-router';

import { getSiteUrl } from '@/config';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () => {
        const origin = getSiteUrl();
        const body = [
          'User-Agent: *',
          'Allow: /',
          'Disallow: /admin',
          'Disallow: /zh/admin',
          'Disallow: /settings',
          'Disallow: /zh/settings',
          'Disallow: /api/',
          // Public routes do not use query parameters to carry indexable
          // content; prompt, auth, and account URLs are intentionally not
          // separate search landing pages.
          'Disallow: /*?*',
          '',
          `Sitemap: ${origin}/sitemap.xml`,
          '',
        ].join('\n');
        return new Response(body, {
          headers: { 'Content-Type': 'text/plain' },
        });
      },
    },
  },
});
