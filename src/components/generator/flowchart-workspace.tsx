import { useMemo, useState } from 'react';
import { Download, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type FlowNode = {
  id: string;
  label: string;
};

const DEFAULT_FLOW =
  'Research question -> Experimental design -> Data collection -> Analysis -> Publication';

function createNodes(source: string): FlowNode[] {
  const labels = source
    .split(/->|→|\n/)
    .map((label) => label.trim())
    .filter(Boolean)
    .slice(0, 10);
  return labels.length
    ? labels.map((label, index) => ({ id: `${index}-${label}`, label }))
    : [{ id: 'start', label: 'Start' }];
}

export function FlowchartWorkspace() {
  const [source, setSource] = useState(DEFAULT_FLOW);
  const [nodes, setNodes] = useState(() => createNodes(DEFAULT_FLOW));
  const [newStep, setNewStep] = useState('');
  const canvasWidth = Math.max(720, nodes.length * 184 + 40);

  const svgMarkup = useMemo(
    () => flowSvg(nodes, canvasWidth),
    [canvasWidth, nodes]
  );

  const buildFlow = () => {
    const nextNodes = createNodes(source);
    setNodes(nextNodes);
    toast.success('Flowchart updated');
  };

  const addStep = () => {
    const label = newStep.trim();
    if (!label) return;
    setNodes((current) => [
      ...current,
      { id: `${Date.now()}-${label}`, label },
    ]);
    setNewStep('');
  };

  const downloadSvg = () => {
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scientific-flowchart.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_12px_rgba(30,38,47,0.06)]">
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b border-slate-200 p-5 lg:border-r lg:border-b-0">
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
            Flowchart builder
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            Turn a sequence into an editable diagram
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Write steps with “→” or a new line. Each step becomes an editable
            node, ready to export as SVG.
          </p>
          <Textarea
            value={source}
            onChange={(event) => setSource(event.target.value)}
            rows={6}
            className="mt-5 resize-none border-slate-200 bg-slate-50 text-sm shadow-none focus-visible:bg-white"
            aria-label="Flowchart steps"
          />
          <Button
            type="button"
            onClick={buildFlow}
            className="mt-3 w-full gap-2"
          >
            <RefreshCw className="size-4" />
            Build flowchart
          </Button>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-sm font-semibold text-slate-800">Edit steps</p>
            <div className="mt-3 space-y-2">
              {nodes.map((node, index) => (
                <div key={node.id} className="flex items-center gap-2">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                    {index + 1}
                  </span>
                  <Input
                    value={node.label}
                    onChange={(event) =>
                      setNodes((current) =>
                        current.map((item) =>
                          item.id === node.id
                            ? { ...item, label: event.target.value }
                            : item
                        )
                      )
                    }
                    className="h-9 border-slate-200 text-sm shadow-none"
                    aria-label={`Flowchart step ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNodes((current) =>
                        current.filter((item) => item.id !== node.id)
                      )
                    }
                    disabled={nodes.length === 1}
                    className="grid size-8 place-items-center rounded-md text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-35"
                    aria-label={`Remove ${node.label}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2 pt-1">
                <Input
                  value={newStep}
                  onChange={(event) => setNewStep(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      addStep();
                    }
                  }}
                  placeholder="Add a step"
                  className="h-9 border-dashed text-sm shadow-none"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addStep}
                  aria-label="Add flowchart step"
                >
                  <Plus className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="min-w-0 bg-[#f8fafc] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Live canvas
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {nodes.length} steps
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadSvg}
              className="gap-1.5"
            >
              <Download className="size-3.5" />
              SVG
            </Button>
          </div>
          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div dangerouslySetInnerHTML={{ __html: svgMarkup }} />
          </div>
        </div>
      </div>
    </section>
  );
}

function flowSvg(nodes: FlowNode[], width: number) {
  const escape = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  const boxes = nodes
    .map((node, index) => {
      const x = 20 + index * 184;
      const label = escape(node.label);
      const arrow =
        index < nodes.length - 1
          ? `<path d="M ${x + 144} 83 H ${x + 172}" stroke="#94a3b8" stroke-width="2" marker-end="url(#arrow)"/>`
          : '';
      return `<g>${arrow}<rect x="${x}" y="48" width="144" height="70" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><text x="${x + 72}" y="78" text-anchor="middle" font-family="Inter, sans-serif" font-size="12" font-weight="600" fill="#0f172a">${label.slice(0, 23)}</text><text x="${x + 72}" y="98" text-anchor="middle" font-family="Inter, sans-serif" font-size="10" fill="#64748b">Step ${index + 1}</text></g>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="166" viewBox="0 0 ${width} 166" role="img" aria-label="Scientific flowchart"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#94a3b8"/></marker></defs><text x="20" y="24" font-family="Inter, sans-serif" font-size="11" font-weight="700" fill="#475569" letter-spacing="1.3">WORKFLOW</text>${boxes}</svg>`;
}
