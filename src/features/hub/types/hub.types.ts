import type { getHubsByUserId } from "@/data-access/hubs/queries";
import type {
  getHubOverviewSessions,
  getSessionsByHubId,
} from "@/data-access/sessions/queries";

export type Hub = Awaited<ReturnType<typeof getHubsByUserId>>[number];
export type HubStudent = Hub["students"][number];

export type HubSession = Awaited<ReturnType<typeof getSessionsByHubId>>[number];
export type HubOverviewSession = Awaited<
  ReturnType<typeof getHubOverviewSessions>
>[number];
