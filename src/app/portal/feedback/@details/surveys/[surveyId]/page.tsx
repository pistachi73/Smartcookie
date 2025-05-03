type SurveyDetailsPageProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function SurveyDetailsPage({
  params,
}: SurveyDetailsPageProps) {
  const { surveyId } = await params;
  return <div>SurveyDetailsPage {surveyId}</div>;
}
