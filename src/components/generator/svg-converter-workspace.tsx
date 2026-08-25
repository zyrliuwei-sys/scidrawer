import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Download, ImageUp, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ACCEPTED_IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/bmp',
]);

type TraceResult = {
  markup: string;
  width: number;
  height: number;
};

function traceImageToSvg(
  image: HTMLImageElement,
  detail: number,
  threshold: number
): TraceResult {
  const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
  const scale = Math.min(1, detail / longestSide);
  const sampledWidth = Math.max(1, Math.round(image.naturalWidth * scale));
  const sampledHeight = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = sampledWidth;
  canvas.height = sampledHeight;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas is not available in this browser.');

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, sampledWidth, sampledHeight);
  context.drawImage(image, 0, 0, sampledWidth, sampledHeight);
  const pixels = context.getImageData(0, 0, sampledWidth, sampledHeight).data;
  const paths: string[] = [];

  for (let y = 0; y < sampledHeight; y += 1) {
    let x = 0;
    while (x < sampledWidth) {
      const index = (y * sampledWidth + x) * 4;
      const alpha = pixels[index + 3] / 255;
      const luminance =
        (0.2126 * pixels[index] +
          0.7152 * pixels[index + 1] +
          0.0722 * pixels[index + 2]) *
          alpha +
        255 * (1 - alpha);
      if (luminance > threshold) {
        x += 1;
        continue;
      }

      const start = x;
      x += 1;
      while (x < sampledWidth) {
        const nextIndex = (y * sampledWidth + x) * 4;
        const nextAlpha = pixels[nextIndex + 3] / 255;
        const nextLuminance =
          (0.2126 * pixels[nextIndex] +
            0.7152 * pixels[nextIndex + 1] +
            0.0722 * pixels[nextIndex + 2]) *
            nextAlpha +
          255 * (1 - nextAlpha);
        if (nextLuminance > threshold) break;
        x += 1;
      }
      paths.push(`M${start} ${y}h${x - start}v1H${start}Z`);
    }
  }

  const viewBox = `0 0 ${sampledWidth} ${sampledHeight}`;
  const markup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${image.naturalWidth}" height="${image.naturalHeight}" role="img"><rect width="100%" height="100%" fill="#ffffff"/><path d="${paths.join('')}" fill="#142033"/></svg>`;

  return {
    markup,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
}

function svgDataUrl(markup: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
}

export function SvgConverterWorkspace() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [detail, setDetail] = useState(96);
  const [threshold, setThreshold] = useState(168);
  const [result, setResult] = useState<TraceResult | null>(null);
  const [isTracing, setIsTracing] = useState(false);
  const previewUrl = useMemo(
    () => (result ? svgDataUrl(result.markup) : null),
    [result]
  );

  const convertFile = (file: File) => {
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      toast.error('Use a PNG, JPG, WebP, or BMP image.');
      return;
    }

    const reader = new FileReader();
    setIsTracing(true);
    reader.onerror = () => {
      setIsTracing(false);
      toast.error('The image could not be read.');
    };
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => {
        setIsTracing(false);
        toast.error('The image could not be decoded.');
      };
      image.onload = () => {
        try {
          setResult(traceImageToSvg(image, detail, threshold));
          setSourceName(file.name);
          toast.success('SVG trace is ready to download or edit.');
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : 'Could not trace image.'
          );
        } finally {
          setIsTracing(false);
        }
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) convertFile(file);
  };

  const downloadResult = () => {
    if (!result) return;
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(
      new Blob([result.markup], { type: 'image/svg+xml' })
    );
    anchor.download = `${sourceName?.replace(/\.[^.]+$/, '') || 'figure-trace'}.svg`;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_16px_42px_rgba(30,38,47,0.08)]">
      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.bmp,image/png,image/jpeg,image/webp,image/bmp"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="grid min-h-[435px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col border-b border-slate-200 p-6 lg:border-r lg:border-b-0">
          <div>
            <div className="inline-flex size-9 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Sparkles className="size-4" />
            </div>
            <h2 className="mt-4 text-lg font-semibold tracking-tight text-slate-900">
              Image to SVG trace
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Turn a high-contrast raster into editable vector paths, then
              refine the result in SVG Editor.
            </p>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isTracing}
            className="mt-6 flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 text-center transition-colors hover:border-slate-500 hover:bg-slate-100 disabled:cursor-wait"
          >
            <span className="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
              <ImageUp className="size-5" />
            </span>
            <span className="mt-3 text-sm font-medium text-slate-800">
              {isTracing ? 'Tracing image…' : 'Choose an image to trace'}
            </span>
            <span className="mt-1 text-xs text-slate-500">
              PNG, JPG, WebP, or BMP
            </span>
          </button>

          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Detail{' '}
              <span className="float-right text-slate-400">{detail}px</span>
              <Input
                type="range"
                min="48"
                max="160"
                step="8"
                value={detail}
                onChange={(event) => setDetail(Number(event.target.value))}
                className="mt-2 h-2 cursor-pointer border-0 p-0 accent-slate-900"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Dark-pixel threshold
              <span className="float-right text-slate-400">{threshold}</span>
              <Input
                type="range"
                min="48"
                max="230"
                value={threshold}
                onChange={(event) => setThreshold(Number(event.target.value))}
                className="mt-2 h-2 cursor-pointer border-0 p-0 accent-slate-900"
              />
            </label>
            <p className="text-xs leading-5 text-slate-400">
              These settings apply the next time you choose an image.
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                SVG preview
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {result
                  ? `${result.width} × ${result.height} · editable paths`
                  : 'Your trace will appear here'}
              </p>
            </div>
            {result && (
              <Button
                type="button"
                size="sm"
                onClick={downloadResult}
                className="gap-2"
              >
                <Download className="size-4" />
                Download SVG
              </Button>
            )}
          </div>
          <div className="mt-5 flex min-h-70 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(circle_at_center,_#ffffff,_#f8fafc)] p-5">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Generated SVG trace"
                className="max-h-[310px] max-w-full object-contain"
              />
            ) : (
              <div className="max-w-56 text-center">
                <RefreshCw className="mx-auto size-7 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-500">
                  No trace yet
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Upload a high-contrast figure, chart, or line drawing to
                  create SVG paths.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
