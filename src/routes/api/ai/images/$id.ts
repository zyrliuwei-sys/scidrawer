import { createFileRoute } from '@tanstack/react-router';

import { AIMediaType, AITaskStatus } from '@/core/ai/types';
import { getAuth } from '@/core/auth';
import { findTask, updateTask } from '@/modules/ai-tasks/service';
import { extractStoredImageUrls } from '@/lib/ai-image-results';
import { respData, respErr } from '@/lib/resp';

import {
  createEvolinkProvider,
  readEstimatedTime,
  readEvolinkStatus,
  readProgress,
} from '../images';

type StoredResult = {
  taskInfo?: {
    images?: Array<{ imageUrl?: string }>;
    errorMessage?: string;
  };
  taskResult?: unknown;
  error?: string;
};

async function GET({
  request,
  params,
}: {
  request: Request;
  params: { id: string };
}) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const task = await findTask(params.id);
    if (
      !task ||
      task.userId !== session.user.id ||
      task.provider !== 'evolink'
    ) {
      return respErr('Image task not found');
    }

    if (
      task.status === AITaskStatus.SUCCESS ||
      task.status === AITaskStatus.FAILED ||
      task.status === AITaskStatus.CANCELED
    ) {
      return respData(toPublicTask(task));
    }
    if (!task.taskId) return respErr('Image task is missing its provider ID');

    const provider = await createEvolinkProvider();
    const result = await provider.query({
      taskId: task.taskId,
      mediaType: AIMediaType.IMAGE,
    });
    await updateTask({
      taskId: task.id,
      status: result.taskStatus,
      taskResult: result,
    });

    return respData({
      id: task.id,
      providerTaskId: task.taskId,
      status: readEvolinkStatus(result.taskResult, result.taskStatus),
      taskStatus: result.taskStatus,
      progress: readProgress(result.taskResult),
      estimatedTime: readEstimatedTime(result.taskResult),
      // EvoLink returns generated links in `results`. Keep that field name
      // through to the frontend rather than inventing an app-specific shape.
      results: result.taskInfo?.images
        ?.map((image) => image.imageUrl)
        .filter((url): url is string => Boolean(url)),
      error: result.taskInfo?.errorMessage || undefined,
    });
  } catch (error) {
    console.error('EvoLink image task query failed:', error);
    return respErr(
      error instanceof Error ? error.message : 'Image task query failed'
    );
  }
}

function toPublicTask(task: Awaited<ReturnType<typeof findTask>>) {
  const stored = parseStoredResult(task?.taskResult);
  const upstream = stored.taskResult ?? stored;
  return {
    id: task?.id,
    providerTaskId: task?.taskId,
    status: readEvolinkStatus(upstream, task?.status || 'pending'),
    taskStatus: task?.status,
    progress: readProgress(upstream),
    estimatedTime: readEstimatedTime(upstream),
    results: extractStoredImageUrls(task?.taskResult),
    error: stored.taskInfo?.errorMessage || stored.error || undefined,
  };
}

function parseStoredResult(value: string | null | undefined): StoredResult {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value) as StoredResult;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export const Route = createFileRoute('/api/ai/images/$id')({
  server: { handlers: { GET } },
});
