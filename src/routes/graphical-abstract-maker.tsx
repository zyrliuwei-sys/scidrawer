import { createFileRoute } from '@tanstack/react-router';

import { getSiteUrl } from '@/config';
import { getLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { SeoContentPage } from '@/components/seo-content-page';
import {
  buildSeoPageJsonLd,
  getSeoPageContent,
  type SeoLocale,
} from '@/content/seo-pages';

const PATH = '/graphical-abstract-maker';

export const Route = createFileRoute('/graphical-abstract-maker')({
  loader: () => {
    const locale = getLocale() as SeoLocale;
    return {
      locale,
      content: getSeoPageContent('graphical-abstract-maker', locale),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const urlFor = (locale: string) =>
      localizeUrl(`${getSiteUrl()}${PATH}`, {
        locale: locale as (typeof locales)[number],
      }).href;
    const canonical = urlFor(loaderData.locale);
    const content = loaderData.content;
    return {
      meta: [
        { title: content.title },
        { name: 'description', content: content.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'SciDrawer' },
        { property: 'og:title', content: content.title },
        { property: 'og:description', content: content.description },
        { property: 'og:url', content: canonical },
        { property: 'og:image', content: `${getSiteUrl()}/imgs/og.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: content.title },
        { name: 'twitter:description', content: content.description },
        { name: 'twitter:image', content: `${getSiteUrl()}/imgs/og.png` },
      ],
      links: [
        { rel: 'canonical', href: canonical },
        ...locales.map((locale) => ({
          rel: 'alternate',
          hrefLang: locale,
          href: urlFor(locale),
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: urlFor('en') },
      ],
      scripts: [
        {
          type: 'application/ld+json',
          children: JSON.stringify(
            buildSeoPageJsonLd(content, canonical, getSiteUrl())
          ),
        },
      ],
    };
  },
  component: GraphicalAbstractMakerPage,
});

function GraphicalAbstractMakerPage() {
  const { content } = Route.useLoaderData();
  return <SeoContentPage content={content} />;
}
