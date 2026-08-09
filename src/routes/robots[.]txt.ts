import { createFileRoute } from '@tanstack/react-router';

import { getRequestOrigin } from '@/lib/request-origin';

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: ({ request }: { request: Request }) => {
        const origin = getRequestOrigin(request);
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
