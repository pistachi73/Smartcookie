import { getHubSessionsWithExceptions } from "@/data-access/session";
import { protectedAction } from "@/lib/safe-action";
import { getCalendarHubsByUserIdUseCase } from "@/use-cases/calendar";
import { z } from "zod";

export const getSessionsWithExceptionsByHubIdAction = protectedAction
  .schema(z.number())
  .action(async ({ parsedInput }) => {
    return await getHubSessionsWithExceptions(parsedInput);
  });

export const getCalendarHubsByUserIdAction = protectedAction.action(
  async ({ ctx }) => {
    const {
      user: { id },
    } = ctx;

    return await getCalendarHubsByUserIdUseCase(id);
  },
);
