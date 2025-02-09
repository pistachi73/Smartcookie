import { PublicError } from "@/use-cases/errors";
import { createSafeActionClient } from "next-safe-action";
import { currentUser } from "./auth";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    console.log(error);
    return error.message;
  },
  defaultValidationErrorsShape: "flattened",
});

export const protectedAction = actionClient.use(async ({ next }) => {
  const user = await currentUser();

  if (!user || !user.id || !user.email) {
    throw new PublicError("Not authenticated");
  }

  return next({ ctx: { user } });
});

export const publicAction = actionClient.use(async ({ next }) => {
  return next({ ctx: {} });
});
