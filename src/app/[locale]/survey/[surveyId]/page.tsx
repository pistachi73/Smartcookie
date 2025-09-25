import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getQueryClient } from "@/shared/lib/get-query-client";

import { Survey } from "@/features/surveys/components/survey";
import { getSurveyByIdQueryOptions } from "@/features/surveys/lib/survey-query-options";

export const generateMetadata = async (): Promise<Metadata> => {
  const t = (await getTranslations({
    namespace: "Metadata.Survey",
    locale: "en-GB",
  })) as any;

  return {
    title: t("title"),
    description: t("description"),
  };
};

const SurveyPage = async ({
  params,
}: PageProps<"/[locale]/survey/[surveyId]">) => {
  const queryClient = getQueryClient();

  const { surveyId } = await params;

  void queryClient.prefetchQuery(getSurveyByIdQueryOptions(surveyId));

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <Survey surveyId={surveyId} />
    </HydrationBoundary>
  );
};

export default SurveyPage;
