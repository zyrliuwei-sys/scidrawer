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
import { UseCases } from '@/blocks/use-cases';

export function HomeContent() {
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <main>
        <Hero />
        <Features />
        <UseCases />
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

/**
 * Shared loader for the homepage and its keyword vanity URL
 * (/scientific-diagram-maker). Both routes render the same content; the
 * vanity URL exists so on-page SEO audits can see the keyword in the path.
 */
export function homeLoader({ request }: { request: Request }) {
  const locale = getLocale();
  const opts = { locale: locale as (typeof locales)[number] };
  // Capture the request origin so canonical/og:url match the actual host —
  // VITE_APP_URL is often localhost in dev, falling back to envConfigs.app_url
  // would otherwise point canonical at http://localhost:3000. On Vercel,
  // VERCEL_PROJECT_PRODUCTION_URL is the production domain — prefer it for
  // canonical so previews don't leak their URLs into the sitemap.
  const vercelProductionUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    (process.env.VERCEL_ENV === 'production'
      ? process.env.VERCEL_URL
      : undefined);
  const productionOrigin = vercelProductionUrl
    ? `https://${vercelProductionUrl}`
    : undefined;
  const origin = (() => {
    try {
      const parsed = new URL(request.url).origin;
      // Ignore localhost in non-dev environments — fall back to production.
      if (parsed.hostname === 'localhost' && productionOrigin) {
        return productionOrigin;
      }
      return parsed;
    } catch {
      return productionOrigin ?? envConfigs.app_url;
    }
  })();
  return {
    locale,
    origin,
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
}

/**
 * Builds the head meta for the homepage / vanity URL. `canonicalPath` lets
 * the vanity URL point its canonical at `/` so we don't duplicate content
 * across two URLs (a single canonical, not two).
 */
export function buildHomeHead(
  loaderData: ReturnType<typeof homeLoader> | undefined,
  options: { canonicalPath: string } = { canonicalPath: '/' }
) {
  if (!loaderData) return {};
  const { locale, origin, title, description, ogAlt, faq } = loaderData;
  const baseUrl = origin || envConfigs.app_url;

  const urlFor = (loc: string) =>
    localizeUrl(`${baseUrl}${options.canonicalPath}`, {
      locale: loc as (typeof locales)[number],
    }).href;
  const canonical = urlFor(locale);
  const ogImage = `${baseUrl}/imgs/og.png`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: envConfigs.app_name,
        url: baseUrl,
        logo: `${baseUrl}/logo.svg`,
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${baseUrl}/#software`,
        name: envConfigs.app_name,
        url: canonical,
        description,
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        inLanguage: locales,
        publisher: { '@id': `${baseUrl}/#organization` },
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
        '@id': `${baseUrl}/#faq`,
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
}
