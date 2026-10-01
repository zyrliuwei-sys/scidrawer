import { createServerFn } from '@tanstack/react-start';

import type { ProductCardData } from '@/components/directory/product-card';

import type { Category, CategoryId, KeywordPage, Product } from './types';

// The directory content (~120 long-form pages) is loaded through server
// functions with a dynamic import, so it never ships in the client bundle.
const loadContent = () => import('./index');

export interface GuideLite {
  slug: string;
  heading: string;
  summary: string;
  categoryName: string;
}

type Content = Awaited<ReturnType<typeof loadContent>>;

function toCard(c: Content, product: Product): ProductCardData {
  const page = c.primaryPageForProduct(product.id);
  return {
    name: product.name,
    tagline: product.tagline,
    color: product.color,
    platform: product.platform,
    tags: product.tags,
    href: page ? `/games/${page.slug}` : `/category/${product.category}`,
    url: product.url,
    featured: product.featured,
  };
}

function toGuide(c: Content, page: KeywordPage): GuideLite {
  return {
    slug: page.slug,
    heading: page.heading,
    summary: page.summary,
    categoryName: c.CATEGORY_MAP[page.category].name,
  };
}

/** Trending order: hand-picked heads of each franchise, then the rest. */
const TRENDING = [
  'control-resonant-taxi',
  'wuwa-3-7',
  'ride-a-pet-volcano',
  'ea-fc-27-lite',
  'aion-2-classes',
  'burger-king-fc-27',
  'rockstar-games-gta-vi',
  'lumber-tycoon-2-secret-badge',
  'minecraft-the-sift',
  'fortnitemares-2026',
  'ace-combat-8-release-date',
  'anime-dice',
  'silver-light-genshin',
  'dressmaker',
  'minecraft-cape-redeem',
  'deadlock-update',
  'ball-vs-ball-codes',
  'the-witcher-3-remastered-release-date',
  'laundry-puzzle-control-resonant',
  'minecraft-dungeons-2-release-date',
  'oil-tycoon-roblox-secrets',
  'rhinedottir',
  'blue-lock-farm',
  'transport-fever-3',
  'silent-hill-townfall',
  'needle-in-a-haystack',
  'build-and-kill-zombies',
  'fortnite-globals',
  'graveyard-keeper-2',
  'slenderman-fortnite',
];

export const getHomeData = createServerFn().handler(async () => {
  const c = await loadContent();
  const spotlight = c.PRODUCT_MAP['gta-vi']!;
  const spotlightPage = c.primaryPageForProduct('gta-vi')!;
  return {
    stats: {
      guides: c.KEYWORD_PAGES.length,
      games: c.PRODUCTS.length,
      categories: c.CATEGORIES.length,
    },
    spotlight: {
      ...toCard(c, spotlight),
      description: spotlight.description,
      facts: spotlight.facts ?? [],
      href: `/games/${spotlightPage.slug}`,
    },
    trending: TRENDING.map((slug) => c.getKeywordPage(slug))
      .filter((p): p is KeywordPage => Boolean(p))
      .map((p) => ({ slug: p.slug, heading: p.heading })),
    leaderboard: c.FEATURED_PRODUCTS.slice(0, 10).map((p) => toCard(c, p)),
    categories: c.CATEGORIES.map((cat) => ({
      ...cat,
      games: c.productsForCategory(cat.id).length,
      guides: c.pagesForCategory(cat.id).length,
    })),
    sections: c.CATEGORIES.filter((cat) => cat.id !== 'tools').map((cat) => ({
      category: cat,
      products: c
        .productsForCategory(cat.id)
        .slice(0, 6)
        .map((p) => toCard(c, p)),
    })),
    latest: c.KEYWORD_PAGES.filter((p) => !TRENDING.includes(p.slug))
      .slice(0, 9)
      .map((p) => toGuide(c, p)),
  };
});

export type HomeData = Awaited<ReturnType<typeof getHomeData>>;

export const getGamePageData = createServerFn()
  .inputValidator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const c = await loadContent();
    const page = c.getKeywordPage(slug);
    if (!page) return null;
    const product = c.PRODUCT_MAP[page.product]!;
    const category: Category = c.CATEGORY_MAP[page.category];
    return {
      page,
      product,
      productCard: toCard(c, product),
      category,
      related: c.relatedPages(page, 10).map((p) => ({
        slug: p.slug,
        heading: p.heading,
      })),
      more: c
        .productsForCategory(page.category)
        .filter((p) => p.id !== product.id)
        .slice(0, 6)
        .map((p) => toCard(c, p)),
    };
  });

export type GamePageData = NonNullable<
  Awaited<ReturnType<typeof getGamePageData>>
>;

export const getBrowseData = createServerFn().handler(async () => {
  const c = await loadContent();
  return {
    categories: c.CATEGORIES,
    guides: c.KEYWORD_PAGES.map((p) => ({
      ...toGuide(c, p),
      category: p.category,
      productName: c.PRODUCT_MAP[p.product]!.name,
    })),
  };
});

export const getCategoryData = createServerFn()
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    const c = await loadContent();
    const category = c.CATEGORY_MAP[id as CategoryId];
    if (!category) return null;
    return {
      category,
      products: c.productsForCategory(category.id).map((p) => toCard(c, p)),
      guides: c.pagesForCategory(category.id).map((p) => toGuide(c, p)),
    };
  });
