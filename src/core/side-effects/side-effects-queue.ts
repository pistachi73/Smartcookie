import { randomUUID } from "crypto";

import type {
  CoalesceConfig,
  JobHandler,
  SideEffectJob,
  SideEffectPayloadMap,
} from "./side-effects-types";

export class SideEffectQueue {
  private queue: SideEffectJob[] = [];
  private handlers: Partial<{
    [K in keyof SideEffectPayloadMap]: JobHandler<K>;
  }> = {};
  private processing = false;
  private maxQueueSize = 100;

  // coalesce config per side effect type
  private coalesceConfigs: Partial<{
    [K in keyof SideEffectPayloadMap]: CoalesceConfig<K>;
  }> = {};

  /**
   * Register a handler for a side effect type
   */
  registerHandler<K extends keyof SideEffectPayloadMap>(
    type: K,
    handler: JobHandler<K>,
  ) {
    this.handlers[type] = handler as any;
  }

  /**
   * Configure coalescing for a job type.
   * Jobs of this type will be collapsed per entityKey in the given window.
   */
  configureCoalesce<K extends keyof SideEffectPayloadMap>(
    type: K,
    windowMs: number,
    keyFn: (payload: SideEffectPayloadMap[K]) => string,
  ) {
    this.coalesceConfigs[type] = {
      windowMs,
      keyFn,
      slots: new Map(),
    } as CoalesceConfig<K> as any;
  }

  /**
   * Enqueue a new side effect job (normal or coalesced)
   */
  enqueue<K extends keyof SideEffectPayloadMap>(
    type: K,
    payload: SideEffectPayloadMap[K],
    maxAttempts = 3,
  ): string | null {
    const config = this.coalesceConfigs[type] as CoalesceConfig<K> | undefined;

    if (config) {
      const entityKey = config.keyFn(payload);
      console.log("Entity key", entityKey);
      let slot = config.slots.get(entityKey);
      if (!slot) {
        slot = {};
        config.slots.set(entityKey, slot);
      }

      // Always keep the latest payload
      slot.latestPayload = payload;

      if (!slot.timer) {
        slot.timer = setTimeout(() => {
          console.log("Enqueuing job", type, payload);
          this.pushJob(type, slot!.latestPayload!, maxAttempts);
          config.slots.delete(entityKey);
        }, config.windowMs);
      }

      return null; // Coalesced jobs don’t return immediate IDs
    }

    // Normal enqueue
    return this.pushJob(type, payload, maxAttempts).id;
  }

  /**
   * Flush all coalesced jobs immediately (e.g. on shutdown)
   */
  flushCoalescedJobs() {
    for (const [type, config] of Object.entries(this.coalesceConfigs)) {
      for (const [entityKey, slot] of config!.slots.entries()) {
        if (slot.latestPayload) {
          this.pushJob(type as keyof SideEffectPayloadMap, slot.latestPayload);
        }
        if (slot.timer) clearTimeout(slot.timer);
        config!.slots.delete(entityKey);
      }
    }
  }

  private pushJob<K extends keyof SideEffectPayloadMap>(
    type: K,
    payload: SideEffectPayloadMap[K],
    maxAttempts = 3,
  ): SideEffectJob<K> {
    if (this.queue.length >= this.maxQueueSize) {
      console.warn("SideEffectQueue is full, dropping job:", type);
      return {
        id: "dropped",
        type,
        payload,
        attempts: maxAttempts,
        maxAttempts,
        createdAt: new Date(),
      };
    }

    const job: SideEffectJob<K> = {
      id: randomUUID(),
      type,
      payload,
      attempts: 0,
      maxAttempts,
      createdAt: new Date(),
    };

    this.queue.push(job);
    this.scheduleProcessing();
    return job;
  }

  private scheduleProcessing() {
    if (!this.processing) {
      this.processing = true;
      setImmediate(() => this.processLoop());
    }
  }

  private async processLoop() {
    while (this.queue.length > 0) {
      const job = this.queue.shift()!;
      const handler = this.handlers[job.type] as JobHandler<any> | undefined;
      if (!handler) {
        console.error(`No handler registered for job type: ${job.type}`);
        continue;
      }

      try {
        await handler(job.payload);
      } catch (err) {
        console.error(
          `Job ${job.id} of type ${job.type} failed (attempt ${
            job.attempts + 1
          }):`,
          err,
        );
        job.attempts++;
        if (job.attempts < job.maxAttempts) {
          const backoffMs = Math.min(1000 * 2 ** (job.attempts - 1), 30000); // exponential backoff, max 30s
          setTimeout(() => this.queue.push(job), backoffMs);
        } else {
          console.error(
            `Job ${job.id} permanently failed after ${job.attempts} attempts`,
          );
        }
      }
    }

    this.processing = false;
  }

  metrics() {
    return {
      queueLength: this.queue.length,
      registeredHandlers: Object.keys(this.handlers).length,
      isProcessing: this.processing,
    };
  }
}
