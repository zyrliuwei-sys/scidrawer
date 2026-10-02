import { createFileRoute } from '@tanstack/react-router';

import {
  getOwnedProject,
  removeProject,
  setLatestTask,
  updateProject,
  type FigureProjectDraft,
} from '@/modules/figure-projects/service';
import { respData, respErr, respOk } from '@/lib/resp';

import {
  cleanText,
  getSession,
  parseReferenceImages,
  parseSettings,
} from './index';

async function GET({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    const session = await getSession(request);
    const project = await getOwnedProject({
      userId: session.user.id,
      id: params.id,
    });
    if (!project) return respErr('Figure project not found');
    return respData(project);
  } catch (error) {
    return respErr(errorMessage(error));
  }
}

async function PATCH({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    const session = await getSession(request);
    const body = await request.json().catch(() => ({}));
    if (!isRecord(body)) return respErr('Invalid figure project');

    if ('latestTaskId' in body) {
      if (
        typeof body.latestTaskId !== 'string' ||
        body.latestTaskId.length > 160
      ) {
        return respErr('Invalid generation task');
      }
      const project = await setLatestTask({
        userId: session.user.id,
        id: params.id,
        taskId: body.latestTaskId,
      });
      if (!project) return respErr('Figure project not found');
      return respData(project);
    }

    const draft = parsePartialDraft(body);
    if (!draft) return respErr('Invalid figure project');
    const project = await updateProject({
      userId: session.user.id,
      id: params.id,
      draft,
    });
    if (!project) return respErr('Figure project not found');
    return respData(project);
  } catch (error) {
    return respErr(errorMessage(error));
  }
}

async function DELETE({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    const session = await getSession(request);
    await removeProject({ userId: session.user.id, id: params.id });
    return respOk();
  } catch (error) {
    return respErr(errorMessage(error));
  }
}

export const Route = createFileRoute('/api/figure-projects/$id')({
  server: { handlers: { GET, PATCH, DELETE } },
});

function parsePartialDraft(
  value: Record<string, unknown>
): Partial<FigureProjectDraft> | null {
  const draft: Partial<FigureProjectDraft> = {};
  if ('title' in value) {
    const title = cleanText(value.title, 120);
    if (title === null || !title) return null;
    draft.title = title;
  }
  if ('prompt' in value) {
    const prompt = cleanText(value.prompt, 12_000);
    if (prompt === null || !prompt) return null;
    draft.prompt = prompt;
  }
  if ('settings' in value) {
    const settings = parseSettings(value.settings);
    if (!settings) return null;
    draft.settings = settings;
  }
  if ('referenceImages' in value) {
    const referenceImages = parseReferenceImages(value.referenceImages);
    if (!referenceImages) return null;
    draft.referenceImages = referenceImages;
  }
  return Object.keys(draft).length ? draft : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Internal error';
}
