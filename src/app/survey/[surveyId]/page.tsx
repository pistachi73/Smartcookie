import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { Survey } from "@/features/surveys/components/survey";
import { SurveyNotFound } from "@/features/surveys/components/survey-not-found";
import { getSurveyByIdQueryOptions } from "@/features/surveys/lib/survey-query-options";
import { SurveyStoreProvider } from "@/features/surveys/store/survey-store-provider";

type SurveyPageProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

const SurveyPage = async ({ params }: SurveyPageProps) => {
  const queryClient = new QueryClient();

  const { surveyId } = await params;

  const survey = await queryClient.fetchQuery(
    getSurveyByIdQueryOptions(surveyId),
  );

  if (!survey) {
    return <SurveyNotFound />;
  }

  return (
    <SurveyStoreProvider
      surveyId={surveyId}
      totalQuestions={survey.questions.length}
    >
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Survey surveyId={surveyId} />
      </HydrationBoundary>
    </SurveyStoreProvider>
  );
};

export default SurveyPage;
