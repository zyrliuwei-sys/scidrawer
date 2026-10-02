import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Clipboard, Download, FileUp, PencilLine } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const STARTER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 420">
  <rect width="720" height="420" fill="#ffffff"/>
  <path d="M110 210H300M420 210H610" fill="none" stroke="#25344d" stroke-width="8" stroke-linecap="round"/>
  <path d="M280 175l35 35-35 35M400 175l-35 35 35 35" fill="none" stroke="#4f7a93" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="110" cy="210" r="54" fill="#dcecf2" stroke="#25344d" stroke-width="6"/>
  <circle cx="610" cy="210" r="54" fill="#e8e4f5" stroke="#25344d" stroke-width="6"/>
  <text x="110" y="304" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" fill="#25344d">Input</text>
  <text x="610" y="304" text-anchor="middle" font-family="Arial, sans-serif" font-size="23" fill="#25344d">Output</text>
</svg>`;

function sanitizeSvg(markup: string) {
  if (typeof DOMParser === 'undefined') return markup;
  const document = new DOMParser().parseFromString(markup, 'image/svg+xml');
  if (
    document.querySelector('parsererror') ||
    document.documentElement.tagName !== 'svg'
  ) {
    throw new Error('Enter a valid SVG document.');
  }
  document
    .querySelectorAll('script, foreignObject')
    .forEach((node) => node.remove());
  document.querySelectorAll('*').forEach((node) => {
    for (const attribute of [...node.attributes]) {
      const value = attribute.value.trim().toLowerCase();
      if (
        attribute.name.toLowerCase().startsWith('on') ||
        value.startsWith('javascript:') ||
        (['href', 'xlink:href'].includes(attribute.name) &&
          /^https?:/.test(value))
      ) {
        node.removeAttribute(attribute.name);
      }
    }
  });
  return new XMLSerializer().serializeToString(document.documentElement);
}

function svgDataUrl(markup: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
}

export function SvgEditorWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [markup, setMarkup] = useState(STARTER_SVG);
  const validation = useMemo(() => {
    try {
      return { markup: sanitizeSvg(markup), error: null };
    } catch (nextError) {
      return {
        markup: null,
        error: nextError instanceof Error ? nextError.message : 'Invalid SVG',
      };
    }
  }, [markup]);
  const sanitizedMarkup = validation.markup;
  const error = validation.error;
  const previewUrl = sanitizedMarkup ? svgDataUrl(sanitizedMarkup) : null;

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
      toast.error('Choose an SVG file.');
      return;
    }
    void file.text().then((value) => {
      setMarkup(value);
      toast.success('SVG loaded into the editor.');
    });
  };

  const downloadSvg = () => {
    if (!sanitizedMarkup) return;
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(
      new Blob([sanitizedMarkup], { type: 'image/svg+xml' })
    );
    anchor.download = 'scientific-figure.svg';
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  const copySvg = () => {
    if (!sanitizedMarkup) return;
    void navigator.clipboard
      .writeText(sanitizedMarkup)
      .then(() => toast.success('SVG markup copied.'))
      .catch(() => toast.error('Unable to copy SVG markup.'));
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_16px_42px_rgba(30,38,47,0.08)]">
      <input
        ref={inputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="hidden"
        onChange={handleUpload}
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <PencilLine className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">SVG Editor</h2>
            <p className="text-xs text-slate-500">
              Edit markup, inspect the preview, and export safely.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            className="gap-2"
          >
            <FileUp className="size-4" />
            Open SVG
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copySvg}
            disabled={!sanitizedMarkup}
            className="gap-2"
          >
            <Clipboard className="size-4" />
            Copy
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={downloadSvg}
            disabled={!sanitizedMarkup}
            className="gap-2"
          >
            <Download className="size-4" />
            Export
          </Button>
        </div>
      </div>
      <div className="grid min-h-[470px] lg:grid-cols-2">
        <div className="border-b border-slate-200 p-4 lg:border-r lg:border-b-0">
          <label htmlFor="svg-markup" className="sr-only">
            SVG markup
          </label>
          <Textarea
            id="svg-markup"
            value={markup}
            onChange={(event) => setMarkup(event.target.value)}
            spellCheck={false}
            className="min-h-[400px] resize-none rounded-xl border-slate-200 bg-slate-950 p-4 font-mono text-xs leading-5 text-slate-100 shadow-none focus-visible:ring-slate-500"
          />
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
        <div className="flex min-w-0 flex-col p-5">
          <p className="text-sm font-semibold text-slate-900">Live preview</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Scripts and external references are removed before preview and
            export.
          </p>
          <div className="mt-5 flex min-h-80 flex-1 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[linear-gradient(45deg,#f8fafc_25%,transparent_25%),linear-gradient(-45deg,#f8fafc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f8fafc_75%),linear-gradient(-45deg,transparent_75%,#f8fafc_75%)] bg-[size:22px_22px] bg-[position:0_0,0_11px,11px_-11px,-11px_0px] p-5">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="SVG preview"
                className="max-h-[330px] max-w-full rounded-sm bg-white shadow-sm"
              />
            ) : (
              <p className="text-sm text-slate-400">
                Fix the markup to restore the preview.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
