"use server";

import { db } from "@/db";
import {
  type InsertSurveyTemplateQuestion,
  student,
  surveyResponses,
  surveyTemplateQuestions,
  surveyTemplates,
  surveys as surveysTable,
} from "@/db/schema";
import { withValidationAndAuth } from "@/shared/lib/protected-use-case";
import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";
import { cache } from "react";
import { z } from "zod";
import {
  DeleteSurveySchema,
  GetSurveysSchema,
  SurveyTemplateFormSchema,
  UpdateSurveyTemplateSchema,
} from "../lib/surveys.schema";

const buildSearchCondition = (q?: string) => {
  if (!q || q.trim() === "") {
    return undefined;
  }
  const searchTerm = `%${q}%`;
  return sql`(${surveyTemplates.title} ILIKE ${searchTerm} OR ${surveyTemplates.description} ILIKE ${searchTerm})`;
};

// Cached function to get the total count of questions for a user
const getCachedSurveysCount = cache(async (userId: string, q?: string) => {
  const userCondition = eq(surveyTemplates.userId, userId);
  const whereCondition =
    q && q.trim() !== ""
      ? and(userCondition, buildSearchCondition(q))
      : userCondition;

  const countResult = await db
    .select({ value: count() })
    .from(surveyTemplates)
    .where(whereCondition);
  return countResult[0]?.value || 0;
});

export const getSurveysUseCase = withValidationAndAuth({
  schema: GetSurveysSchema,
  useCase: async ({ page, pageSize, sortBy, q }, userId) => {
    const userCondition = eq(surveyTemplates.userId, userId);
    const whereCondition =
      q && q.trim() !== ""
        ? and(userCondition, buildSearchCondition(q))
        : userCondition;

    const [surveys, totalCount] = await Promise.all([
      db
        .select({
          id: surveyTemplates.id,
          title: surveyTemplates.title,
          description: surveyTemplates.description,
          updatedAt: surveyTemplates.updatedAt,
          totalResponses: surveyTemplates.totalResponses,
        })
        .from(surveyTemplates)
        .leftJoin(
          surveysTable,
          eq(surveysTable.surveyTemplateId, surveyTemplates.id),
        )
        .leftJoin(
          surveyResponses,
          and(
            eq(surveyResponses.surveyId, surveysTable.id),
            eq(surveyResponses.completed, true),
          ),
        )
        .where(whereCondition)
        .groupBy(
          surveyTemplates.id,
          surveyTemplates.title,
          surveyTemplates.description,
          surveyTemplates.updatedAt,
        )
        .limit(pageSize)
        .offset((page - 1) * pageSize)
        .orderBy(
          sortBy === "alphabetical"
            ? asc(surveyTemplates.title)
            : sortBy === "newest"
              ? desc(surveyTemplates.updatedAt)
              : desc(sql`"responsesCount"`),
        ),
      getCachedSurveysCount(userId, q),
    ]);

    return {
      surveys,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  },
});

export const createSurveyTemplateUseCase = withValidationAndAuth({
  schema: SurveyTemplateFormSchema,
  useCase: async ({ title, description, questions }, userId) => {
    await db.transaction(async (tx) => {
      const [surveyTemplate] = await tx
        .insert(surveyTemplates)
        .values({
          title,
          description,
          userId,
        })
        .returning({ id: surveyTemplates.id });

      if (!surveyTemplate) {
        tx.rollback();
        return;
      }

      const toInsertQuestions: InsertSurveyTemplateQuestion[] = questions.map(
        (question, index) => ({
          surveyTemplateId: surveyTemplate.id,
          questionId: question.id,
          order: index + 1,
          required: question.required,
        }),
      );

      await tx.insert(surveyTemplateQuestions).values(toInsertQuestions);
    });
  },
});

export const deleteSurveyTemplateUseCase = withValidationAndAuth({
  schema: DeleteSurveySchema,
  useCase: async ({ id }, userId) => {
    await db
      .delete(surveyTemplates)
      .where(
        and(eq(surveyTemplates.id, id), eq(surveyTemplates.userId, userId)),
      );
  },
});

export const getSurveyTemplateByIdUseCase = withValidationAndAuth({
  schema: z.object({
    id: z.number(),
  }),
  useCase: async ({ id }, userId) => {
    const surveyTemplate = await db.query.surveyTemplates.findFirst({
      where: and(
        eq(surveyTemplates.id, id),
        eq(surveyTemplates.userId, userId),
      ),
      columns: {
        id: true,
        title: true,
        description: true,
        totalResponses: true,
        averageResponseTime: true,
        updatedAt: true,
      },
      with: {
        surveyTemplateQuestions: {
          columns: {
            id: true,
            required: true,
            order: true,
          },
          orderBy: [asc(surveyTemplateQuestions.order)],
          with: {
            question: {
              columns: {
                id: true,
                title: true,
                description: true,
                type: true,
                enableAdditionalComment: true,
              },
            },
          },
        },
      },
    });

    if (!surveyTemplate) {
      return null;
    }

    const questions = surveyTemplate.surveyTemplateQuestions.map((stq) => ({
      ...stq.question,
      required: stq.required,
      order: stq.order,
      surveyTemplateQuestionId: stq.id,
    }));

    return {
      id: surveyTemplate.id,
      title: surveyTemplate.title,
      description: surveyTemplate.description,
      totalResponses: surveyTemplate.totalResponses,
      averageResponseTime: surveyTemplate.averageResponseTime,
      updatedAt: surveyTemplate.updatedAt,
      questions,
    };
  },
});

export const updateSurveyTemplateUseCase = withValidationAndAuth({
  schema: UpdateSurveyTemplateSchema,
  useCase: async (
    { id: surveyTemplateId, title, description, questions },
    userId,
  ) => {
    await db.transaction(async (tx) => {
      // Update survey template basic info
      await tx
        .update(surveyTemplates)
        .set({
          title,
          description,
        })
        .where(
          and(
            eq(surveyTemplates.id, surveyTemplateId),
            eq(surveyTemplates.userId, userId),
          ),
        );

      // Get existing survey template questions
      const existingSurveyTemplateQuestions = await tx
        .select({
          id: surveyTemplateQuestions.id,
          questionId: surveyTemplateQuestions.questionId,
          order: surveyTemplateQuestions.order,
          required: surveyTemplateQuestions.required,
        })
        .from(surveyTemplateQuestions)
        .where(eq(surveyTemplateQuestions.surveyTemplateId, surveyTemplateId));

      const existingQuestionIds = existingSurveyTemplateQuestions.map(
        (q) => q.questionId,
      );
      const newQuestionIds = questions.map((q) => q.id);

      // Find questions to remove
      const questionsToRemove = existingSurveyTemplateQuestions.filter(
        (eq) => !newQuestionIds.includes(eq.questionId),
      );

      // Find questions to update
      const surveyTemplateQuestionsToUpdate = questions
        .map((q) => {
          const existing = existingSurveyTemplateQuestions.find(
            (eq) => eq.questionId === q.id,
          );
          const hasChanged =
            existing?.required !== q.required || existing?.order !== q.order;

          return existing && hasChanged
            ? { ...q, surveyTemplateQuestionId: existing.id }
            : null;
        })
        .filter((q): q is NonNullable<typeof q> => q !== null);

      const surveyTemplateQuestionsToInsert: InsertSurveyTemplateQuestion[] =
        questions
          .filter((q) => !existingQuestionIds.includes(q.id))
          .map((question) => ({
            surveyTemplateId,
            questionId: question.id,
            order: question.order,
            required: question.required,
          }));

      // Execute all operations concurrently
      await Promise.all([
        // Remove questions
        questionsToRemove.length > 0
          ? tx.delete(surveyTemplateQuestions).where(
              inArray(
                surveyTemplateQuestions.id,
                questionsToRemove.map((q) => q.id),
              ),
            )
          : undefined,

        // Add new questions
        surveyTemplateQuestionsToInsert.length > 0
          ? tx
              .insert(surveyTemplateQuestions)
              .values(surveyTemplateQuestionsToInsert)
          : undefined,

        // Update existing questions
        ...surveyTemplateQuestionsToUpdate.map((question) =>
          tx
            .update(surveyTemplateQuestions)
            .set({
              required: question.required,
              order: question.order,
            })
            .where(
              eq(surveyTemplateQuestions.id, question.surveyTemplateQuestionId),
            ),
        ),
      ]);
    });
  },
});

export const getSurveyTemplateResponsesUseCase = withValidationAndAuth({
  schema: z.object({
    surveyTemplateId: z.number(),
  }),
  useCase: async ({ surveyTemplateId }, userId) => {
    const baseCondition = and(
      eq(surveysTable.surveyTemplateId, surveyTemplateId),
      eq(surveysTable.userId, userId),
    );

    const [responses, uncompletedCountResult] = await Promise.all([
      db
        .select({
          id: surveyResponses.id,
          completedAt: surveyResponses.completedAt,
          startedAt: surveyResponses.startedAt,
          createdAt: surveyResponses.createdAt,
          student: {
            id: student.id,
            name: student.name,
            email: student.email,
            image: student.image,
          },
        })
        .from(surveyResponses)
        .innerJoin(surveysTable, eq(surveyResponses.surveyId, surveysTable.id))
        .innerJoin(student, eq(surveyResponses.studentId, student.id))
        .where(and(baseCondition, eq(surveyResponses.completed, true)))
        .orderBy(desc(surveyResponses.createdAt)),

      db
        .select({ count: count() })
        .from(surveyResponses)
        .innerJoin(surveysTable, eq(surveyResponses.surveyId, surveysTable.id))
        .where(and(baseCondition, eq(surveyResponses.completed, false))),
    ]);

    const uncompletedCount = uncompletedCountResult[0]?.count || 0;

    return {
      responses,
      uncompletedCount,
    };
  },
});

export const getSurveyResponseAnswersUseCase = withValidationAndAuth({
  schema: z.object({
    surveyResponseId: z.number(),
    studentId: z.number(),
  }),
  useCase: async ({ surveyResponseId, studentId }) => {
    const studentResponse = await db.query.surveyResponses.findFirst({
      where: and(
        eq(surveyResponses.id, surveyResponseId),
        eq(surveyResponses.studentId, studentId),
        eq(surveyResponses.completed, true),
      ),
      columns: {
        completedAt: true,
      },
      with: {
        answers: {
          columns: {
            id: true,
            value: true,
            additionalComment: true,
          },
          with: {
            question: {
              columns: { id: true, type: true },
            },
          },
        },
      },
    });

    if (!studentResponse) {
      return {
        id: surveyResponseId,
        completedAt: null,
        answers: [],
      };
    }

    const answers = studentResponse.answers.map((answer) => ({
      id: answer.id,
      value: answer.value,
      additionalComment: answer.additionalComment,
      question: answer.question,
    }));

    return {
      id: surveyResponseId,
      completedAt: studentResponse.completedAt,
      answers,
    };
  },
});
