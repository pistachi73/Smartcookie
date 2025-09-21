import { handleUpdateHubLastActivity } from "./handlers/update-hub-last-activity-handler";
import { SideEffectQueue } from "./side-effects-queue";

export const sideEffects = new SideEffectQueue();

// Register handlers
sideEffects.registerHandler(
  "updateHubLastActivity",
  handleUpdateHubLastActivity,
);

// Configure coalescing (one per hub per 60s)
sideEffects.configureCoalesce("updateHubLastActivity", 10_000, (p) =>
  p.hubId.toString(),
);

// Optional: on app shutdown, flush pending jobs
export async function shutdownSideEffects() {
  sideEffects.flushCoalescedJobs();
}
