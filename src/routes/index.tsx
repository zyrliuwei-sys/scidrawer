import { createFileRoute } from '@tanstack/react-router';

import { tDynamic } from '@/core/i18n/dynamic';
import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { getLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import { CTA } from '@/blocks/cta';
import { FAQ, FAQ_KEYS } from '@/blocks/faq';
import { Features } from '@/blocks/features';
import { FigureLibrarySection } from '@/blocks/figure-library';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { Hero } from '@/blocks/hero';
import { HowItWorks } from '@/blocks/how-it-works';
import { Pricing } from '@/blocks/pricing';

function HomePage() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <FigureLibrarySection />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute('/')({
  // Resolved server-side so crawlers get the localized strings in the SSR HTML
  // rather than after hydration.
  loader: () => {
    const locale = getLocale();
    const opts = { locale: locale as (typeof locales)[number] };
    return {
      locale,
      title: m['landing.seo.title']({}, opts),
      description: m['landing.seo.description']({}, opts),
      ogAlt: m['landing.seo.og_alt']({}, opts),
      // Reuses the same keys the FAQ accordion renders, so the FAQPage markup
      // can never claim a Q&A that isn't visible on the page.
      faq: FAQ_KEYS.map((key) => ({
        question: tDynamic(`landing.faq.${key}.question`, opts),
        answer: tDynamic(`landing.faq.${key}.answer`, opts),
      })),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { locale, title, description, ogAlt, faq } = loaderData;

    const urlFor = (loc: string) =>
      localizeUrl(`${envConfigs.app_url}/`, {
        locale: loc as (typeof locales)[number],
      }).href;
    const canonical = urlFor(locale);
    const ogImage = `${envConfigs.app_url}/imgs/og.png`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${envConfigs.app_url}/#organization`,
          name: envConfigs.app_name,
          url: envConfigs.app_url,
          logo: `${envConfigs.app_url}/logo.svg`,
        },
        {
          '@type': 'SoftwareApplication',
          '@id': `${envConfigs.app_url}/#software`,
          name: envConfigs.app_name,
          url: canonical,
          description,
          applicationCategory: 'DesignApplication',
          operatingSystem: 'Web',
          inLanguage: locales,
          publisher: { '@id': `${envConfigs.app_url}/#organization` },
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'USD',
            lowPrice: '9',
            highPrice: '48',
            offerCount: 3,
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${envConfigs.app_url}/#faq`,
          mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        },
      ],
    };

    return {
      meta: [
        { title },
        { name: 'description', content: description },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: envConfigs.app_name },
        { property: 'og:locale', content: locale === 'zh' ? 'zh_CN' : 'en_US' },
        { property: 'og:title', content: title },
        { property: 'og:description', content: description },
        { property: 'og:url', content: canonical },
        { property: 'og:image', content: ogImage },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: ogAlt },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: ogImage },
        { name: 'twitter:image:alt', content: ogAlt },
      ],
      links: [
        { rel: 'canonical', href: canonical },
        ...locales.map((loc) => ({
          rel: 'alternate',
          hrefLang: loc,
          href: urlFor(loc),
        })),
        { rel: 'alternate', hrefLang: 'x-default', href: urlFor('en') },
      ],
      scripts: [
        { type: 'application/ld+json', children: JSON.stringify(jsonLd) },
      ],
    };
  },
  component: HomePage,
});
