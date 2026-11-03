import type { CSSProperties } from 'react';
import type { FooterBadge } from '@/features/footer-badges/types';

import { cn } from '@/lib/utils';

/** Each marquee half repeats the list until it holds at least this many badges, so short lists still span wide screens. */
const MIN_BADGES_PER_LOOP = 12;
const SECONDS_PER_BADGE = 3;

function BadgeRow({
  badges,
  hidden,
  originalCount,
}: {
  badges: FooterBadge[];
  hidden?: boolean;
  originalCount: number;
}) {
  return (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={hidden || undefined}
    >
      {badges.map((badge, index) => (
        <li
          key={`${index}:${badge.href}:${badge.src}`}
          className="shrink-0 pr-4"
          aria-hidden={hidden || index >= originalCount || undefined}
        >
          <a
            href={badge.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={hidden || index >= originalCount ? -1 : undefined}
            className="flex h-12 items-center transition-opacity hover:opacity-80"
          >
            <img
              src={badge.src}
              alt={hidden ? '' : badge.alt}
              width={badge.width ?? 250}
              height={badge.height}
              loading="lazy"
              draggable={false}
              className="h-full w-auto max-w-[260px] object-contain"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function FooterBadgeList({
  badges,
  className,
  label,
}: {
  badges: FooterBadge[];
  className?: string;
  label: string;
}) {
  if (badges.length === 0) return null;

  const repeat = Math.ceil(MIN_BADGES_PER_LOOP / badges.length);
  const loop = Array.from({ length: repeat }, () => badges).flat();
  const style = {
    '--badge-marquee-duration': `${loop.length * SECONDS_PER_BADGE}s`,
  } as CSSProperties;

  return (
    <div
      role="region"
      aria-label={label}
      className={cn('badge-marquee w-full overflow-hidden', className)}
    >
      <div className="badge-marquee-track flex w-max" style={style}>
        <BadgeRow badges={loop} originalCount={badges.length} />
        <BadgeRow badges={loop} originalCount={badges.length} hidden />
      </div>
    </div>
  );
}
