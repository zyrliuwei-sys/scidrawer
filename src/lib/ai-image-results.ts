/**
 * Extract generated image URLs from both the current normalized task result
 * and the older provider response shapes persisted before normalization was
 * introduced. Keeping this parser shared means history rows and their preview
 * endpoint always agree on the image index.
 */
export function extractStoredImageUrls(
  taskResult: string | null | undefined
): string[] {
  const stored = parseJsonValue(taskResult);
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) return [];

  const record = stored as Record<string, unknown>;
  const normalized = imageUrlsFromNormalizedTaskInfo(record.taskInfo);
  if (normalized.length > 0) return normalized;

  const providerTask = asRecord(record.taskResult);
  return imageUrlsFromProviderResult(
    providerTask?.results ??
      providerTask?.result_data ??
      record.results ??
      record.result_data
  );
}

function imageUrlsFromNormalizedTaskInfo(value: unknown): string[] {
  const taskInfo = asRecord(value);
  if (!taskInfo || !Array.isArray(taskInfo.images)) return [];

  return taskInfo.images.flatMap((image) => {
    const url = asRecord(image)?.imageUrl;
    return isHttpUrl(url) ? [url.trim()] : [];
  });
}

function imageUrlsFromProviderResult(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    const record = asRecord(item);
    const url =
      typeof item === 'string'
        ? item
        : (record?.url ?? record?.image_url ?? record?.imageUrl);
    return isHttpUrl(url) ? [url.trim()] : [];
  });
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function parseJsonValue(value: string | null | undefined): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function isHttpUrl(value: unknown): value is string {
  return typeof value === 'string' && /^https?:\/\//i.test(value.trim());
}
