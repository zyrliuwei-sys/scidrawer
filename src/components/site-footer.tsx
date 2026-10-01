import { Link } from '@/core/i18n/navigation';

export interface FooterColumn {
  title: string;
  links: Array<{ label: string; href: string }>;
}

/** Marketing footer: brand + tagline, link columns, bottom bar. */
export function SiteFooter({
  appName,
  tagline,
  columns,
  copyright,
}: {
  appName: string;
  tagline: string;
  columns: FooterColumn[];
  copyright: string;
}) {
  return (
    <footer className="border-border bg-secondary/40 mt-20 border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt=""
              width={28}
              height={28}
              className="size-7"
            />
            <span className="text-lg font-bold tracking-tight">{appName}</span>
          </Link>
          <p className="text-muted-foreground mt-3 max-w-xs text-sm">
            {tagline}
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold">{col.title}</h2>
            <ul className="mt-3 space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-border border-t">
        <p className="text-muted-foreground mx-auto max-w-6xl px-4 py-5 text-xs sm:px-6">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
