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

type FeaturedBadge = {
  id: string;
  href: string;
  src?: string;
  alt: string;
};

const FEATURED_BADGES: FeaturedBadge[] = [
  {
    id: 'agenthunter',
    href: 'https://www.agenthunter.io?utm_source=badge&utm_medium=embed&utm_campaign=scidrawer%20ai',
    alt: 'AgentHunter Featured AI Agent',
  },
  {
    id: 'ai-agents-directory',
    href: 'https://aiagentsdirectory.com/agent/scidrawer-ai',
    src: 'https://aiagentsdirectory.com/featured-badge.svg?v=2024',
    alt: 'SciDrawer AI featured on AI Agents Directory',
  },
  {
    id: 'toolbit',
    href: 'https://toolbit.ai/ai-tool/scidrawer-com?ref=embed',
    src: 'https://cdn.toolbit.ai/external-share-img/dark-featured.svg',
    alt: 'SciDrawer AI featured on ToolBit.ai',
  },
  {
    id: 'fazier',
    href: 'https://fazier.com',
    src: 'https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=dark',
    alt: 'SciDrawer AI featured on Fazier',
  },
  {
    id: 'startup-fame',
    href: 'https://startupfa.me/s/scidrawer.com-748?utm_source=www.scidrawer.com',
    src: 'https://startupfa.me/badges/featured-badge.webp',
    alt: 'SciDrawer AI featured on Startup Fame',
  },
  {
    id: 'turbo0',
    href: 'https://turbo0.com/item/scidrawer',
    src: 'https://img.turbo0.com/badge-listed-light.svg',
    alt: 'SciDrawer AI listed on Turbo0',
  },
  {
    id: 'toolrain',
    href: 'https://toolrain.com/item/scidrawer-ai',
    src: 'https://toolrain.com/badges/badge-listed-dark.svg',
    alt: 'SciDrawer AI listed on ToolRain',
  },
  {
    id: 'auraplusplus',
    href: 'https://auraplusplus.com/projects/scidrawer-ai',
    src: 'https://auraplusplus.com/images/badges/featured-on-dark.svg',
    alt: 'SciDrawer AI featured on Aura++',
  },
  {
    id: 'bestsky-tools',
    href: 'https://bestsky.tools?utm_source=badge',
    src: 'https://assets.bestsky.tools/badges/featured-light.svg',
    alt: 'SciDrawer AI featured on BestskyTools',
  },
  {
    id: 'dofollow-tools',
    href: 'https://dofollow.tools',
    src: 'https://dofollow.tools/badge/badge_dark.svg',
    alt: 'SciDrawer AI featured on Dofollow.Tools',
  },
  {
    id: 'wired-business',
    href: 'https://wired.business',
    src: 'https://wired.business/badge0-dark.svg',
    alt: 'SciDrawer AI featured on Wired Business',
  },
  {
    id: 'good-ai-tools',
    href: 'https://goodaitools.com/ai/scidrawer',
    src: 'https://goodaitools.com/assets/images/badge-dark.png',
    alt: 'SciDrawer AI featured on Good AI Tools',
  },
  {
    id: 'domainrank',
    href: 'https://domainrank.app',
    src: 'https://domainrank.app/api/badge/scidrawer.com?theme=dark',
    alt: 'SciDrawer AI domain rating on DomainRank',
  },
  {
    id: 'findly-tools',
    href: 'https://findly.tools/scidrawer-ai?utm_source=scidrawer-ai',
    src: 'https://findly.tools/badges/findly-tools-badge-light.svg',
    alt: 'SciDrawer AI featured on Findly.tools',
  },
  {
    id: 'product-wing',
    href: 'https://productwing.com/product/scidrawer',
    src: 'https://productwing.com/assets/images/badge-dark.png',
    alt: 'SciDrawer AI featured on Product Wing',
  },
];

export function FooterWithBigText() {
  const year = new Date().getFullYear();
  const marqueeStyle = {
    '--scroll-duration': '100s',
  } as React.CSSProperties;
  const badgeClassName =
    'group flex h-[70px] w-[220px] shrink-0 items-center justify-center px-3 py-2 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 sm:h-[78px] sm:w-[260px]';

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
        <div
          role="region"
          aria-label={m['landing.footer.featured_on']()}
          className="group overflow-hidden border-b border-neutral-800 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] pb-6"
        >
          <div
            className="animate-scroll flex w-max will-change-transform group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
            style={marqueeStyle}
          >
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 gap-4 pr-4"
              >
                {FEATURED_BADGES.map((badge) => (
                  <li key={`${copy}-${badge.id}`} className="shrink-0">
                    {badge.id === 'agenthunter' ? (
                      <a
                        href={badge.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={badge.alt}
                        tabIndex={copy === 1 ? -1 : undefined}
                        className={`${badgeClassName} gap-3 text-left`}
                      >
                        <img
                          src="https://www.agenthunter.io/logo-dark.svg"
                          alt=""
                          width={40}
                          height={40}
                          loading="lazy"
                          className="size-10 shrink-0"
                        />
                        <span className="flex flex-col">
                          <span className="text-xs text-gray-400">
                            AgentHunter
                          </span>
                          <span className="text-sm font-semibold text-gray-50">
                            Featured AI Agent
                          </span>
                        </span>
                      </a>
                    ) : (
                      <a
                        href={badge.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={badge.alt}
                        tabIndex={copy === 1 ? -1 : undefined}
                        {...(badge.id === 'toolbit'
                          ? {
                              'data-tb-secret':
                                '0e74bd9e85bb53116ed0cd60803434592a4fa9d136d069f5',
                            }
                          : {})}
                        className={badgeClassName}
                      >
                        <img
                          src={badge.src}
                          alt=""
                          loading="lazy"
                          className="max-h-full max-w-full object-contain"
                        />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
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
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-800 pt-6">
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
