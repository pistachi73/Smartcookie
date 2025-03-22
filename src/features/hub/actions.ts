"use server";

import { protectedAction } from "@/shared/lib/safe-action";
import { getHubsUseCase } from "./use-cases/get-hubs";

export const getHubsAction = protectedAction.action(
  async ({
    ctx: {
      user: { id },
    },
  }) => {
    const hubs = await getHubsUseCase({ userId: id });

    return hubs;
  },
);
