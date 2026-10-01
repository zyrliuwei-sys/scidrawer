/**
 * Data model for the game directory.
 *
 * - A `Product` is a game (or game tool) listed in the directory.
 * - A `KeywordPage` is a long-form guide page targeting one search keyword
 *   (e.g. "lumber tycoon 2 secret badge"), featuring its matching product.
 *
 * Content is static and isomorphic so pages render fully in SSR HTML.
 */

export type CategoryId =
  | 'roblox'
  | 'fortnite'
  | 'minecraft'
  | 'genshin'
  | 'pc-console'
  | 'indie'
  | 'tools';

export interface Category {
  id: CategoryId;
  name: string;
  emoji: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  /** One-line pitch shown on cards. */
  tagline: string;
  /** 2–3 sentence description shown on detail pages. */
  description: string;
  /** Official page / store page / play link. */
  url: string;
  /** Short label for the link button, e.g. "Play on Roblox". */
  cta: string;
  platform: string;
  category: CategoryId;
  tags: string[];
  /** Tailwind gradient classes for the generated logo tile. */
  color: string;
  /** Optional key facts rendered as a definition list. */
  facts?: Array<[label: string, value: string]>;
  featured?: boolean;
}

export type Block =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'steps'; items: string[] }
  | { type: 'note'; text: string };

export interface Section {
  heading: string;
  blocks: Block[];
}

export interface Faq {
  q: string;
  a: string;
}

export interface KeywordInput {
  /** The exact search keyword — used verbatim in H1, title and URL slug. */
  keyword: string;
  /** Product id from products.ts. */
  product: string;
  /** Meta description / card summary (~150 chars). */
  summary: string;
  /** Opening paragraph — should restate the keyword naturally. */
  intro: string;
  sections: Section[];
  faq: Faq[];
  /** Override the default `<Keyword> – <suffix>` title suffix. */
  titleSuffix?: string;
  updated?: string;
}

export interface KeywordPage extends KeywordInput {
  slug: string;
  category: CategoryId;
  /** Title-cased keyword used as the H1. */
  heading: string;
  title: string;
  updated: string;
}
