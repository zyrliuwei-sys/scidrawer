import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import { LocaleSelector } from '@/components/locale-selector';

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
            <div className="mt-7">
              <LocaleSelector
                variant="pill"
                className="border-neutral-700 text-neutral-200 hover:bg-white/5 hover:text-neutral-50"
              />
            </div>
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
