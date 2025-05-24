import { Survey } from "@/features/surveys/components/survey";
import { SurveyNotFound } from "@/features/surveys/components/survey-not-found";
import { getSurveyByIdQueryOptions } from "@/features/surveys/hooks/use-survey";
import { SurveyStoreProvider } from "@/features/surveys/store/survey-store-provider";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

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
