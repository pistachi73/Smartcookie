"use server";

import { and, eq, inArray } from "drizzle-orm";

import { surveyResponses, surveys } from "@/db/schema";

/**
 * Archive all survey responses for a student in a specific hub
 * This preserves the responses for historical data while marking them as no longer active
 */
export const archiveStudentSurveyResponsesInHub = async ({
  studentId,
  hubId,
  trx,
}: {
  studentId: number;
  hubId: number;
  trx: any;
}) => {
  // First, get all survey IDs for the hub
  const hubSurveys = await trx
    .select({ id: surveys.id })
    .from(surveys)
    .where(eq(surveys.hubId, hubId));

  if (hubSurveys.length === 0) return;

  const surveyIds = hubSurveys.map((survey: { id: string }) => survey.id);

  // Archive survey responses for the student in these surveys
  await trx
    .update(surveyResponses)
    .set({
      status: "archived",
    })
    .where(
      and(
        eq(surveyResponses.studentId, studentId),
        inArray(surveyResponses.surveyId, surveyIds),
        eq(surveyResponses.status, "active"), // Only archive currently active responses
      ),
    );
};
