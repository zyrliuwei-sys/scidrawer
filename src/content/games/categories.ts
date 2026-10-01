import type { Category, CategoryId } from './types';

/** Small, client-safe module — header/footer import this directly. */
export const CATEGORIES: Category[] = [
  {
    id: 'roblox',
    name: 'Roblox',
    emoji: '🧱',
    description:
      'Trending Roblox experiences — codes, secret badges, tier lists and hidden quests.',
  },
  {
    id: 'fortnite',
    name: 'Fortnite',
    emoji: '🎯',
    description:
      'Fortnite events, collabs and competitive news, from Fortnitemares to the Global Championship.',
  },
  {
    id: 'minecraft',
    name: 'Minecraft',
    emoji: '⛏️',
    description:
      'Minecraft capes, redeem codes, new dimensions and the Minecraft Dungeons II launch.',
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    emoji: '✨',
    description:
      'Genshin Impact lore, characters, events and weapons explained for the latest version.',
  },
  {
    id: 'pc-console',
    name: 'PC & Console',
    emoji: '🎮',
    description:
      'Big releases on Steam, PlayStation and Xbox — release dates, early access and puzzle solutions.',
  },
  {
    id: 'indie',
    name: 'New & Indie',
    emoji: '🌱',
    description:
      'Fresh browser, mobile and indie games worth a click — puzzles, sorters, racers and cozy sims.',
  },
  {
    id: 'tools',
    name: 'Tools & Trackers',
    emoji: '🧰',
    description:
      'Game databases, randomizers, status checkers and other handy utilities players search for.',
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c])
) as Record<CategoryId, Category>;
