"use server";

import { db } from "@/db";
import { questions } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { withValidationAndAuth } from "../protected-data-access";

export const getQuestionAnswers = withValidationAndAuth({
  schema: z.object({
    id: z.number(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
  }),
  callback: async ({ id, dateFrom, dateTo }, userId) => {
    // Default to 2 months from today if no date range provided
    const defaultDateFrom = new Date();
    defaultDateFrom.setMonth(defaultDateFrom.getMonth() - 2);

    const effectiveDateFrom = dateFrom || defaultDateFrom;
    const effectiveDateTo = dateTo || new Date();

    // Verify question belongs to user first
    const question = await db.query.questions.findFirst({
      where: and(eq(questions.id, id), eq(questions.userId, userId)),
      columns: { id: true },
    });

    if (!question) return null;

    // Get only the answers with date filtering
    const questionWithAnswers = await db.query.questions.findFirst({
      where: eq(questions.id, id),
      columns: { id: true },
      with: {
        answers: {
          where: (answers, { and, gte, lte }) =>
            and(
              gte(answers.answeredAt, effectiveDateFrom.toISOString()),
              lte(answers.answeredAt, effectiveDateTo.toISOString()),
            ),
          columns: {
            id: true,
            value: true,
            additionalComment: true,
          },
          orderBy: (answers, { desc }) => [desc(answers.answeredAt)],
        },
      },
    });

    return questionWithAnswers?.answers || [];
  },
});
