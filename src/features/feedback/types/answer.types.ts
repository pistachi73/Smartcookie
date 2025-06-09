import type { getQuestionAnswers } from "@/data-access/anwers/queries";

export type Answer = NonNullable<
  Awaited<ReturnType<typeof getQuestionAnswers>>
>[number];
