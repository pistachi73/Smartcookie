"use server";

import { protectedAction } from "@/shared/lib/safe-action";

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
