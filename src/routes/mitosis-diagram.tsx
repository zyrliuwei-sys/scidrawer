import { createFileRoute } from '@tanstack/react-router';

import { getSiteUrl } from '@/config';
import { getLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { SeoContentPage } from '@/components/seo-content-page';
import { buildSeoPageJsonLd } from '@/content/seo-pages';
import { getTemplatePageContent } from '@/content/seo-template-pages';

const PATH = '/mitosis-diagram';

export const Route = createFileRoute('/mitosis-diagram')({
  loader: () => {
    const locale = getLocale() === 'zh' ? 'zh' : 'en';
    return {
      locale,
      content: getTemplatePageContent('mitosis-diagram', locale),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const urlFor = (locale: string) =>
      localizeUrl(`${getSiteUrl()}${PATH}`, {
        locale: locale as (typeof locales)[number],
      }).href;
    const canonical = urlFor(loaderData.locale);
    return {
      meta: [
        { title: loaderData.content.title },
        { name: 'description', content: loaderData.content.description },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: canonical },
        { property: 'og:title', content: loaderData.content.title },
        { property: 'og:description', content: loaderData.content.description },
        { property: 'og:image', content: `${getSiteUrl()}/imgs/og.png` },
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
            buildSeoPageJsonLd(loaderData.content, canonical, getSiteUrl())
          ),
        },
      ],
    };
  },
  component: MitosisDiagramPage,
});

function MitosisDiagramPage() {
  return <SeoContentPage content={Route.useLoaderData().content} />;
}
