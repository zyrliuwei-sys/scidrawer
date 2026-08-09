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
          'Disallow: /settings',
          'Disallow: /api/',
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
