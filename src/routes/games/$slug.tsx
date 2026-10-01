import { createFileRoute, notFound } from '@tanstack/react-router';

import { envConfigs, getSiteUrl } from '@/config';
import { getLocale } from '@/paraglide/runtime.js';
import { Footer } from '@/blocks/footer';
import { GameDetail } from '@/blocks/game-detail';
import { Header } from '@/blocks/header';
import { absoluteUrl, buildPageHead } from '@/blocks/seo';
import { getGamePageData } from '@/content/games/server';

export const Route = createFileRoute('/games/$slug')({
  loader: async ({ params }) => {
    const data = await getGamePageData({ data: params.slug });
    if (!data) throw notFound();
    return { locale: getLocale(), data };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { page, product, category } = loaderData.data;
    const url = absoluteUrl(`/games/${page.slug}`);
    const site = getSiteUrl();
    return buildPageHead({
      path: `/games/${page.slug}`,
      locale: loaderData.locale,
      title: page.title,
      description: page.summary,
      englishOnly: true,
      type: 'article',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            '@id': `${url}#article`,
            headline: page.heading,
            description: page.summary,
            keywords: page.keyword,
            inLanguage: 'en',
            dateModified: page.updated,
            datePublished: page.updated,
            mainEntityOfPage: url,
            about: { '@type': 'Thing', name: product.name, url: product.url },
            publisher: {
              '@type': 'Organization',
              name: envConfigs.app_name,
              logo: `${site}/logo.svg`,
            },
          },
          {
            '@type': 'FAQPage',
            mainEntity: page.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: site },
              {
                '@type': 'ListItem',
                position: 2,
                name: category.name,
                item: absoluteUrl(`/category/${category.id}`),
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: page.heading,
                item: url,
              },
            ],
          },
        ],
      },
    });
  },
  component: GamePage,
});

function GamePage() {
  const { data } = Route.useLoaderData();
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <GameDetail data={data} />
      <Footer />
    </div>
  );
}
