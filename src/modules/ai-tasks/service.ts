import { and, count, desc, eq, inArray, isNull } from 'drizzle-orm';

import { AIMediaType } from '@/core/ai/types';
import { db } from '@/core/db';
import { aiTask, user } from '@/config/db/schema.postgres';
import { consume, revoke } from '@/modules/credits/service';
import { getUuid } from '@/lib/hash';

export enum AITaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELED = 'canceled',
}

/**
 * Create an AI task with optional credit consumption.
 */
export async function createTask(params: {
  userId: string;
  mediaType: string;
  provider: string;
  model: string;
  prompt: string;
  costCredits?: number;
  options?: any;
}): Promise<any> {
  const { userId, mediaType, provider, model, prompt, costCredits, options } =
    params;

  return db().transaction(async (tx: any) => {
    // The first image task that reaches the provider is a one-time welcome
    // generation. Failed/cancelled attempts do not consume that benefit, so a
    // new user is not charged for an upstream outage.
    let welcomeGeneration = false;
    if (mediaType === AIMediaType.IMAGE && costCredits && costCredits > 0) {
      // Serialize the entitlement check per user. PostgreSQL/MySQL honor the
      // row lock; SQLite serializes writes within a transaction.
      const userLockQuery = tx
        .select({ id: user.id })
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);
      await (userLockQuery.for ? userLockQuery.for('update') : userLockQuery);
      welcomeGeneration =
        (await hasUsedWelcomeImageGeneration(tx, userId)) === false;
    }
    const effectiveCostCredits = welcomeGeneration ? 0 : (costCredits ?? 0);

    // 1. Insert task
    const taskData: any = {
      id: getUuid(),
      userId,
      mediaType,
      provider,
      model,
      prompt,
      options: options ? JSON.stringify(options) : null,
      status: AITaskStatus.PENDING,
      costCredits: effectiveCostCredits,
      taskInfo: welcomeGeneration
        ? JSON.stringify({ welcomeImageGeneration: true })
        : null,
    };

    const [task] = await tx.insert(aiTask).values(taskData).returning();

    // 2. Consume credits if cost > 0
    if (effectiveCostCredits > 0) {
      const result = await consume({
        userId,
        credits: effectiveCostCredits,
        scene: 'ai_task',
        description: `AI ${mediaType} generation`,
        metadata: JSON.stringify({ taskId: task.id }),
        tx,
      });

      if (!result.success) {
        throw new Error('Insufficient credits');
      }

      // Store consumed credit ID for potential revocation
      if (result.consumedCredit) {
        await tx
          .update(aiTask)
          .set({
            taskInfo: JSON.stringify({ creditId: result.consumedCredit.id }),
          })
          .where(eq(aiTask.id, task.id));
      }
    }

    return { ...task, welcomeGeneration };
  });
}

/**
 * A pending, processing, or successful image task means the welcome image
 * has already been claimed. Keeping failed/cancelled tasks out of this check
 * makes the free first result resilient to provider failures.
 */
async function hasUsedWelcomeImageGeneration(tx: any, userId: string) {
  const [result] = await tx
    .select({ total: count() })
    .from(aiTask)
    .where(
      and(
        eq(aiTask.userId, userId),
        eq(aiTask.mediaType, AIMediaType.IMAGE),
        inArray(aiTask.status, [
          AITaskStatus.PENDING,
          AITaskStatus.PROCESSING,
          AITaskStatus.SUCCESS,
        ]),
        isNull(aiTask.deletedAt)
      )
    );

  return Number(result?.total ?? 0) > 0;
}

/**
 * Whether the user has already claimed the one-time welcome image. Exposed so
 * the generate workspace can tell — before any submit — that the next click
 * is doomed and the paywall should open without a request round trip.
 */
export async function hasUserUsedWelcomeImageGeneration(userId: string) {
  return hasUsedWelcomeImageGeneration(db(), userId);
}

/**
 * Attach the provider-owned asynchronous task ID after a generation request
 * has been accepted. The database task ID remains the stable ID exposed to
 * the browser, while the provider ID is kept server-side for polling.
 */
export async function attachProviderTask(params: {
  taskId: string;
  providerTaskId: string;
  taskResult?: unknown;
}) {
  const updateData: { taskId: string; taskResult?: string } = {
    taskId: params.providerTaskId,
  };
  if (params.taskResult !== undefined) {
    updateData.taskResult = JSON.stringify(params.taskResult);
  }

  await db().update(aiTask).set(updateData).where(eq(aiTask.id, params.taskId));
}

/**
 * Update task status. Revokes credits on failure.
 */
export async function updateTask(params: {
  taskId: string;
  status: AITaskStatus;
  taskResult?: any;
}) {
  const { taskId, status, taskResult } = params;

  const [task] = await db()
    .select()
    .from(aiTask)
    .where(eq(aiTask.id, taskId))
    .limit(1);

  if (!task) throw new Error('Task not found');

  // Update task
  const updateData: any = { status };
  if (taskResult) {
    updateData.taskResult = JSON.stringify(taskResult);
  }

  await db().update(aiTask).set(updateData).where(eq(aiTask.id, taskId));

  // Revoke credits on failure
  if (status === AITaskStatus.FAILED && task.taskInfo) {
    try {
      const info = JSON.parse(task.taskInfo as string);
      if (info.creditId) {
        await revoke(info.creditId);
      }
    } catch {
      // Ignore parse errors
    }
  }
}

/**
 * Get tasks for a user.
 */
export async function getTasks(params: {
  userId: string;
  mediaType?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const { userId, mediaType, status, page = 1, limit = 20 } = params;

  return db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.userId, userId),
        mediaType ? eq(aiTask.mediaType, mediaType) : undefined,
        status ? eq(aiTask.status, status) : undefined,
        isNull(aiTask.deletedAt)
      )
    )
    .orderBy(desc(aiTask.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);
}

/**
 * Find task by ID.
 */
export async function findTask(taskId: string) {
  const [result] = await db()
    .select()
    .from(aiTask)
    .where(eq(aiTask.id, taskId))
    .limit(1);
  return result;
}
