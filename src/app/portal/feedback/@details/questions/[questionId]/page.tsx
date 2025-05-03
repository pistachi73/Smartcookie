import { QuestionDetails } from "@/features/feedback/components/question-details";
import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";

type QuestionDetailsPageProps = {
  params: Promise<{
    questionId: string;
  }>;
};

export default async function QuestionDetailsPage({
  params,
}: QuestionDetailsPageProps) {
  const { questionId } = await params;

  const nQuestionId = Number(questionId);

  if (!isNumber(nQuestionId)) {
    redirect("/portal/feedback");
  }

  return <QuestionDetails questionId={nQuestionId} />;
}
