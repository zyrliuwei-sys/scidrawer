/**
 * Single-lane task queue. Tasks run one at a time in submission order; later
 * tasks wait for the previous one to settle (resolve or reject) before they
 * start. The chain keeps moving even if a task throws, so one failed task
 * never blocks the rest of the queue.
 *
 * Use this to serialize calls to a third-party API that can't handle
 * concurrent traffic (rate limits, shared state, etc.).
 */
export class TaskQueue {
  private chain: Promise<unknown> = Promise.resolve();

  enqueue<T>(task: () => Promise<T>): Promise<T> {
    const next = this.chain.then(() => task());
    // Swallow the error so a single failure doesn't poison the chain — the
    // caller's `await` still receives the rejection from `next` itself.
    this.chain = next.catch(() => undefined);
    return next;
  }
}

export const imageQueue = new TaskQueue();
export const videoQueue = new TaskQueue();
