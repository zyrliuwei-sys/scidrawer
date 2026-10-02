import { createFileRoute } from '@tanstack/react-router';

import { getSiteUrl } from '@/config';
import { baseLocale, locales, localizeUrl } from '@/paraglide/runtime.js';
import {
  getLocalPosts,
  localPostLocales,
  mergePosts,
  postUrls,
  type BlogPost,
  type PostAlternate,
} from '@/content/posts';

const STATIC_PATHS = [
  '',
  '/pricing',
  '/blog',
  '/templates',
  '/generate',
  '/graphical-abstract-maker',
  '/scientific-poster-maker',
  '/scientific-diagram-maker',
  '/cell-membrane-diagram',
  '/mitosis-diagram',
  '/neuron-labeled',
  '/plant-cell-labeled',
  '/privacy-policy',
  '/terms-of-service',
];

// Update this value when public SEO content changes. Keeping it explicit makes
// the sitemap signal the content deployment date instead of changing on every
// request.
const SEO_LAST_MODIFIED = '2026-10-02';

type Entry = {
  path: string;
  lastModified?: string;
  changeFrequency: string;
  priority: number;
  /** Explicit URL set (blog posts); static paths use every site locale. */
  urls?: { loc: string; alternates: PostAlternate[] };
};

function urlFor(path: string, locale: string, origin: string): string {
  return localizeUrl(`${origin}${path || '/'}`, {
    locale: locale as (typeof locales)[number],
  }).href;
}

function entryXml(e: Entry, origin: string): string {
  const loc = e.urls?.loc ?? urlFor(e.path, baseLocale, origin);
  const alternates =
    e.urls?.alternates ??
    locales.map((l) => ({ hrefLang: l, href: urlFor(e.path, l, origin) }));
  return [
    '  <url>',
    `    <loc>${loc}</loc>`,
    ...alternates.map(
      (alt) =>
        `    <xhtml:link rel="alternate" hreflang="${alt.hrefLang}" href="${alt.href}"/>`
    ),
    e.lastModified ? `    <lastmod>${e.lastModified}</lastmod>` : null,
    `    <changefreq>${e.changeFrequency}</changefreq>`,
    `    <priority>${e.priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

function postEntry(post: BlogPost, origin: string): Entry {
  const { canonical, alternates } = postUrls(
    {
      ...post,
      locales:
        post.source === 'local' ? localPostLocales(post.slug) : undefined,
    },
    baseLocale,
    origin
  );
  return {
    path: `/blog/${post.slug}`,
    lastModified: post.createdAt,
    changeFrequency: 'monthly',
    priority: 0.7,
    urls: { loc: canonical, alternates },
  };
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const origin = getSiteUrl();
        const entries: Entry[] = STATIC_PATHS.map((path) => ({
          path,
          lastModified: SEO_LAST_MODIFIED,
          changeFrequency: path === '/blog' ? 'daily' : 'weekly',
          priority: path === '' ? 1 : 0.8,
        }));

        // Blog posts: db posts merged with local MDX posts.
        try {
          const { listPublishedArticles } =
            await import('@/modules/posts/service');
          const rows = await listPublishedArticles().catch(() => []);
          const dbPosts = rows.map((row) => ({
            slug: row.slug,
            title: row.title || row.slug,
            description: row.description || '',
            createdAt: new Date(row.createdAt).toISOString(),
            source: 'db' as const,
          }));
          const posts = mergePosts(dbPosts, getLocalPosts(baseLocale));
          for (const post of posts) entries.push(postEntry(post, origin));
        } catch {
          // Database unreachable — static paths + local posts still listed.
          for (const post of getLocalPosts(baseLocale)) {
            entries.push(postEntry(post, origin));
          }
        }

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
          ...entries.map((entry) => entryXml(entry, origin)),
          '</urlset>',
          '',
        ].join('\n');

        return new Response(xml, {
          headers: { 'Content-Type': 'application/xml' },
        });
      },
    },
  },
});
