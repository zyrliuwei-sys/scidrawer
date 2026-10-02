import type { PreviewImage } from '@/components/image-preview-panel';

// ------------------------------------------------------------------
// Generation state machine
// ------------------------------------------------------------------
// Drives the /generate workbench. The form, the progress overlay, and
// the result toolbar all derive their UI from this state. We keep the
// types in one place so changes here ripple through.
// ------------------------------------------------------------------

export type GenStep = 'parse' | 'layout' | 'render' | 'label' | 'finish';
export type GenErrorKind =
  | 'network'
  | 'safety'
  | 'credits'
  | 'timeout'
  | 'rate-limit'
  | 'unknown';

export type GenError = {
  kind: GenErrorKind;
  message: string;
  /** Whether the user can retry the same prompt without changing anything. */
  retryable: boolean;
};

export type GenerateState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | {
      status: 'generating';
      jobId: string;
      startedAt: number;
      step: GenStep;
      /** Provider-reported progress. It is never fabricated for the UI. */
      progress: number;
      /** Provider estimate in seconds, when the provider supplies one. */
      estimatedTime: number | null;
      /** Cumulative elapsed seconds for countdown. */
      elapsed: number;
      /** Final, hard cap so the spinner can never spin forever. */
      timeoutAt: number;
    }
  | { status: 'succeeded'; image: PreviewImage; elapsed: number }
  | { status: 'failed'; error: GenError };

export const STEP_ORDER: GenStep[] = [
  'parse',
  'layout',
  'render',
  'label',
  'finish',
];
export const STEP_DESCRIPTIONS: Record<GenStep, string> = {
  parse: 'Parsing prompt semantics',
  layout: 'Designing layout grid',
  render: 'Rendering primary shapes',
  label: 'Adding labels & annotations',
  finish: 'Post-processing & color grading',
};

/** Hard cap for an external image task before the UI returns a retryable error. */
export const GENERATION_TIMEOUT_MS = 5 * 60 * 1000;

/** Compute the "elapsed" label (mm:ss) from a timestamp. */
export function formatElapsed(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Estimate remaining time given the current step. */
export function estimateRemainingMs(state: {
  step: GenStep;
  startedAt: number;
  elapsed: number;
}): number {
  const remainingSteps = STEP_ORDER.length - STEP_ORDER.indexOf(state.step) - 1;
  const avgStepMs =
    state.elapsed / Math.max(1, STEP_ORDER.indexOf(state.step) + 1);
  return Math.max(0, Math.round(remainingSteps * avgStepMs));
}

// ------------------------------------------------------------------
// Actions
// ------------------------------------------------------------------

export type GenAction =
  | { type: 'submit' }
  | {
      type: 'task-created';
      jobId: string;
      progress?: number;
      estimatedTime?: number | null;
      startedAt?: number;
    }
  | {
      type: 'resume';
      jobId: string;
      startedAt: number;
      progress?: number;
      estimatedTime?: number | null;
    }
  | { type: 'task-progress'; progress: number; estimatedTime?: number | null }
  | { type: 'tick'; now: number }
  | { type: 'succeed'; image: PreviewImage }
  | { type: 'cancel' }
  | { type: 'fail'; error: GenError }
  | { type: 'reset' }
  | { type: 'prompt-edit' };

// ------------------------------------------------------------------
// Reducer
// ------------------------------------------------------------------

export const initialState: GenerateState = { status: 'idle' };

export function generateReducer(
  state: GenerateState,
  action: GenAction
): GenerateState {
  switch (action.type) {
    case 'submit':
      return {
        status: 'submitting',
      };

    case 'task-created': {
      const startedAt = action.startedAt ?? Date.now();
      return {
        status: 'generating',
        jobId: action.jobId,
        startedAt,
        step: STEP_ORDER[0],
        progress: Math.max(0, Math.min(100, action.progress ?? 0)),
        estimatedTime: action.estimatedTime ?? null,
        elapsed: 0,
        timeoutAt: startedAt + GENERATION_TIMEOUT_MS,
      };
    }

    case 'resume':
      return {
        status: 'generating',
        jobId: action.jobId,
        startedAt: action.startedAt,
        step: stepForProgress(action.progress ?? 0),
        progress: Math.max(0, Math.min(100, action.progress ?? 0)),
        estimatedTime: action.estimatedTime ?? null,
        elapsed: Math.max(0, Date.now() - action.startedAt),
        timeoutAt: action.startedAt + GENERATION_TIMEOUT_MS,
      };

    case 'task-progress':
      if (state.status !== 'generating') return state;
      return {
        ...state,
        progress: Math.max(0, Math.min(100, action.progress)),
        estimatedTime: action.estimatedTime ?? state.estimatedTime,
        step: stepForProgress(action.progress),
      };

    case 'tick':
      if (state.status !== 'generating') return state;
      return { ...state, elapsed: action.now - state.startedAt };

    case 'succeed':
      if (state.status !== 'generating') return state;
      return {
        status: 'succeeded',
        image: action.image,
        elapsed: Math.max(0, Date.now() - state.startedAt),
      };

    case 'cancel':
      if (state.status === 'generating' || state.status === 'submitting') {
        return { status: 'idle' };
      }
      return state;

    case 'fail':
      if (state.status === 'generating' || state.status === 'submitting') {
        return { status: 'failed', error: action.error };
      }
      return state;

    case 'reset':
    case 'prompt-edit':
      if (state.status === 'succeeded' || state.status === 'failed') {
        return { status: 'idle' };
      }
      return state;

    default:
      return state;
  }
}

function stepForProgress(progress: number): GenStep {
  if (progress < 10) return 'parse';
  if (progress < 30) return 'layout';
  if (progress < 70) return 'render';
  if (progress < 95) return 'label';
  return 'finish';
}
