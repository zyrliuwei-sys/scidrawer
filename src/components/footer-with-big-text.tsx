import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';

/**
 * Off-site URLs render as plain <a>; internal paths use the locale-aware Link.
 * `mailto:` / `tel:` must be excluded — the locale-aware Link would rewrite
 * them into `/zh/mailto:...`.
 */
const isExternalHref = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
  /** Use an explicit native anchor for static SEO links. */
  native?: boolean;
}

export interface FooterLinkColumn {
  title: string;
  links: FooterLink[];
}

const SUPPORT_EMAIL = 'zyrliuwei@gmail.com';

export function FooterWithBigText() {
  const year = new Date().getFullYear();

  const columns: FooterLinkColumn[] = [
    {
      title: m['landing.footer.product'](),
      links: [
        { label: m['landing.footer.features'](), href: '/#features' },
        { label: m['landing.footer.how_it_works'](), href: '/#how-it-works' },
        { label: m['landing.footer.pricing'](), href: '/pricing' },
      ],
    },
    {
      title: m['landing.footer.resources'](),
      links: [
        { label: m['landing.footer.faq'](), href: '/#faq' },
        {
          label: m['landing.footer.contact'](),
          href: `mailto:${SUPPORT_EMAIL}`,
          external: true,
        },
      ],
    },
    {
      title: m['landing.footer.legal'](),
      links: [
        { label: m['landing.footer.privacy'](), href: '/privacy-policy' },
        { label: m['landing.footer.terms'](), href: '/terms-of-service' },
      ],
    },
    {
      title: m['landing.footer.popular_pages'](),
      links: [
        {
          label: m['landing.footer.popular.plant_cell'](),
          href: '/plant-cell-labeled',
          native: true,
        },
        {
          label: m['landing.footer.popular.graphical_abstract'](),
          href: '/graphical-abstract-maker',
          native: true,
        },
        {
          label: m['landing.footer.popular.scientific_diagram'](),
          href: '/scientific-diagram-maker',
          native: true,
        },
        {
          label: m['landing.footer.popular.pricing'](),
          href: '/pricing',
          native: true,
        },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-neutral-950 px-4 pt-14 pb-4 text-neutral-100 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
          {columns.map((col) => (
            <div key={col.title} className="col-span-1 lg:col-span-2">
              <h3 className="text-sm font-semibold text-neutral-100">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {isExternalHref(link.href) || link.native ? (
                      <a
                        href={link.href}
                        className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Brand area becomes the visual counterweight to the link columns. */}
          <div className="col-span-2 border-t border-neutral-800 pt-8 sm:col-span-3 lg:col-span-4 lg:col-start-9 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <span className="text-lg font-bold text-neutral-100">
              SciDrawer AI
            </span>
            <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-400">
              {m['landing.footer.brand_description']()}
            </p>
            <a
              href="https://www.agenthunter.io?utm_source=badge&utm_medium=embed&utm_campaign=scidrawer%20ai"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 font-sans no-underline transition-all duration-200 hover:border-gray-500 hover:bg-gray-800"
            >
              <img
                src="https://www.agenthunter.io/logo-dark.svg"
                alt="AgentHunter Badge"
                className="size-10"
              />
              <span className="flex flex-col">
                <span className="text-xs text-gray-400">AgentHunter</span>
                <span className="text-sm font-semibold text-gray-50">
                  Featured AI Agent
                </span>
              </span>
            </a>
            <a
              href="https://aiagentsdirectory.com/agent/scidrawer-ai"
              target="_blank"
              rel="noopener"
              title="Discover SciDrawer AI on AI Agents Directory"
              className="mt-4 block w-fit"
            >
              <img
                src="https://aiagentsdirectory.com/featured-badge.svg?v=2024"
                alt="SciDrawer AI - Featured on AI Agents Directory"
                width={200}
                height={50}
              />
            </a>
            <a
              href="https://toolbit.ai/ai-tool/scidrawer-com?ref=embed"
              target="_blank"
              rel="noopener noreferrer"
              data-tb-secret="0e74bd9e85bb53116ed0cd60803434592a4fa9d136d069f5"
              className="mt-4 block w-fit"
            >
              <img
                src="https://cdn.toolbit.ai/external-share-img/dark-featured.svg"
                alt="Featured on ToolBit.ai - Scidrawer AI"
                width={250}
                height={76}
                className="block h-[76px] w-[250px]"
              />
            </a>
            <a
              href="https://fazier.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-fit"
            >
              <img
                src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=dark"
                alt="Fazier badge"
                width={250}
                className="block w-[250px]"
              />
            </a>
            <a
              href="https://startupfa.me/s/scidrawer.com-748?utm_source=www.scidrawer.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-fit"
            >
              <img
                src="https://startupfa.me/badges/featured-badge.webp"
                alt="SciDrawer AI - Featured on Startup Fame"
                width={171}
                height={54}
                className="block h-[54px] w-[171px]"
              />
            </a>
            <a
              href="https://turbo0.com/item/scidrawer"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-fit"
            >
              <img
                src="https://img.turbo0.com/badge-listed-light.svg"
                alt="Listed on Turbo0"
                height={54}
                className="block h-[54px] w-auto"
              />
            </a>
            <a
              href="https://toolrain.com/item/scidrawer-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-fit"
            >
              <img
                src="https://toolrain.com/badges/badge-listed-dark.svg"
                alt="Listed on ToolRain"
                height={60}
                className="block h-[60px] w-auto"
              />
            </a>
            <a
              href="https://auraplusplus.com/projects/scidrawer-ai"
              target="_blank"
              rel="noopener"
              title="View this project on Aura++"
              className="mt-4 block w-fit"
            >
              <img
                src="https://auraplusplus.com/images/badges/featured-on-dark.svg"
                alt="Featured on Aura++"
                width={265}
                height={58}
                className="block h-[58px] w-[265px]"
              />
            </a>
            <a
              href="https://bestsky.tools?utm_source=badge"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 block w-fit"
            >
              <img
                src="https://assets.bestsky.tools/badges/featured-light.svg"
                alt="Featured on BestskyTools"
                width={150}
                className="block w-[150px]"
              />
            </a>
          </div>
        </div>

        <div className="mt-14 border-t border-neutral-800 pt-6">
          <p className="text-center text-sm text-neutral-400">
            © {year} SciDrawer AI. All rights reserved.
          </p>
        </div>
      </div>

      {/* Signature big brand text — spans the full footer width, aligned with the footer edges */}
      <div className="pointer-events-none relative -mb-[3%] flex items-center justify-center overflow-hidden text-center text-[3rem] leading-none font-bold text-neutral-900 duration-200 ease-in-out sm:-mb-[2%] sm:text-[7rem] md:text-[5.5rem] lg:text-[7rem] xl:text-[10rem]">
        <div className="animate-[pulse_4s_infinite] bg-gradient-to-b from-neutral-700 to-neutral-900 bg-clip-text text-transparent drop-shadow-xl drop-shadow-white/5">
          SciDrawer AI
        </div>
        <div className="absolute bottom-0 left-0 z-20 h-[15%] w-full bg-gradient-to-b from-transparent via-neutral-950 to-neutral-950" />
      </div>
    </footer>
  );
}
