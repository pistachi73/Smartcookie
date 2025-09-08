import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { SurveyTemplateDetails } from "@/features/feedback/components/survey-templates/survey-template-details";
import { surveyTemplateByIdQueryOptions } from "@/features/feedback/lib/survey-template-query-options";
import { surveyTemplateResponsesQueryOptions } from "@/features/feedback/lib/survey-template-responses-query-options";

export default async function SurveyTemplateDetailsPage(
  props: PageProps<"/portal/feedback/survey-templates/[surveyTemplateId]">,
) {
  const queryClient = getQueryClient();
  const { surveyTemplateId } = await props.params;
  const nSurveyTemplateId = Number(surveyTemplateId);

  if (!isNumber(nSurveyTemplateId)) {
    redirect("/portal/feedback");
  }

  void queryClient.prefetchQuery(
    surveyTemplateByIdQueryOptions(nSurveyTemplateId),
  );
  void queryClient.prefetchQuery(
    surveyTemplateResponsesQueryOptions(nSurveyTemplateId),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <SurveyTemplateDetails surveyTemplateId={nSurveyTemplateId} />
    </HydrationBoundary>
  );
}
