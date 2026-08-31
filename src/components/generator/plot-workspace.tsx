import { useMemo, useState, type ReactNode } from 'react';
import {
  BarChart3,
  Download,
  LineChart as LineChartIcon,
  RefreshCw,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type PlotKind = 'line' | 'bar';

const SAMPLE_DATA = `Time (h),Control,Treatment
0,1.0,1.0
4,1.1,1.8
8,1.2,3.1
12,1.3,4.7
24,1.4,6.2`;

type PlotData = {
  xKey: string;
  series: string[];
  rows: Array<Record<string, string | number>>;
};

function parseCsv(value: string): PlotData | null {
  const lines = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return null;
  const headers = lines[0].split(',').map((header) => header.trim());
  if (headers.length < 2 || headers.some((header) => !header)) return null;
  const rows = lines.slice(1).flatMap((line) => {
    const cells = line.split(',').map((cell) => cell.trim());
    if (cells.length !== headers.length) return [];
    return [
      Object.fromEntries(
        headers.map((header, index) => {
          const raw = cells[index];
          const number = Number(raw);
          return [header, raw !== '' && Number.isFinite(number) ? number : raw];
        })
      ),
    ];
  });
  return rows.length
    ? { xKey: headers[0], series: headers.slice(1), rows }
    : null;
}

export function PlotWorkspace() {
  const [csv, setCsv] = useState(SAMPLE_DATA);
  const [appliedCsv, setAppliedCsv] = useState(SAMPLE_DATA);
  const [kind, setKind] = useState<PlotKind>('line');
  const data = useMemo(() => parseCsv(appliedCsv), [appliedCsv]);

  const renderPlot = () => {
    if (!parseCsv(csv)) {
      toast.error('Use a header row and at least one numeric data column.');
      return;
    }
    setAppliedCsv(csv);
    toast.success('Plot updated');
  };

  const downloadCsv = () => {
    const blob = new Blob([appliedCsv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scientific-plot-data.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_2px_12px_rgba(30,38,47,0.06)]">
      <div className="grid gap-0 lg:grid-cols-[0.84fr_1.16fr]">
        <div className="border-b border-slate-200 p-5 lg:border-r lg:border-b-0">
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 uppercase">
            Data plotter
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
            Paste CSV, get a publication-ready plot
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            The first column is the x-axis; remaining numeric columns become
            series.
          </p>
          <Textarea
            value={csv}
            onChange={(event) => setCsv(event.target.value)}
            rows={10}
            spellCheck={false}
            className="mt-5 resize-none border-slate-200 bg-slate-50 font-mono text-xs leading-5 shadow-none focus-visible:bg-white"
            aria-label="CSV plot data"
          />
          <div className="mt-3 flex gap-2">
            <Button type="button" onClick={renderPlot} className="flex-1 gap-2">
              <RefreshCw className="size-4" />
              Render plot
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setCsv(SAMPLE_DATA)}
            >
              Sample
            </Button>
          </div>
        </div>

        <div className="min-w-0 bg-[#f8fafc] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Live plot</p>
              <p className="mt-0.5 text-xs text-slate-500">
                {data
                  ? `${data.rows.length} observations · ${data.series.length} series`
                  : 'Waiting for data'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
                <PlotButton
                  active={kind === 'line'}
                  label="Line"
                  icon={<LineChartIcon className="size-3.5" />}
                  onClick={() => setKind('line')}
                />
                <PlotButton
                  active={kind === 'bar'}
                  label="Bar"
                  icon={<BarChart3 className="size-3.5" />}
                  onClick={() => setKind('bar')}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadCsv}
                className="gap-1.5"
              >
                <Download className="size-3.5" />
                CSV
              </Button>
            </div>
          </div>
          <div className="mt-4 h-[330px] rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            {data ? <ScientificChart data={data} kind={kind} /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlotButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors',
        active ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'
      )}
      aria-pressed={active}
    >
      {icon}
      {label}
    </button>
  );
}

function ScientificChart({ data, kind }: { data: PlotData; kind: PlotKind }) {
  const colors = ['#0f766e', '#4f46e5', '#d97706', '#db2777'];
  const shared = (
    <>
      <CartesianGrid vertical={false} stroke="#e2e8f0" />
      <XAxis
        dataKey={data.xKey}
        tickLine={false}
        axisLine={false}
        tick={{ fill: '#64748b', fontSize: 11 }}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        tick={{ fill: '#64748b', fontSize: 11 }}
      />
      <Tooltip
        contentStyle={{
          borderRadius: 10,
          borderColor: '#e2e8f0',
          fontSize: 12,
        }}
      />
      <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
    </>
  );
  return (
    <ResponsiveContainer width="100%" height="100%">
      {kind === 'line' ? (
        <LineChart
          data={data.rows}
          margin={{ top: 8, right: 8, bottom: 0, left: -14 }}
        >
          {shared}
          {data.series.map((series, index) => (
            <Line
              key={series}
              type="monotone"
              dataKey={series}
              stroke={colors[index % colors.length]}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      ) : (
        <BarChart
          data={data.rows}
          margin={{ top: 8, right: 8, bottom: 0, left: -14 }}
        >
          {shared}
          {data.series.map((series, index) => (
            <Bar
              key={series}
              dataKey={series}
              fill={colors[index % colors.length]}
              radius={[5, 5, 0, 0]}
            />
          ))}
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}
