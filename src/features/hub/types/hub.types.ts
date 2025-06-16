import type { getHubsByUserId } from "@/data-access/hubs/queries";
import type { getSessionsByHubId } from "@/data-access/sessions/queries";

export type Hub = Awaited<ReturnType<typeof getHubsByUserId>>[number];
export type HubStudent = Hub["students"][number];

export type HubSession = Awaited<ReturnType<typeof getSessionsByHubId>>[number];
