import { useEffect, useRef, useState } from 'react';
import { ChevronsLeft, ChevronsRight, History, Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type NavItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onClick?: () => void;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'generate', label: 'Generate Figure', icon: Sparkles, active: true },
  { key: 'history', label: 'History', icon: History },
];

/**
 * Collapsible workbench sidebar.
 *
 * - **Collapsed (rail)**: shows only icons, ~56px wide. Saves horizontal
 *   space when the user is heads-down on the prompt.
 * - **Pinned (expanded)**: full labels, 280px wide. The default state.
 * - **Auto-expand**: hovering the rail while collapsed temporarily expands
 *   it (mouseLeave delay so crossing into a popup doesn't snap it shut).
 *   The hover state is never persisted — the user's pin state is sacred.
 * - **Manual toggle**: the chevron button in the header switches between
 *   pinned and collapsed.
 */
export function GenerateSidebar() {
  const [pinned, setPinned] = useState(true);
  // `hoverExpanded` is a transient override that only takes effect when
  // the sidebar is collapsed. It expands the panel while the cursor is
  // over it, and snaps back when the cursor leaves (with a small delay
  // to avoid flicker when the user briefly moves into a submenu).
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const leaveTimerRef = useRef<number | null>(null);

  const expanded = pinned || hoverExpanded;

  const onEnter = () => {
    if (pinned) return;
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoverExpanded(true);
  };

  const onLeave = () => {
    if (pinned) return;
    if (leaveTimerRef.current) window.clearTimeout(leaveTimerRef.current);
    // 180ms lets the cursor cross a 1-2px gap (e.g. into a tooltip or
    // context menu) without the sidebar snapping shut under the user.
    leaveTimerRef.current = window.setTimeout(() => {
      setHoverExpanded(false);
      leaveTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) window.clearTimeout(leaveTimerRef.current);
    };
  }, []);

  return (
    <aside
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-collapsed={!pinned}
      aria-label="Workbench sidebar"
      className={cn(
        'relative z-10 hidden shrink-0 flex-col border-r border-slate-200/70 bg-[#F7F7F7] py-4 text-[14px] transition-[width] duration-200 ease-out md:flex',
        expanded ? 'w-[280px] px-3' : 'w-[60px] items-center px-2'
      )}
    >
      {/* Header — logo + (expanded) brand + pin toggle */}
      <div
        className={cn(
          'mb-3 flex w-full items-center',
          expanded ? 'justify-between px-1' : 'justify-center'
        )}
      >
        <Link
          href="/"
          aria-label="SciDrawer AI — home"
          className={cn(
            'flex shrink-0 items-center gap-2 text-[16px] font-semibold text-slate-900',
            !expanded && 'justify-center'
          )}
        >
          <img
            src="/logo.svg"
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-md"
          />
          <span
            className={cn(
              'truncate transition-opacity duration-150',
              expanded ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
            aria-hidden={!expanded}
          >
            SciDrawer AI
          </span>
        </Link>
        {expanded && (
          <button
            type="button"
            onClick={() => setPinned((v) => !v)}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="text-muted-foreground hover:bg-muted hover:text-foreground flex size-7 items-center justify-center rounded-md transition-colors"
          >
            <ChevronsLeft className="size-4" />
          </button>
        )}
      </div>

      {/* Nav items — extra top margin to clear the brand row, generous
          gap between items so they read as a discrete list. */}
      <nav
        className={cn(
          'mt-6 flex w-full flex-col gap-2',
          !expanded && 'items-center'
        )}
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              title={expanded ? undefined : item.label}
              aria-label={item.label}
              aria-current={item.active ? 'page' : undefined}
              onClick={item.onClick}
              className={cn(
                'flex h-[36px] items-center rounded-lg transition-colors',
                expanded ? 'w-full gap-2 px-3' : 'w-9 justify-center',
                item.active
                  ? 'bg-[#ededed] text-slate-900'
                  : 'hover:bg-muted text-[#5f6774] hover:text-slate-900'
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span
                className={cn(
                  'truncate text-left transition-opacity duration-150',
                  expanded ? 'opacity-100' : 'pointer-events-none opacity-0'
                )}
                aria-hidden={!expanded}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Expand handle — only when collapsed. Sits over the right edge so
          the user has a clear target without hunting for a chevron. */}
      {!pinned && (
        <button
          type="button"
          onClick={() => setPinned(true)}
          aria-label="Pin sidebar open"
          title="Pin sidebar open"
          className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1/2 -right-3 z-20 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm transition-colors"
        >
          <ChevronsRight className="size-3.5" />
        </button>
      )}

      {/* Footer — Sign In */}
      <div className={cn('mt-auto w-full', !expanded && 'flex justify-center')}>
        {expanded ? (
          <Button
            variant="outline"
            className="h-12 w-full justify-between rounded-xl px-3 text-[16px] text-slate-900"
          >
            <span>Sign In</span>
            <span className="bg-foreground text-background rounded-md px-2 py-0.5 text-[10px] font-medium">
              Free
            </span>
          </Button>
        ) : (
          <button
            type="button"
            title="Sign In"
            aria-label="Sign In"
            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 shadow-[0_1px_3px_rgba(30,38,47,0.06)] transition-colors hover:bg-slate-50"
          >
            <span className="text-[11px] font-semibold">Free</span>
          </button>
        )}
      </div>
    </aside>
  );
}
