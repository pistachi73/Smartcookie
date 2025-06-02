import { EditSurveyTemplate } from "@/features/feedback/components/survey-templates/edit-survey-template";
import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";

type EditQuestionPageProps = {
  params: Promise<{
    surveyId: string;
  }>;
};

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  const { surveyId } = await params;

  const nSurveyId = Number(surveyId);

  if (!isNumber(nSurveyId)) {
    redirect("/portal/feedback");
  }

  return <EditSurveyTemplate surveyId={nSurveyId} />;
}
