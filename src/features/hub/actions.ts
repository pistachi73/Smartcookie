"use server";

import { protectedAction } from "@/shared/lib/safe-action";
import {
  CreateHubUseCaseSchema,
  createHubUseCase,
} from "./use-cases/create-hub";
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

export const createHubAction = protectedAction
  .schema(CreateHubUseCaseSchema.omit({ userId: true }))
  .action(
    async ({
      ctx: {
        user: { id },
      },
      parsedInput: { formData },
    }) => {
      console.log("formData", formData);

      const hub = await createHubUseCase({
        userId: id,
        formData,
      });
      return hub;
    },
  );
