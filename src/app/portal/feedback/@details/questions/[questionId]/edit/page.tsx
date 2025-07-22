import isNumber from "lodash/isNumber";
import { redirect } from "next/navigation";

import { EditQuestion } from "@/features/feedback/components/questions/edit-question";

type EditQuestionPageProps = {
  params: Promise<{
    questionId: string;
  }>;
};

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  const { questionId } = await params;

  const nQuestionId = Number(questionId);

  if (!isNumber(nQuestionId)) {
    redirect("/portal/feedback");
  }

  return <EditQuestion questionId={nQuestionId} />;
}
