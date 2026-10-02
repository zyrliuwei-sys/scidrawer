'use client';

import {
  estimateRemainingMs,
  formatElapsed,
  STEP_DESCRIPTIONS,
  STEP_ORDER,
  type GenStep,
} from '@/routes/generate/-state';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

const STEP_LABELS: Record<GenStep, string> = {
  parse: '1. Parse prompt',
  layout: '2. Design layout',
  render: '3. Render shapes',
  label: '4. Add labels',
  finish: '5. Post-process',
};

export function GenerationProgress({
  step,
  elapsed,
  onCancel,
}: {
  step: GenStep;
  elapsed: number;
  onCancel: () => void;
}) {
  const remainingMs = estimateRemainingMs({ step, startedAt: 0, elapsed });

  return (
    <div className="bg-background flex h-full min-h-[300px] w-full flex-col overflow-hidden rounded-xl border shadow-sm">
      {/* Shimmer placeholder where the figure will appear. */}
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50/40 via-white to-cyan-50/30" />
        <motion.div
          className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ width: '40%' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-muted-foreground flex flex-col items-center gap-2">
            <motion.div
              className="size-10 rounded-full border-2 border-slate-300 border-t-slate-700"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-sm">Generating your figure…</p>
          </div>
        </div>
      </div>

      {/* Bottom status bar — 5 steps + cancel. */}
      <div className="border-t bg-slate-50 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {STEP_LABELS[step]}
              </span>
              <span className="text-foreground text-sm">
                {STEP_DESCRIPTIONS[step]}
                <span className="text-muted-foreground ml-2 text-xs tabular-nums">
                  · {formatElapsed(elapsed)} elapsed
                </span>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Stop waiting
          </button>
        </div>

        {/* 5-step indicator strip. */}
        <ol className="mt-3 flex items-center gap-1.5">
          {STEP_ORDER.map((s, idx) => {
            const status =
              STEP_ORDER.indexOf(step) > idx
                ? 'done'
                : s === step
                  ? 'active'
                  : 'pending';
            return (
              <li key={s} className="flex-1">
                <StepDot
                  status={status}
                  label={STEP_LABELS[s]}
                  isLast={idx === STEP_ORDER.length - 1}
                />
              </li>
            );
          })}
        </ol>
        {remainingMs > 0 && (
          <p className="text-muted-foreground mt-2 text-right text-xs">
            ~{Math.max(1, Math.round(remainingMs / 1000))}s remaining
          </p>
        )}
      </div>
    </div>
  );
}

function StepDot({
  status,
  label,
  isLast,
}: {
  status: 'done' | 'active' | 'pending';
  label: string;
  isLast: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold',
          status === 'done' && 'bg-emerald-500 text-white',
          status === 'active' &&
            'border-2 border-slate-900 bg-white text-slate-900',
          status === 'pending' &&
            'border border-slate-200 bg-white text-slate-400'
        )}
        aria-current={status === 'active' ? 'step' : undefined}
        title={label}
      >
        {status === 'done' ? '✓' : status === 'active' ? '●' : ''}
      </span>
      {!isLast && (
        <span
          className={cn(
            'h-px flex-1',
            status === 'done' ? 'bg-emerald-500' : 'bg-slate-200'
          )}
        />
      )}
    </div>
  );
}
