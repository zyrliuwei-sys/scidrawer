import { CATEGORIES, CATEGORY_MAP } from './categories';
import {
  FORTNITE_KEYWORDS,
  GENSHIN_KEYWORDS,
  MINECRAFT_KEYWORDS,
} from './keywords/franchises';
import { INDIE_KEYWORDS, OTHER_KEYWORDS } from './keywords/indie';
import { PC_KEYWORDS } from './keywords/pc';
import { ROBLOX_KEYWORDS } from './keywords/roblox';
import { PRODUCT_MAP, PRODUCTS } from './products';
import type { CategoryId, KeywordInput, KeywordPage, Product } from './types';

export * from './types';
export { CATEGORIES, CATEGORY_MAP, PRODUCT_MAP, PRODUCTS };

/** Content date for pages without an explicit `updated`. */
export const CONTENT_UPDATED = '2026-10-01';

/** "Luigi’s Pizza House" → "luigis-pizza-house" */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const SMALL_WORDS = new Set([
  'a',
  'an',
  'the',
  'to',
  'in',
  'of',
  'on',
  'and',
  'or',
  'for',
  'vs',
  'with',
  'ein',
]);
const UPPER_WORDS: Record<string, string> = {
  yba: 'YBA',
  gta: 'GTA',
  vi: 'VI',
  io: 'io',
  gg: 'GG',
  fut: 'FUT',
  wow: 'WoW',
  apk: 'APK',
  pdf: 'PDF',
};

/** Title-cases an all-lowercase keyword; keeps already-cased names intact. */
export function toHeading(keyword: string): string {
  if (keyword !== keyword.toLowerCase()) return keyword;
  return keyword
    .split(' ')
    .map((w, i) => {
      if (UPPER_WORDS[w]) return UPPER_WORDS[w];
      if (i > 0 && SMALL_WORDS.has(w)) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
}

/** Picks an intent-matching title suffix so the title answers the query. */
function defaultSuffix(k: string, category: CategoryId): string {
  if (/obby khan/.test(k)) return 'Who He Is (Not a Roblox Obby)';
  if (/\bcape\b/.test(k) && !/redeem/.test(k))
    return 'How to Get Every Cape (2026)';
  if (/sift/.test(k)) return 'New Dimension Explained (2027)';
  if (/fortnitemares|slenderman/.test(k)) return 'Collabs, Skins & Start Date';
  if (/globals/.test(k)) return 'Results, Winners & Prize Pool';
  if (/fanfest/.test(k)) return 'What Players Saw';
  if (/\bcodes?\b/.test(k) && !/redeem/.test(k))
    return 'Working Codes & How to Redeem';
  if (/redeem|reedem/.test(k)) return 'How to Redeem (2026 Guide)';
  if (/release date|countdown/.test(k)) return 'Release Date, Time & Platforms';
  if (/tier list/.test(k)) return 'Best Picks Ranked';
  if (category === 'roblox' && /secret|quest|badge|axe/.test(k))
    return 'Full Guide & Walkthrough';
  if (/puzzle/.test(k) && /control/.test(k)) return 'Solution & Location';
  if (/^how to/.test(k)) return 'Step-by-Step Guide';
  if (/^is .* down/.test(k)) return 'Status Check & Fixes';
  if (/wiki/.test(k)) return 'Wiki Guide & Key Facts';
  if (/steam/.test(k)) return 'Steam Price, Release & Reviews';
  if (/update/.test(k)) return 'Patch Notes & What Changed';
  if (/mod apk/.test(k)) return 'Risks & Safe Alternatives';
  if (/silver light|silverwing/.test(k)) return 'How to Get It in Version 7.1';
  if (category === 'genshin') return 'Genshin Impact Lore Explained';
  if (
    /gta|transport fever|ace combat|graveyard|dressmaker|witcher|control|silent hill/.test(
      k
    )
  )
    return 'Release Date, Platforms & Key Facts';
  if (/needle/.test(k)) return 'Every Game Compared';
  if (/^(lynx|lula|my 9|yoshi)/.test(k)) return 'What It Means';
  if (category === 'tools') return 'What It Is & How to Use It';
  return 'What It Is, How to Play & Where';
}

const ALL_INPUTS: KeywordInput[] = [
  ...ROBLOX_KEYWORDS,
  ...FORTNITE_KEYWORDS,
  ...MINECRAFT_KEYWORDS,
  ...GENSHIN_KEYWORDS,
  ...PC_KEYWORDS,
  ...INDIE_KEYWORDS,
  ...OTHER_KEYWORDS,
];

export const KEYWORD_PAGES: KeywordPage[] = ALL_INPUTS.map((input) => {
  const product = PRODUCT_MAP[input.product];
  if (!product) {
    throw new Error(
      `Unknown product "${input.product}" for "${input.keyword}"`
    );
  }
  const heading = toHeading(input.keyword);
  return {
    ...input,
    slug: slugify(input.keyword),
    category: product.category,
    heading,
    title: `${heading} – ${input.titleSuffix ?? defaultSuffix(input.keyword.toLowerCase(), product.category)}`,
    updated: input.updated ?? CONTENT_UPDATED,
  };
});

const PAGE_MAP = new Map(KEYWORD_PAGES.map((p) => [p.slug, p]));

if (PAGE_MAP.size !== KEYWORD_PAGES.length) {
  throw new Error('Duplicate keyword slugs in game directory content');
}

export function getKeywordPage(slug: string): KeywordPage | undefined {
  return PAGE_MAP.get(slug);
}

export function getProduct(id: string): Product | undefined {
  return PRODUCT_MAP[id];
}

export function pagesForProduct(productId: string): KeywordPage[] {
  return KEYWORD_PAGES.filter((p) => p.product === productId);
}

export function pagesForCategory(category: CategoryId): KeywordPage[] {
  return KEYWORD_PAGES.filter((p) => p.category === category);
}

export function productsForCategory(category: CategoryId): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

/** Same-product pages first, then same-category pages, excluding `page`. */
export function relatedPages(page: KeywordPage, limit = 8): KeywordPage[] {
  const sameProduct = KEYWORD_PAGES.filter(
    (p) => p.product === page.product && p.slug !== page.slug
  );
  const sameCategory = KEYWORD_PAGES.filter(
    (p) => p.category === page.category && p.product !== page.product
  );
  return [...sameProduct, ...sameCategory].slice(0, limit);
}

/** First keyword page for a product — its canonical "detail" page. */
export function primaryPageForProduct(
  productId: string
): KeywordPage | undefined {
  return KEYWORD_PAGES.find((p) => p.product === productId);
}

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);
