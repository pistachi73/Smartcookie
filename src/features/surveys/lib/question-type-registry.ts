import { z } from "zod";

import type { QuestionType } from "@/db/schema";
import { QuestionBoolean } from "../components/question-types/question-boolean";
import { QuestionRating } from "../components/question-types/question-rating";
import { QuestionText } from "../components/question-types/question-text";
import type { getSurveyByIdUseCase } from "../use-cases/surveys.use-case";

export const GO_TO_NEXT_QUESTION_DELAY = 400;

// Define the Question type based on your existing structure
type Question = NonNullable<
  Awaited<ReturnType<typeof getSurveyByIdUseCase>>
>["questions"][number];

export interface QuestionTypeConfig {
  /**
   * The React component responsible for rendering the question.
   * It receives `questionId` as a prop, which is expected to be a number.
   */
  Component: React.FC<{ questionId: number }>;
  /**
   * A function that generates the Zod validation schema for this question type.
   * @param question The question object, containing metadata like `required`.
   * @returns A Zod schema.
   */
  generateSchema: (question: Question) => z.ZodTypeAny;
}

export const questionTypeRegistry: Record<QuestionType, QuestionTypeConfig> = {
  text: {
    Component: QuestionText,
    generateSchema: (question: Question) => {
      const baseTextSchema = z.string();
      if (question.required) {
        return baseTextSchema.min(1, {
          message: "This field is required",
        });
      }
      return baseTextSchema.optional();
    },
  },
  boolean: {
    Component: QuestionBoolean,
    generateSchema: (question: Question) => {
      const baseBooleanSchema = z.string();
      if (question.required) {
        return baseBooleanSchema.refine(
          (val) => val === "true" || val === "false",
          { message: "Please select an option." },
        );
      }
      return baseBooleanSchema.optional();
    },
  },
  rating: {
    Component: QuestionRating,
    generateSchema: (question: Question) => {
      if (question.required) {
        return z
          .string()
          .regex(/^(?:[1-9]|10)$/, {
            message: "Please select a valid rating (1-10).",
          })
          .min(1, { message: "This field is required." });
      }
      return z.union([
        z.literal(""),
        z.string().regex(/^(?:[1-9]|10)$/, {
          message: "Please select a valid rating (1-10).",
        }),
      ]);
    },
  },
};

/**
 * Retrieves the configuration (Component and schema generator) for a given question type.
 * @param questionType The type of the question (e.g., "text", "boolean").
 * @returns The configuration object, or undefined if the type is not registered.
 */
export function getQuestionConfig(
  questionType: QuestionType,
): QuestionTypeConfig {
  return questionTypeRegistry[questionType];
}

/**
 * Generates a Zod schema object for a given question, structured as { [question.id]: schema }.
 * This is used to build the dynamic form schema in SurveyQuestion.tsx.
 * If the question type is unknown, it defaults to an optional 'any' schema for that question ID.
 *
 * @param question The question object. (question.id is assumed to be a number)
 * @returns A Zod object schema (e.g., z.object({ "123": z.string().min(1) }))
 */
export const generateDynamicQuestionSchema = (question: Question) => {
  const config = getQuestionConfig(question.type);
  const fieldSchema = config
    ? config.generateSchema(question)
    : z.any().optional(); // Default for unknown types

  return z.object({
    [String(question.id)]: fieldSchema,
  });
};
