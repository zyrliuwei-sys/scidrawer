import {
  ChevronRight,
  CircleUserRound,
  FileCode2,
  Image,
  PanelLeftClose,
  PanelLeftOpen,
  PenTool,
  Presentation,
} from 'lucide-react';

import { cn } from '@/lib/utils';

export type WorkspaceSidebarTool =
  | 'generate'
  | 'poster'
  | 'svg-converter'
  | 'svg-editor';

export type WorkspaceSidebarHistoryItem = {
  id: string;
  prompt: string;
  createdAt: number;
  src?: string;
};

type FigpadWorkspaceSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeTool: WorkspaceSidebarTool;
  onToolSelect: (tool: WorkspaceSidebarTool) => void;
  historyExpanded: boolean;
  onHistoryExpandedChange: (expanded: boolean) => void;
  history: WorkspaceSidebarHistoryItem[];
  historyLoading: boolean;
  onHistoryItemSelect: (item: WorkspaceSidebarHistoryItem) => void;
  signedIn: boolean;
  accountLabel?: string;
  onAccountClick: () => void;
};

const tools: Array<{
  id: WorkspaceSidebarTool;
  label: string;
  icon: typeof Image;
}> = [
  { id: 'generate', label: 'Generate Figure', icon: Image },
  { id: 'poster', label: 'Generate Poster', icon: Presentation },
  { id: 'svg-converter', label: 'SVG Converter', icon: FileCode2 },
  { id: 'svg-editor', label: 'SVG Editor', icon: PenTool },
];

function formatHistoryTime(createdAt: number) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return '';

  const elapsed = Date.now() - date.getTime();
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes >= 0 && minutes < 60) return `${Math.max(minutes, 1)}m ago`;

  const hours = Math.floor(elapsed / 3_600_000);
  if (hours >= 1 && hours < 24) return `${hours}h ago`;

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function FigpadWorkspaceSidebar({
  open,
  onOpenChange,
  activeTool,
  onToolSelect,
  historyExpanded,
  onHistoryExpandedChange,
  history,
  historyLoading,
  onHistoryItemSelect,
  signedIn,
  accountLabel,
  onAccountClick,
}: FigpadWorkspaceSidebarProps) {
  const visibleHistory = history.slice(0, 8);
  const accountInitial = accountLabel?.trim().charAt(0).toUpperCase();

  return (
    <aside
      aria-label="SciDrawer workspace sidebar"
      className={cn(
        'relative hidden h-dvh shrink-0 flex-col overflow-hidden bg-[#F7F7F7] px-3 py-4 text-[14px] text-[#171717] transition-[width] duration-200 ease-out md:flex',
        open ? 'w-[320px]' : 'w-16 items-center px-2'
      )}
    >
      <header
        className={cn(
          'flex w-full items-center',
          open ? 'justify-between px-1' : 'justify-center'
        )}
      >
        <div
          className={cn(
            'flex min-w-0 items-center gap-2.5 overflow-hidden',
            !open && 'justify-center'
          )}
        >
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-[7px] bg-[#10254d] text-white"
          >
            <Image className="size-4" strokeWidth={2.2} />
          </span>
          <span
            className={cn(
              'truncate text-[16px] font-semibold tracking-[-0.02em] transition-opacity duration-200',
              open ? 'opacity-100' : 'pointer-events-none w-0 opacity-0'
            )}
            aria-hidden={!open}
          >
            SciDrawer
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
          className={cn(
            'flex size-7 shrink-0 items-center justify-center rounded-md text-[#737373] transition-colors hover:bg-white/75 hover:text-[#171717]',
            !open && 'absolute top-4'
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
          'mt-7 grid w-full gap-3',
          !open && 'justify-items-center'
        )}
      >
        {tools.map(({ id, label, icon: Icon }) => {
          const active = activeTool === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onToolSelect(id)}
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              title={open ? undefined : label}
              className={cn(
                'flex h-[30px] items-center rounded-lg text-sm font-semibold transition-colors',
                open
                  ? 'w-full gap-2.5 px-3 text-left'
                  : 'w-[30px] justify-center',
                active
                  ? 'bg-[#EDEDEE] text-[#171717]'
                  : 'text-[#525252] hover:bg-white/75 hover:text-[#171717]'
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

      <section
        aria-label="Generation history"
        className={cn(
          'mt-5 w-full border-t border-black/[0.07] pt-4',
          !open && 'flex justify-center'
        )}
      >
        <button
          type="button"
          onClick={() => onHistoryExpandedChange(!historyExpanded)}
          aria-expanded={historyExpanded}
          aria-controls="workspace-generation-history"
          aria-label="Toggle history"
          title={open ? undefined : 'History'}
          className={cn(
            'flex h-[30px] items-center rounded-lg text-sm font-semibold text-[#525252] transition-colors hover:bg-white/75 hover:text-[#171717]',
            open ? 'w-full justify-between px-3' : 'w-[30px] justify-center'
          )}
        >
          <span
            className={cn(
              'flex items-center gap-2.5',
              !open && 'justify-center'
            )}
          >
            <ChevronRight
              className={cn(
                'size-4 shrink-0 transition-transform duration-200',
                historyExpanded && 'rotate-90'
              )}
            />
            <span
              className={cn(
                'transition-opacity duration-200',
                open ? 'opacity-100' : 'pointer-events-none w-0 opacity-0'
              )}
              aria-hidden={!open}
            >
              History
            </span>
          </span>
        </button>

        {open && historyExpanded && (
          <div
            id="workspace-generation-history"
            className="mt-2 grid [max-height:calc(100dvh-300px)] gap-1 overflow-y-auto pb-1"
          >
            {historyLoading ? (
              Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-1.5"
                  aria-label="Loading history"
                >
                  <span className="size-7 shrink-0 animate-pulse rounded-md bg-black/[0.07]" />
                  <span className="grid flex-1 gap-1.5">
                    <span className="h-2.5 w-4/5 animate-pulse rounded bg-black/[0.07]" />
                    <span className="h-2 w-1/3 animate-pulse rounded bg-black/[0.05]" />
                  </span>
                </div>
              ))
            ) : visibleHistory.length > 0 ? (
              visibleHistory.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onHistoryItemSelect(item)}
                  title={item.prompt}
                  aria-label={`Open history item: ${item.prompt}`}
                  className="flex min-w-0 items-center gap-2.5 rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-white/75"
                >
                  {item.src ? (
                    <img
                      src={item.src}
                      alt=""
                      className="size-7 shrink-0 rounded-md border border-black/[0.06] object-cover"
                    />
                  ) : (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-white text-[#737373] shadow-[0_1px_1px_rgba(0,0,0,0.03)]">
                      <Image className="size-3.5" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block overflow-hidden text-[12px] font-medium text-ellipsis whitespace-nowrap text-[#404040]">
                      {item.prompt || 'Untitled figure'}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[#8a8a8a]">
                      {formatHistoryTime(item.createdAt)}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-2 text-[12px] text-[#8a8a8a]">
                No figures yet
              </p>
            )}
          </div>
        )}
      </section>

      <footer
        className={cn(
          'mt-auto w-full border-t border-black/[0.07] pt-4',
          !open && 'flex justify-center'
        )}
      >
        <button
          type="button"
          onClick={onAccountClick}
          aria-label={signedIn ? accountLabel || 'Account' : 'Sign in'}
          title={
            open ? undefined : signedIn ? accountLabel || 'Account' : 'Sign in'
          }
          className={cn(
            'flex h-9 items-center rounded-lg font-semibold text-[#404040] transition-colors hover:bg-white/75',
            open ? 'w-full justify-between px-3' : 'w-9 justify-center'
          )}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[#525252] shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
              {signedIn && accountInitial ? (
                <span className="text-[11px] font-bold">{accountInitial}</span>
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
            <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-[#737373] shadow-[0_1px_1px_rgba(0,0,0,0.04)]">
              Free
            </span>
          )}
        </button>
      </footer>
    </aside>
  );
}
