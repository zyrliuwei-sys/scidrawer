import { createFileRoute } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { Browse } from '@/blocks/browse';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { buildPageHead } from '@/blocks/seo';
import { getBrowseData } from '@/content/games/server';

export const Route = createFileRoute('/browse')({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === 'string' ? search.q : undefined,
  }),
  loader: async () => {
    const locale = getLocale();
    return {
      locale,
      title: m['dir.seo.browse_title'](
        { name: envConfigs.app_name },
        { locale }
      ),
      description: m['dir.browse.description']({}, { locale }),
      data: await getBrowseData(),
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildPageHead({
          path: '/browse',
          locale: loaderData.locale,
          title: loaderData.title,
          description: loaderData.description,
        })
      : {},
  component: BrowsePage,
});

function BrowsePage() {
  const { data } = Route.useLoaderData();
  const { q } = Route.useSearch();
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <Browse
        key={q ?? ''}
        guides={data.guides}
        categories={data.categories}
        initialQuery={q ?? ''}
      />
      <Footer />
    </div>
  );
}
