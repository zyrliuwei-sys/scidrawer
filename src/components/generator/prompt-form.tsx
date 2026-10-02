'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { CREDITS_PER_GENERATION } from '@/routes/generate/-state';
import {
  ChevronDown,
  History,
  Image as ImageIcon,
  Settings2,
  Sparkles,
  X,
} from 'lucide-react';

import { getUuid } from '@/lib/hash';
import { cn } from '@/lib/utils';

const PROMPT_CHAR_LIMIT = 1000;
const PROMPT_HISTORY_KEY = 'scidrawer:prompt-history';
const PROMPT_DRAFT_KEY = 'scidrawer:prompt-draft';
const MAX_HISTORY = 5;

export type PromptFormHandle = {
  /** Imperative clear — used by the parent's reset flow. */
  clear: () => void;
};

export type PromptFormProps = {
  /** Whether the form is locked (e.g. while a generation is running). */
  disabled?: boolean;
  /** Submit handler — ⌘/Ctrl+Enter or button click. */
  onSubmit: () => void;
  /** Pre-fill the prompt (used by example chips). */
  initialValue?: string;
  /** Reference image URLs the user has attached (shown as removable chips). */
  referenceImages: string[];
  onAddReference: (url: string) => void;
  onRemoveReference: (url: string) => void;
  /** Form-level model + aspect summary — kept compact inside the card. */
  aspect: string;
  model: string;
};

export const PromptForm = forwardRef<PromptFormHandle, PromptFormProps>(
  function PromptForm(
    {
      disabled,
      onSubmit,
      initialValue,
      referenceImages,
      onAddReference,
      onRemoveReference,
      aspect,
      model,
    },
    ref
  ) {
    const [prompt, setPrompt] = useState<string>(() => {
      if (initialValue) return initialValue;
      if (typeof window === 'undefined') return '';
      return window.localStorage.getItem(PROMPT_DRAFT_KEY) ?? '';
    });
    const [history, setHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Load prompt history on mount.
    useEffect(() => {
      if (typeof window === 'undefined') return;
      try {
        const raw = window.localStorage.getItem(PROMPT_HISTORY_KEY);
        if (raw) setHistory(JSON.parse(raw) as string[]);
      } catch {
        // ignore
      }
    }, []);

    // Persist prompt as draft on every change.
    useEffect(() => {
      if (typeof window === 'undefined') return;
      const id = window.setTimeout(() => {
        if (prompt) window.localStorage.setItem(PROMPT_DRAFT_KEY, prompt);
        else window.localStorage.removeItem(PROMPT_DRAFT_KEY);
      }, 200);
      return () => window.clearTimeout(id);
    }, [prompt]);

    useImperativeHandle(
      ref,
      () => ({
        clear: () => {
          setPrompt('');
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(PROMPT_DRAFT_KEY);
          }
        },
      }),
      []
    );

    const charCount = prompt.length;
    const charPct = Math.min(100, (charCount / PROMPT_CHAR_LIMIT) * 100);
    const charOver = charCount > PROMPT_CHAR_LIMIT;
    const canSubmit = prompt.trim().length >= 3 && !disabled;

    // Cmd/Ctrl+Enter submits from anywhere in the textarea.
    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }
    };

    // Drag-and-drop: drop image files onto the textarea to attach references.
    const onDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );
      files.forEach((file) => {
        // We don't actually upload — just hold an object URL until the user
        // hits Generate. Real backend would POST to /api/uploads and return
        // a stored URL. For the mock, object URLs are good enough.
        const url = URL.createObjectURL(file);
        onAddReference(url);
      });
    };
    const onDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
      if (e.dataTransfer.types.includes('Files')) e.preventDefault();
    };

    const onPickFromHistory = (entry: string) => {
      setPrompt(entry);
      setShowHistory(false);
      // Refocus the textarea and put the caret at the end.
      window.setTimeout(() => {
        textareaRef.current?.focus();
        const len = entry.length;
        textareaRef.current?.setSelectionRange(len, len);
      }, 0);
    };

    return (
      <div
        className={cn(
          'overflow-hidden rounded-[20px] border border-slate-200 bg-white transition-opacity',
          disabled && 'pointer-events-none opacity-60'
        )}
      >
        {/* Reference image chips — visible only when present. */}
        {referenceImages.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3">
            <span className="text-muted-foreground text-xs font-medium">
              References
            </span>
            {referenceImages.map((url) => (
              <ReferenceChip
                key={url}
                url={url}
                onRemove={() => onRemoveReference(url)}
              />
            ))}
          </div>
        )}

        {/* Prompt textarea — accepts drag-and-drop image files. */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={onKeyDown}
            onDrop={onDrop}
            onDragOver={onDragOver}
            placeholder="Describe the figure you want to generate…"
            rows={6}
            className="block min-h-[128px] w-full resize-none border-0 bg-white px-5 pt-4 pb-3 text-base outline-none focus:outline-none"
            aria-label="Generation prompt"
            aria-describedby="prompt-counter"
          />

          {/* History dropdown — shown when textarea is focused + empty. */}
          {showHistory && history.length > 0 && (
            <div className="absolute top-2 right-3 left-3 z-20 rounded-lg border bg-white shadow-lg">
              <div className="text-muted-foreground flex items-center gap-2 border-b px-3 py-2 text-xs font-medium">
                <History className="size-3.5" />
                Recent prompts
              </div>
              <ul className="max-h-48 overflow-y-auto py-1">
                {history.map((entry) => (
                  <li key={entry}>
                    <button
                      type="button"
                      onClick={() => onPickFromHistory(entry)}
                      className="block w-full truncate px-3 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {entry}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Token / character counter + history toggle. */}
        <div className="flex items-center justify-between gap-3 border-t px-4 py-2 text-xs">
          <button
            type="button"
            onClick={() => setShowHistory((v) => !v)}
            className={cn(
              'text-muted-foreground flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors hover:bg-slate-100',
              showHistory && 'bg-slate-100 text-slate-700'
            )}
            aria-label="Show recent prompts"
          >
            <History className="size-3.5" />
            Recent
          </button>
          <span
            id="prompt-counter"
            className={cn(
              'tabular-nums',
              charOver
                ? 'font-semibold text-amber-600'
                : charCount > PROMPT_CHAR_LIMIT * 0.8
                  ? 'text-amber-600'
                  : 'text-muted-foreground'
            )}
          >
            {charCount} / {PROMPT_CHAR_LIMIT}
            {charOver && ' · over limit'}
          </span>
        </div>

        {/* Bottom action row — settings + submit. */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3">
          <div className="flex items-center gap-2">
            <FileAttachButton
              disabled={disabled}
              onAttach={(url) => onAddReference(url)}
            />

            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
              aria-label="Aspect ratio"
            >
              <span className="font-medium">{aspect}</span>
            </button>

            <button
              type="button"
              className="flex h-8 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-700"
              aria-label="Model"
              title={`Model: ${model}`}
            >
              <Settings2 className="size-3.5 text-slate-700" />
              {model}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              <Sparkles className="size-3 fill-amber-500 text-amber-500" />
              {CREDITS_PER_GENERATION} Credits
            </span>
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit}
              aria-label="Generate figure"
              title="Generate (⌘/Ctrl+Enter)"
              className={cn(
                'flex h-10 items-center gap-2 rounded-[12px] bg-slate-700 px-4 text-sm font-medium text-white shadow-[0_10px_24px_rgba(30,38,47,0.18)] transition hover:bg-slate-800',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
            >
              {disabled ? 'Generating…' : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

// ------------------------------------------------------------------
// Small subcomponents
// ------------------------------------------------------------------

function ReferenceChip({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) {
  return (
    <span className="group/chip relative inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white py-0.5 pr-2 pl-1 text-xs text-slate-700">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="size-5 rounded-full object-cover" />
      <span className="max-w-[10ch] truncate">ref</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove reference"
        className="ml-0.5 flex size-4 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="size-3" />
      </button>
    </span>
  );
}

function FileAttachButton({
  disabled,
  onAttach,
}: {
  disabled?: boolean;
  onAttach: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        aria-label="Attach image"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="flex size-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ImageIcon className="size-4" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          files.forEach((file) => onAttach(URL.createObjectURL(file)));
          e.target.value = '';
        }}
      />
    </>
  );
}
