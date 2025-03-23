import { PublicError } from "@/shared/services/errors";
import { createSafeActionClient } from "next-safe-action";
import { currentUser } from "./auth";

export const actionClient = createSafeActionClient({
  handleServerError: (error) => {
    console.log("error", error.message);
    if (error instanceof PublicError) {
      console.error(error);
      throw error;
    }

    console.error(error);
    throw new PublicError("Something went wrong");
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
