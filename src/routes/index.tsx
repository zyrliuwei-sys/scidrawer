import { createFileRoute } from '@tanstack/react-router';

import { envConfigs, getSiteUrl } from '@/config';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { DirectoryHome } from '@/blocks/directory-home';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { buildPageHead } from '@/blocks/seo';
import { getHomeData } from '@/content/games/server';

export const Route = createFileRoute('/')({
  loader: async () => {
    const locale = getLocale();
    const name = envConfigs.app_name;
    return {
      locale,
      title: m['dir.seo.home_title']({ name }, { locale }),
      description: m['dir.seo.home_description']({ name }, { locale }),
      data: await getHomeData(),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const site = getSiteUrl();
    return buildPageHead({
      path: '/',
      locale: loaderData.locale,
      title: loaderData.title,
      description: loaderData.description,
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${site}/#website`,
            name: envConfigs.app_name,
            url: site,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${site}/browse?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@type': 'ItemList',
            name: 'Trending games',
            itemListElement: loaderData.data.leaderboard.map((p, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: p.name,
              url: `${site}${p.href}`,
            })),
          },
        ],
      },
    });
  },
  component: HomePage,
});

function HomePage() {
  const { data } = Route.useLoaderData();
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <DirectoryHome data={data} />
      <Footer />
    </div>
  );
}
