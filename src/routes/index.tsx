import { createFileRoute } from '@tanstack/react-router';

import { buildHomeHead, HomeContent, homeLoader } from '@/blocks/home-content';

export const Route = createFileRoute('/')({
  // Resolved server-side so crawlers get the localized strings in the SSR HTML
  // rather than after hydration.
  loader: homeLoader,
  head: ({ loaderData }) => buildHomeHead(loaderData, { canonicalPath: '/' }),
  component: HomeContent,
});
