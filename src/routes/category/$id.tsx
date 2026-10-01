import { createFileRoute, notFound } from '@tanstack/react-router';

import { envConfigs } from '@/config';
import { m } from '@/paraglide/messages.js';
import { getLocale } from '@/paraglide/runtime.js';
import { CategoryPage } from '@/blocks/category-page';
import { Footer } from '@/blocks/footer';
import { Header } from '@/blocks/header';
import { buildPageHead } from '@/blocks/seo';
import { getCategoryData } from '@/content/games/server';

export const Route = createFileRoute('/category/$id')({
  loader: async ({ params }) => {
    const data = await getCategoryData({ data: params.id });
    if (!data) throw notFound();
    const locale = getLocale();
    return {
      locale,
      title: `${m['dir.category.title']({ name: data.category.name }, { locale })} – ${envConfigs.app_name}`,
      data,
    };
  },
  head: ({ loaderData }) =>
    loaderData
      ? buildPageHead({
          path: `/category/${loaderData.data.category.id}`,
          locale: loaderData.locale,
          title: loaderData.title,
          description: loaderData.data.category.description,
        })
      : {},
  component: CategoryRoute,
});

function CategoryRoute() {
  const { data } = Route.useLoaderData();
  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <Header />
      <CategoryPage {...data} />
      <Footer />
    </div>
  );
}
