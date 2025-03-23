import type { getHubsUseCase } from "../use-cases/get-hubs";

export type Hub = Awaited<ReturnType<typeof getHubsUseCase>>[number];

export type HubStudent = {
  id: number;
  name: string;
  email: string;
  image: string | null;
};
