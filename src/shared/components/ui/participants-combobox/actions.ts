"use server";

import { getPgTimezones } from "@/data-access/pg";
import { publicAction } from "@/shared/lib/safe-action";

export const getParticipantsAction = publicAction.action(async () => {
  return await getPgTimezones();
});
