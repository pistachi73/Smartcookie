import { getHubSessionsWithExceptions } from "@/data-access/session";
import { protectedAction } from "@/lib/safe-action";
import { z } from "zod";

export const getSessionsWithExceptionsByHubIdAction = protectedAction
  .schema(z.number())
  .action(async ({ parsedInput }) => {
    return await getHubSessionsWithExceptions(parsedInput);
  });
