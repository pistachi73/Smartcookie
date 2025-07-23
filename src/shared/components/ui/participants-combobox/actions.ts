"use server";

import { publicAction } from "@/shared/lib/safe-action";

import { getPgTimezones } from "@/data-access/pg";

export const getParticipantsAction = publicAction.action(async () => {
  return await getPgTimezones();
});
