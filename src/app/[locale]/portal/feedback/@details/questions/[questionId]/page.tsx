import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { addMonths } from "date-fns";
import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { QuestionDetails } from "@/features/feedback/components/questions/question-details";
import {
  questionAnswersQueryOptions,
  questionQueryOptions,
} from "@/features/feedback/lib/questions-query-options";

export default async function QuestionDetailsPage(
  props: PageProps<"/[locale]/portal/feedback/questions/[questionId]">,
) {
  const queryClient = getQueryClient();
  const { questionId } = await props.params;
  const nQuestionId = Number(questionId);
  const now = new Date();

  if (!isNumber(nQuestionId)) {
    redirect("/portal/feedback");
  }

  void queryClient.prefetchQuery(questionQueryOptions(nQuestionId));
  void queryClient.prefetchQuery(
    questionAnswersQueryOptions(nQuestionId, addMonths(now, -2), now),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <QuestionDetails questionId={nQuestionId} />
    </HydrationBoundary>
  );
}
