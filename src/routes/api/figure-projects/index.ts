import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import {
  createProject,
  listProjects,
  type FigureProjectDraft,
  type FigureProjectSettings,
} from '@/modules/figure-projects/service';
import { respData, respErr } from '@/lib/resp';

const ASPECTS = new Set(['1:1', '4:3', '3:4', '16:9']);
const RESOLUTIONS = new Set(['1K', '2K', '4K']);
const QUALITIES = new Set(['low', 'medium', 'high']);
const STYLES = new Set(['flat', 'detailed']);

async function GET({ request }: { request: Request }) {
  try {
    const session = await getSession(request);
    const rawLimit = Number(
      new URL(request.url).searchParams.get('limit') ?? 12
    );
    const limit = Number.isInteger(rawLimit) ? rawLimit : 12;
    return respData(await listProjects({ userId: session.user.id, limit }));
  } catch (error) {
    return respErr(errorMessage(error));
  }
}

async function POST({ request }: { request: Request }) {
  try {
    const session = await getSession(request);
    const body = await request.json().catch(() => ({}));
    const draft = parseDraft(body);
    if (!draft) return respErr('Invalid figure project');
    return respData(await createProject({ userId: session.user.id, draft }));
  } catch (error) {
    return respErr(errorMessage(error));
  }
}

export const Route = createFileRoute('/api/figure-projects/')({
  server: { handlers: { GET, POST } },
});

export async function getSession(request: Request) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) throw new Error('Unauthorized');
  return session;
}

export function parseDraft(body: unknown): FigureProjectDraft | null {
  if (!isRecord(body)) return null;
  const prompt = cleanText(body.prompt, 12_000);
  if (prompt === null || !prompt) return null;
  const settings = parseSettings(body.settings);
  const referenceImages = parseReferenceImages(body.referenceImages);
  if (!settings || !referenceImages) return null;

  const requestedTitle = cleanText(body.title, 120);
  if (requestedTitle === null) return null;

  return {
    title: requestedTitle || titleFromPrompt(prompt),
    prompt,
    settings,
    referenceImages,
  };
}

export function parseSettings(value: unknown): FigureProjectSettings | null {
  if (!isRecord(value)) return null;
  const { aspect, resolution, quality, style } = value;
  if (
    typeof aspect !== 'string' ||
    typeof resolution !== 'string' ||
    typeof quality !== 'string' ||
    typeof style !== 'string' ||
    !ASPECTS.has(aspect) ||
    !RESOLUTIONS.has(resolution) ||
    !QUALITIES.has(quality) ||
    !STYLES.has(style)
  ) {
    return null;
  }
  return {
    aspect: aspect as FigureProjectSettings['aspect'],
    resolution: resolution as FigureProjectSettings['resolution'],
    quality: quality as FigureProjectSettings['quality'],
    style: style as FigureProjectSettings['style'],
  };
}

export function parseReferenceImages(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length > 16) return null;
  const urls: string[] = [];
  for (const item of value) {
    if (typeof item !== 'string' || item.length > 2_048) return null;
    try {
      const url = new URL(item);
      if (!['http:', 'https:'].includes(url.protocol)) return null;
      urls.push(url.toString());
    } catch {
      return null;
    }
  }
  return urls;
}

export function cleanText(value: unknown, maxLength: number): string | null {
  if (value === undefined) return '';
  if (typeof value !== 'string') return null;
  const cleaned = value.trim();
  return cleaned.length <= maxLength ? cleaned : null;
}

function titleFromPrompt(prompt: string) {
  const normalized = prompt.replace(/\s+/g, ' ').trim();
  return normalized.slice(0, 60) || 'Untitled figure';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal error';
}
