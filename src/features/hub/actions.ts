"use server";

import { protectedAction } from "@/shared/lib/safe-action";
import {
  CreateHubUseCaseSchema,
  createHubUseCase,
} from "./use-cases/create-hub";
import { getHubsUseCase } from "./use-cases/get-hubs";
import { getUserStudentsUseCase } from "./use-cases/get-user-students";
import {
  searchStudentsUseCase,
  searchStudentsUseCaseSchema,
} from "./use-cases/serach-students";

export const searchStudentsAction = protectedAction
  .schema(searchStudentsUseCaseSchema.omit({ userId: true }))
  .action(
    async ({
      ctx: {
        user: { id },
      },
      parsedInput: { query },
    }) => {
      const students = await searchStudentsUseCase({
        userId: id,
        query,
      });

      return students;
    },
  );

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
      const hub = await createHubUseCase({
        userId: id,
        formData,
      });
      return hub;
    },
  );

export const getUserStudentsAction = protectedAction.action(
  async ({
    ctx: {
      user: { id },
    },
  }) => {
    const students = await getUserStudentsUseCase({ userId: id });
    return students;
  },
);
