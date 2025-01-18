import { protectedAction } from "@/lib/safe-action";
import { getCalendarDataUseCase } from "@/use-cases/calendar";

export const getCalendarDataAction = protectedAction.action(async ({ ctx }) => {
  const {
    user: { id },
  } = ctx;

  return await getCalendarDataUseCase(id);
});
