import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";

import { SurveyTemplateDetails } from "@/features/feedback/components/survey-templates/survey-template-details";

type SurveyTemplateDetailsPageProps = {
  params: Promise<{
    surveyTemplateId: string;
  }>;
};

export default async function SurveyTemplateDetailsPage({
  params,
}: SurveyTemplateDetailsPageProps) {
  const { surveyTemplateId } = await params;

  const nSurveyTemplateId = Number(surveyTemplateId);

  if (!isNumber(nSurveyTemplateId)) {
    redirect("/portal/feedback");
  }

  return <SurveyTemplateDetails surveyTemplateId={nSurveyTemplateId} />;
}
