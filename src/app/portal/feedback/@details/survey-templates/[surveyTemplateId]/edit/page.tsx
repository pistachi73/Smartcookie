import { EditSurveyTemplate } from "@/features/feedback/components/survey-templates/edit-survey-template";
import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";

type EditQuestionPageProps = {
  params: Promise<{
    surveyTemplateId: string;
  }>;
};

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  const { surveyTemplateId } = await params;

  const nSurveyTemplateId = Number(surveyTemplateId);

  if (!isNumber(nSurveyTemplateId)) {
    redirect("/portal/feedback");
  }

  return <EditSurveyTemplate surveyTemplateId={nSurveyTemplateId} />;
}
