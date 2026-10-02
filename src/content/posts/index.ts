import type { ComponentType } from 'react';

import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime.js';

/**
 * Local blog posts written as MDX files in this directory.
 * File naming: `<slug>.<locale>.mdx` (falls back to the base locale).
 * Register every local post slug here — it drives loading and the sitemap.
 *
 * This module is isomorphic (safe in client bundles). Database posts are
 * fetched through the server functions in ./server.ts and merged with the
 * local posts via the pure helpers below.
 */
export const BLOG_POST_SLUGS = [
  'best-scientific-illustration-tools',
  'figurelabs-alternatives',
  'alternativen-zu-figurelabs',
  'alternatives-a-figurelabs',
] as const;

export type BlogPostMeta = {
  title: string;
  description: string;
  created_at: string;
  author_name?: string;
  author_image?: string;
  image?: string;
  /**
   * Content language for a single-language post (e.g. 'de'). Such posts are
   * not translated per site locale: their canonical is the un-prefixed URL
   * and hreflang comes from `translations` instead of the site locales.
   * Store them under the base-locale filename (`<slug>.en.mdx`).
   */
  lang?: string;
  /** hreflang → slug of the same article in other languages (incl. itself). */
  translations?: Record<string, string>;
};

type PostModule = {
  default: ComponentType;
  meta: BlogPostMeta;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  image?: string;
  /** ISO date string — serializable across loader/server-fn boundaries */
  createdAt: string;
  authorName?: string;
  authorImage?: string;
  source: 'local' | 'db';
  lang?: string;
  translations?: Record<string, string>;
  /** Site locales that have their own file for this local post. */
  locales?: string[];
};

export type BlogPostDetail = BlogPost & {
  /** Raw markdown — set for database posts */
  content?: string;
};

// Eagerly bundle the local MDX posts (small markdown files), mirroring the
// static-pages pattern. Keys are absolute from the project root.
const postModules = import.meta.glob<PostModule>('/src/content/posts/*.mdx', {
  eager: true,
});

export function loadLocalPost(slug: string, locale: string): PostModule | null {
  if (!BLOG_POST_SLUGS.includes(slug as (typeof BLOG_POST_SLUGS)[number])) {
    return null;
  }
  return (
    postModules[`/src/content/posts/${slug}.${locale}.mdx`] ??
    postModules[`/src/content/posts/${slug}.${baseLocale}.mdx`] ??
    null
  );
}

function localPostToItem(slug: string, meta: BlogPostMeta): BlogPost {
  return {
    slug,
    title: meta.title,
    description: meta.description,
    image: meta.image,
    createdAt: new Date(meta.created_at).toISOString(),
    authorName: meta.author_name,
    authorImage: meta.author_image,
    source: 'local',
    lang: meta.lang,
    translations: meta.translations,
  };
}

/** Site locales that ship a dedicated MDX file for a local post. */
export function localPostLocales(slug: string): string[] {
  return locales.filter(
    (loc) => postModules[`/src/content/posts/${slug}.${loc}.mdx`]
  );
}

export function getLocalPosts(locale: string): BlogPost[] {
  return BLOG_POST_SLUGS.map((slug) => ({
    slug: slug as string,
    mod: loadLocalPost(slug, locale),
  }))
    .filter((m): m is { slug: string; mod: PostModule } => m.mod !== null)
    .map(({ slug, mod }) => localPostToItem(slug, mod.meta));
}

/**
 * Merge database posts with local MDX posts, deduped by slug
 * (database wins), newest first.
 */
export function mergePosts(
  dbPosts: BlogPost[],
  localPosts: BlogPost[],
  options: { limit?: number } = {}
): BlogPost[] {
  const dbSlugs = new Set(dbPosts.map((p) => p.slug));
  const merged = [
    ...dbPosts,
    ...localPosts.filter((p) => !dbSlugs.has(p.slug)),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return options.limit ? merged.slice(0, options.limit) : merged;
}

export function formatPostDate(dateIso: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: locale === 'zh' ? 'long' : 'short',
    day: 'numeric',
  }).format(new Date(dateIso));
}

export type PostAlternate = { hrefLang: string; href: string };

/**
 * Canonical URL + hreflang alternates for a post. Shared by the post page
 * head and the sitemap so both always advertise the same URL set:
 * - single-language posts (`lang`): un-prefixed URL, hreflang from
 *   `translations` (never the site locales — /zh/ would be a duplicate);
 * - local posts: only the site locales that ship their own MDX file;
 * - database posts: every site locale.
 */
export function postUrls(
  post: Pick<BlogPost, 'slug' | 'source' | 'lang' | 'translations' | 'locales'>,
  locale: string,
  origin: string
): { canonical: string; alternates: PostAlternate[] } {
  const urlFor = (slug: string, loc: string) =>
    localizeUrl(`${origin}/blog/${slug}`, {
      locale: loc as (typeof locales)[number],
    }).href;

  if (post.lang) {
    const translations = post.translations ?? { [post.lang]: post.slug };
    const alternates = Object.entries(translations).map(([hrefLang, slug]) => ({
      hrefLang,
      href: urlFor(slug, baseLocale),
    }));
    alternates.push({
      hrefLang: 'x-default',
      href: urlFor(translations.en ?? post.slug, baseLocale),
    });
    return { canonical: urlFor(post.slug, baseLocale), alternates };
  }

  const available =
    post.source === 'local' && post.locales?.length
      ? post.locales
      : [...locales];
  const canonicalLocale = available.includes(locale) ? locale : baseLocale;
  return {
    canonical: urlFor(post.slug, canonicalLocale),
    alternates: [
      ...available.map((loc) => ({
        hrefLang: loc,
        href: urlFor(post.slug, loc),
      })),
      { hrefLang: 'x-default', href: urlFor(post.slug, baseLocale) },
    ],
  };
}
