"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { surveys } from "@/db/schema";
import { withValidationAndAuth } from "../protected-data-access";
import { DeleteSurveySchema } from "./schemas";

export const deleteSurvey = withValidationAndAuth({
  schema: DeleteSurveySchema,
  callback: async ({ surveyId }, user) => {
    await db
      .delete(surveys)
      .where(and(eq(surveys.id, surveyId), eq(surveys.userId, user.id)));
  },
});
