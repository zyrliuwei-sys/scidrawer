import { useId, useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

import { useRouter } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';
import type { SeoTool } from '@/content/seo-pages';

// /generate accepts prompts up to 4,000 characters; leave room for the preset
// framing and layout instructions.
const INPUT_MAX_LENGTH = 2_400;

const optionClass =
  'border-border bg-background has-[:checked]:border-primary has-[:checked]:bg-primary/5 has-[:focus-visible]:ring-ring/50 cursor-pointer rounded-xl border px-3 py-2.5 transition-colors has-[:focus-visible]:ring-3 hover:border-primary/50';

export function buildToolPrompt(
  tool: SeoTool,
  layoutId: string,
  input: string
): string {
  const layout =
    tool.layouts.find((item) => item.id === layoutId) ?? tool.layouts[0];
  return [
    tool.promptPrefix,
    `Layout: ${layout.prompt}`,
    `Study summary:\n${input.trim()}`,
  ].join('\n\n');
}

export function SeoPresetTool({ tool }: { tool: SeoTool }) {
  const router = useRouter();
  const inputId = useId();
  const errorId = useId();
  const [input, setInput] = useState('');
  const [layoutId, setLayoutId] = useState(tool.layouts[0]?.id ?? '');
  const [aspect, setAspect] = useState(tool.defaultAspect);
  const [showError, setShowError] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) {
      setShowError(true);
      return;
    }
    const prompt = buildToolPrompt(tool, layoutId, input);
    router.push(
      `/generate?prompt=${encodeURIComponent(prompt)}&aspect=${encodeURIComponent(aspect)}`
    );
  };

  return (
    <form
      onSubmit={submit}
      className="bg-card text-card-foreground relative flex h-full flex-col gap-5 rounded-2xl border border-white/80 p-5 shadow-[0_28px_54px_oklch(0.19_0.06_165_/_0.22)] sm:p-6 dark:border-white/10"
    >
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Sparkles className="text-primary size-4" aria-hidden />
          {tool.heading}
        </h2>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          {tool.description}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <label htmlFor={inputId} className="text-sm font-medium">
            {tool.inputLabel}
          </label>
          <button
            type="button"
            onClick={() => {
              setInput(tool.exampleText);
              setShowError(false);
            }}
            className="text-primary text-xs font-semibold underline-offset-4 hover:underline"
          >
            {tool.exampleLabel}
          </button>
        </div>
        <textarea
          id={inputId}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            if (showError) setShowError(false);
          }}
          maxLength={INPUT_MAX_LENGTH}
          rows={5}
          placeholder={tool.inputPlaceholder}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : undefined}
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive dark:bg-input/30 mt-2 w-full resize-y rounded-lg border bg-transparent px-3 py-2 text-sm leading-6 outline-none focus-visible:ring-3"
        />
        {showError ? (
          <p id={errorId} className="text-destructive mt-1.5 text-xs">
            {tool.emptyError}
          </p>
        ) : null}
      </div>

      <fieldset>
        <legend className="text-sm font-medium">{tool.layoutLabel}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {tool.layouts.map((layout) => (
            <label key={layout.id} className={optionClass}>
              <input
                type="radio"
                name="layout"
                value={layout.id}
                checked={layoutId === layout.id}
                onChange={() => setLayoutId(layout.id)}
                className="sr-only"
              />
              <span className="block text-sm leading-5 font-semibold">
                {layout.label}
              </span>
              <span className="text-muted-foreground mt-0.5 block text-xs leading-5">
                {layout.description}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">{tool.aspectLabel}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {tool.aspects.map((option) => (
            <label
              key={option.value}
              className={cn(optionClass, 'py-1.5 text-sm font-medium')}
            >
              <input
                type="radio"
                name="aspect"
                value={option.value}
                checked={aspect === option.value}
                onChange={() => setAspect(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-auto">
        <button
          type="submit"
          className="bg-primary text-primary-foreground focus-visible:ring-ring inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          {tool.submitLabel}
          <ArrowRight className="size-4" aria-hidden />
        </button>
        <p className="text-muted-foreground mt-2 text-center text-xs">
          {tool.note}
        </p>
      </div>
    </form>
  );
}
