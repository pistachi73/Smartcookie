import { SurveyDetails } from "@/features/feedback/components/survey-templates/survey-template-details";
import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";

type SurveyDetailsPageProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function SurveyDetailsPage({
  params,
}: SurveyDetailsPageProps) {
  const { surveyId } = await params;

  const nSurveyId = Number(surveyId);

  if (!isNumber(nSurveyId)) {
    redirect("/portal/feedback");
  }

  return <SurveyDetails surveyTemplateId={nSurveyId} />;
}
