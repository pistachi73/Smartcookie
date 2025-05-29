import type { getQuestionAnswersUseCase } from "../use-cases/questions.use-case";

export type Answer = NonNullable<
  Awaited<ReturnType<typeof getQuestionAnswersUseCase>>
>[number];
