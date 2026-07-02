class InMemoryGenerationQueue {
  private chain = Promise.resolve();

  enqueue<T>(task: () => Promise<T>) {
    const run = this.chain.then(task, task);
    this.chain = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }
}

const globalForQueue = globalThis as unknown as { cricketGenerationQueue?: InMemoryGenerationQueue };

/**
 * Lightweight in-memory queue for local/server-instance generation throttling.
 * It prevents accidental parallel provider calls in a single runtime instance.
 * Production deployments can replace this module with a durable queue.
 */
export const generationQueue = globalForQueue.cricketGenerationQueue ?? new InMemoryGenerationQueue();

if (process.env.NODE_ENV !== "production") {
  globalForQueue.cricketGenerationQueue = generationQueue;
}
