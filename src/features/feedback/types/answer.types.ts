import type { getQuestionAnswers } from "@/data-access/answers/queries";

export type Answer = NonNullable<
  Awaited<ReturnType<typeof getQuestionAnswers>>
>[number];
