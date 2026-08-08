import { createFileRoute } from '@tanstack/react-router';

import { buildHomeHead, HomeContent, homeLoader } from '@/blocks/home-content';

/**
 * Vanity URL that exposes the keyword "scientific diagram maker" in the path
 * for on-page SEO audits. Renders the same homepage content; the canonical
 * link still points at "/" so we don't duplicate content across two URLs.
 */
export const Route = createFileRoute('/scientific-diagram-maker')({
  loader: homeLoader,
  head: ({ loaderData }) =>
    buildHomeHead(loaderData, { canonicalPath: '/scientific-diagram-maker' }),
  component: HomeContent,
});
