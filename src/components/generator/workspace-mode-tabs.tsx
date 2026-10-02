import { Sparkles } from 'lucide-react';

// Icons for the hidden Flowchart / Plot tabs — uncomment with the modes above.
// import { BarChart3, GitBranch } from 'lucide-react';

import { cn } from '@/lib/utils';

export type GeneratorWorkspaceMode =
  | 'illustration'
  | 'flowchart'
  | 'plot'
  | 'svg-converter'
  | 'svg-editor';

type FigureWorkspaceMode = Exclude<
  GeneratorWorkspaceMode,
  'svg-converter' | 'svg-editor'
>;

// Hidden for now — uncomment the entries below (and their icon imports) to
// bring the Flowchart / Plot modes back to the switcher.
const modes: Array<{
  id: FigureWorkspaceMode;
  label: string;
  icon: typeof Sparkles;
}> = [
  { id: 'illustration', label: 'Illustration', icon: Sparkles },
  // { id: 'flowchart', label: 'Flowchart', icon: GitBranch },
  // { id: 'plot', label: 'Plot', icon: BarChart3 },
];

export const figureWorkspaceModes = modes;

export function WorkspaceModeTabs({
  activeMode,
  onModeChange,
}: {
  activeMode: FigureWorkspaceMode;
  onModeChange: (mode: FigureWorkspaceMode) => void;
}) {
  // A switcher with a single mode is noise — hide it entirely.
  if (modes.length < 2) return null;

  return (
    <div
      className="mx-auto mb-7 flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-slate-200 bg-white p-1 shadow-[0_4px_14px_rgba(15,23,42,0.06)]"
      role="tablist"
      aria-label="Scientific creation mode"
    >
      {modes.map((mode) => {
        const Icon = mode.icon;
        const selected = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onModeChange(mode.id)}
            className={cn(
              'inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2',
              selected
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <Icon className="size-4" />
            {mode.label}
            {mode.id === 'plot' && (
              <span
                className={cn(
                  'rounded-full border px-1.5 py-px text-[10px] leading-4',
                  selected
                    ? 'border-white/35 text-white'
                    : 'border-slate-200 text-slate-400'
                )}
              >
                Beta
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
