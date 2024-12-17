"use server";

import { getPgTimezones } from "@/data-access/pg";
import { publicAction } from "@/lib/safe-action";

export const getPgTimezonesAction = publicAction.action(async () => {
  return await getPgTimezones();
});
