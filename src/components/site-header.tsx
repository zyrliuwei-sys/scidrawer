'use client';

import { useState } from 'react';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { LocaleSelector } from '@/components/locale-selector';
import { SiteUserMenu } from '@/components/site-user-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { buttonVariants } from '@/components/ui/button';

export interface NavLink {
  href: string;
  label: string;
  /** Open in a new tab. Off-site (http) hrefs always open in a new tab. */
  external?: boolean;
  /** Nested links are present in SSR HTML even while CSS hides the menu. */
  children?: Array<{ href: string; label: string }>;
}

/** Off-site URLs render as plain <a>; internal paths use the locale-aware Link. */
const isExternalHref = (href: string) => /^https?:\/\//.test(href);

export function SiteHeader({ navLinks }: { navLinks?: NavLink[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="bg-background/80 sticky top-0 z-50 w-full backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand — logo + wordmark on the left */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.svg"
            alt="SciDrawer AI logo"
            width={28}
            height={28}
            className="size-7 rounded-md"
          />
          <span className="font-serif text-lg font-semibold tracking-tight">
            SciDrawer AI
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks?.map((link) => {
            if (link.children?.length) {
              return (
                <div key={link.href} className="group relative">
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown className="size-3.5 transition-transform duration-200 group-focus-within:rotate-180 group-hover:rotate-180" />
                  </a>
                  <div className="absolute top-full left-1/2 z-50 w-70 -translate-x-1/2 pt-3">
                    <div className="border-border bg-popover invisible rounded-xl border p-2 opacity-0 shadow-[0_18px_40px_oklch(0.22_0.03_240_/_0.16)] transition-[opacity,visibility,transform] duration-200 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul className="space-y-1">
                        {link.children.map((child) => (
                          <li key={child.href}>
                            <a
                              href={child.href}
                              className="text-foreground hover:bg-accent block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                            >
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            }

            return isExternalHref(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LocaleSelector className="hidden" />
          <ThemeToggle />
          {user ? (
            <SiteUserMenu
              name={user.name || 'User'}
              email={user.email}
              image={user.image}
            />
          ) : (
            <Link href="/settings" className={cn(buttonVariants(), 'gap-1.5')}>
              {m['common.nav.get_started']()}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="p-2 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-border border-t px-4 pt-2 pb-4 md:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks?.map((link) => {
              if (link.children?.length) {
                return (
                  <div key={link.href} className="py-1">
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:bg-accent hover:text-foreground flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors"
                    >
                      {link.label}
                      <ChevronDown className="size-4" aria-hidden />
                    </a>
                    <ul className="border-border mt-1 ml-3 space-y-1 border-l pl-2">
                      {link.children.map((child) => (
                        <li key={child.href}>
                          <a
                            href={child.href}
                            className="text-muted-foreground hover:bg-accent hover:text-foreground block rounded-md px-3 py-2 text-sm transition-colors"
                          >
                            {child.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }

              return isExternalHref(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md px-3 py-2 text-sm transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-border mt-3 flex items-center gap-2 border-t pt-3">
            <LocaleSelector className="hidden" />
            <ThemeToggle />
            <div className="flex-1" />
            {user ? (
              <SiteUserMenu
                name={user.name || 'User'}
                email={user.email}
                image={user.image}
              />
            ) : (
              <Link
                href="/settings"
                className={cn(buttonVariants(), 'gap-1.5')}
                onClick={() => setMobileOpen(false)}
              >
                {m['common.nav.get_started']()}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
