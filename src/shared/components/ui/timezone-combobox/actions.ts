"use server";

import { publicAction } from "@/shared/lib/safe-action";

import { getPgTimezones } from "@/data-access/pg";

export const getPgTimezonesAction = publicAction.action(async () => {
  return await getPgTimezones();
});
