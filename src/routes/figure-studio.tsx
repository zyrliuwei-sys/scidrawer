import { createFileRoute } from '@tanstack/react-router';

import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { FigureStudio } from '@/blocks/figure-studio';

export const Route = createFileRoute('/figure-studio')({
  loader: () => {
    const locale = getLocale();
    return {
      title: m['figure_studio.seo.title']({}, { locale }),
      description: m['figure_studio.seo.description']({}, { locale }),
    };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: loaderData.title },
          { name: 'description', content: loaderData.description },
        ]
      : [],
  }),
  component: FigureStudio,
});
