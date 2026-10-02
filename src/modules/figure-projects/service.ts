import { and, desc, eq, isNull } from 'drizzle-orm';

import { db } from '@/core/db';
import {
  aiTask,
  figureProject,
  type FigureProject,
  type NewFigureProject,
} from '@/config/db/schema.postgres';
import { extractStoredImageUrls } from '@/lib/ai-image-results';
import { getUuid } from '@/lib/hash';

export type FigureProjectSettings = {
  aspect: '1:1' | '4:3' | '3:4' | '16:9';
  resolution: '1K' | '2K' | '4K';
  quality: 'low' | 'medium' | 'high';
  style: 'flat' | 'detailed';
};

export type FigureProjectDraft = {
  title: string;
  prompt: string;
  settings: FigureProjectSettings;
  referenceImages: string[];
};

export type FigureProjectListItem = FigureProject & {
  latestImageUrl: string | null;
};

/** Persist the editable context for one scientific figure. */
export async function createProject(params: {
  userId: string;
  draft: FigureProjectDraft;
}): Promise<FigureProject> {
  const now = new Date();
  const values: NewFigureProject = {
    id: getUuid(),
    userId: params.userId,
    title: params.draft.title,
    mode: 'illustration',
    prompt: params.draft.prompt,
    settings: JSON.stringify(params.draft.settings),
    referenceImages: JSON.stringify(params.draft.referenceImages),
    createdAt: now,
    updatedAt: now,
  };
  const [project] = await db().insert(figureProject).values(values).returning();
  return project;
}

/** List a user's active projects, newest activity first. */
export async function listProjects(params: {
  userId: string;
  limit?: number;
}): Promise<FigureProjectListItem[]> {
  const rows = await db()
    .select({ project: figureProject, taskResult: aiTask.taskResult })
    .from(figureProject)
    .leftJoin(aiTask, eq(figureProject.latestTaskId, aiTask.id))
    .where(
      and(
        eq(figureProject.userId, params.userId),
        isNull(figureProject.deletedAt)
      )
    )
    .orderBy(desc(figureProject.updatedAt))
    .limit(Math.min(Math.max(params.limit ?? 12, 1), 48));

  return rows.map(({ project, taskResult }) => ({
    ...project,
    latestImageUrl: extractStoredImageUrls(taskResult)[0] ?? null,
  }));
}

/** Return a project only when it belongs to the signed-in user. */
export async function getOwnedProject(params: {
  userId: string;
  id: string;
}): Promise<FigureProject | undefined> {
  const [project] = await db()
    .select()
    .from(figureProject)
    .where(
      and(
        eq(figureProject.id, params.id),
        eq(figureProject.userId, params.userId),
        isNull(figureProject.deletedAt)
      )
    )
    .limit(1);
  return project;
}

/** Update a project's editable brief. */
export async function updateProject(params: {
  userId: string;
  id: string;
  draft: Partial<FigureProjectDraft>;
}): Promise<FigureProject | undefined> {
  const update: Partial<NewFigureProject> = { updatedAt: new Date() };
  if (params.draft.title !== undefined) update.title = params.draft.title;
  if (params.draft.prompt !== undefined) update.prompt = params.draft.prompt;
  if (params.draft.settings !== undefined) {
    update.settings = JSON.stringify(params.draft.settings);
  }
  if (params.draft.referenceImages !== undefined) {
    update.referenceImages = JSON.stringify(params.draft.referenceImages);
  }

  const [project] = await db()
    .update(figureProject)
    .set(update)
    .where(
      and(
        eq(figureProject.id, params.id),
        eq(figureProject.userId, params.userId),
        isNull(figureProject.deletedAt)
      )
    )
    .returning();
  return project;
}

/**
 * Attach a task only if it belongs to the same user. This prevents a guessed
 * task ID from exposing another user's generated asset through a project.
 */
export async function setLatestTask(params: {
  userId: string;
  id: string;
  taskId: string;
}): Promise<FigureProject | undefined> {
  const [task] = await db()
    .select({ id: aiTask.id })
    .from(aiTask)
    .where(and(eq(aiTask.id, params.taskId), eq(aiTask.userId, params.userId)))
    .limit(1);
  if (!task) throw new Error('Generation task not found');

  const [project] = await db()
    .update(figureProject)
    .set({ latestTaskId: task.id, updatedAt: new Date() })
    .where(
      and(
        eq(figureProject.id, params.id),
        eq(figureProject.userId, params.userId),
        isNull(figureProject.deletedAt)
      )
    )
    .returning();
  return project;
}

/** Soft-delete a user's own project. */
export async function removeProject(params: { userId: string; id: string }) {
  await db()
    .update(figureProject)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(figureProject.id, params.id),
        eq(figureProject.userId, params.userId),
        isNull(figureProject.deletedAt)
      )
    );
}
