import { envConfigs, getSiteUrl } from '@/config';
import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime.js';

type Locale = (typeof locales)[number];

export function absoluteUrl(path: string, locale: string = baseLocale): string {
  return localizeUrl(`${getSiteUrl()}${path || '/'}`, {
    locale: locale as Locale,
  }).href;
}

/**
 * Head tags for a directory page.
 *
 * `englishOnly` pages (keyword guides) carry English body copy under every
 * locale prefix, so they canonicalize to the base-locale URL and skip hreflang
 * alternates to avoid duplicate-content signals.
 */
export function buildPageHead({
  path,
  locale,
  title,
  description,
  englishOnly = false,
  type = 'website',
  jsonLd,
}: {
  path: string;
  locale: string;
  title: string;
  description: string;
  englishOnly?: boolean;
  type?: 'website' | 'article';
  jsonLd?: object;
}) {
  const canonical = absoluteUrl(path, englishOnly ? baseLocale : locale);
  const ogImage = `${getSiteUrl()}/imgs/og.png`;
  return {
    meta: [
      { title },
      { name: 'description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: envConfigs.app_name },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: ogImage },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ],
    links: [
      { rel: 'canonical', href: canonical },
      ...(englishOnly
        ? []
        : [
            ...locales.map((loc) => ({
              rel: 'alternate',
              hrefLang: loc,
              href: absoluteUrl(path, loc),
            })),
            {
              rel: 'alternate',
              hrefLang: 'x-default',
              href: absoluteUrl(path, baseLocale),
            },
          ]),
    ],
    scripts: jsonLd
      ? [{ type: 'application/ld+json', children: JSON.stringify(jsonLd) }]
      : [],
  };
}
