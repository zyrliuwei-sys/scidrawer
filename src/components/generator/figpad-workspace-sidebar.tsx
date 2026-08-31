import {
  CircleUserRound,
  Gem,
  Image,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';

export type WorkspaceSidebarTool = 'generate';

type FigpadWorkspaceSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTool: WorkspaceSidebarTool;
  onToolSelect: (tool: WorkspaceSidebarTool) => void;
  signedIn: boolean;
  accountLabel?: string;
  onAccountClick: () => void;
};

// Poster / SVG converter / SVG editor are temporarily hidden. If a tool
// returns, add its entry here and widen WorkspaceSidebarTool accordingly.
const tools: Array<{
  id: WorkspaceSidebarTool;
  label: string;
  icon: typeof Image;
}> = [{ id: 'generate', label: 'Image Generate', icon: Image }];

export function FigpadWorkspaceSidebar({
  open,
  onOpenChange,
  activeTool,
  onToolSelect,
  signedIn,
  accountLabel,
  onAccountClick,
}: FigpadWorkspaceSidebarProps) {
  const accountInitial = accountLabel?.trim().charAt(0).toUpperCase();

  return (
    <aside
      aria-label="SciDrawer workspace sidebar"
      className={cn(
        'relative hidden h-dvh shrink-0 flex-col overflow-hidden border-r border-black/[0.06] bg-white px-3 py-4 text-[14px] text-[#171717] transition-[width] duration-200 ease-out md:flex',
        open ? 'w-[264px]' : 'w-16 items-center px-2'
      )}
    >
      <header
        className={cn(
          'flex w-full items-center',
          open ? 'justify-between px-1' : 'flex-col justify-center gap-3'
        )}
      >
        <Link
          href="/"
          aria-label="SciDrawer home"
          title="SciDrawer home"
          className={cn(
            'flex min-w-0 items-center overflow-hidden rounded-lg transition-colors hover:bg-white/75',
            !open && 'w-0 justify-center hover:bg-transparent'
          )}
        >
          <span
            className={cn(
              'truncate text-[16px] font-semibold tracking-[-0.02em] transition-opacity duration-200',
              open ? 'opacity-100' : 'pointer-events-none w-0 opacity-0'
            )}
            aria-hidden={!open}
          >
            SciDrawer
          </span>
        </Link>

        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-md text-[#737373] transition-colors hover:bg-slate-100 hover:text-[#171717]'
          )}
        >
          {open ? (
            <PanelLeftClose className="size-4" />
          ) : (
            <PanelLeftOpen className="size-4" />
          )}
        </button>
      </header>

      <nav
        aria-label="Workspace tools"
        className={cn(
          'mt-12 grid w-full gap-3',
          !open && 'mt-6 justify-items-center'
        )}
      >
        {tools.map(({ id, label, icon: Icon }) => {
          const active = activeTool === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                onToolSelect(id);
                // Clicking a tool icon on the collapsed rail also expands
                // the sidebar — the rail is otherwise label-less.
                if (!open) onOpenChange(true);
              }}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              title={open ? undefined : label}
              className={cn(
                'flex h-[30px] items-center rounded-lg text-sm font-semibold transition-colors',
                open
                  ? 'w-full gap-2.5 px-1 text-left'
                  : 'w-[30px] justify-center',
                active
                  ? 'text-[#171717]'
                  : 'text-[#525252] hover:bg-slate-100 hover:text-[#171717]'
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.9} />
              <span
                className={cn(
                  'truncate transition-opacity duration-200',
                  open ? 'opacity-100' : 'pointer-events-none w-0 opacity-0'
                )}
                aria-hidden={!open}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      <footer
        className={cn('mt-auto flex w-full flex-col', !open && 'items-center')}
      >
        <Link
          href="/pricing"
          aria-label="Pricing"
          title={open ? undefined : 'Pricing'}
          className={cn(
            'flex h-9 items-center rounded-lg text-sm font-medium text-[#525252] transition-colors hover:bg-slate-100 hover:text-[#171717]',
            open ? 'w-full gap-2 px-1' : 'w-9 justify-center'
          )}
        >
          <Gem className="size-4 shrink-0" strokeWidth={1.9} />
          <span
            className={cn(
              'truncate transition-opacity duration-200',
              open ? 'opacity-100' : 'pointer-events-none w-0 opacity-0'
            )}
            aria-hidden={!open}
          >
            Pricing
          </span>
        </Link>
        <div
          className={cn(
            'mt-3 flex w-full flex-col gap-1 border-t border-black/[0.07] pt-3',
            !open && 'w-auto'
          )}
        >
          <button
            type="button"
            onClick={onAccountClick}
            aria-label={signedIn ? accountLabel || 'Account' : 'Sign in'}
            title={
              open
                ? undefined
                : signedIn
                  ? accountLabel || 'Account'
                  : 'Sign in'
            }
            className={cn(
              'flex h-9 items-center rounded-lg font-semibold text-[#404040] transition-colors hover:bg-slate-100',
              open ? 'w-full justify-between px-1' : 'w-9 justify-center'
            )}
          >
            <span
              className={cn(
                'flex min-w-0 items-center gap-2.5',
                !open && 'gap-0'
              )}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[#525252] shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
                {signedIn && accountInitial ? (
                  <span className="text-[11px] font-bold">
                    {accountInitial}
                  </span>
                ) : (
                  <CircleUserRound className="size-4" strokeWidth={1.8} />
                )}
              </span>
              <span
                className={cn(
                  'truncate text-sm transition-opacity duration-200',
                  open ? 'opacity-100' : 'pointer-events-none w-0 opacity-0'
                )}
                aria-hidden={!open}
              >
                {signedIn ? accountLabel || 'Account' : 'Sign in'}
              </span>
            </span>
            {open && (
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-[#737373]">
                Free
              </span>
            )}
          </button>
        </div>
      </footer>
    </aside>
  );
}
