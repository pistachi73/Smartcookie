import { getQuestionByIdUseCase } from "@/features/feedback/use-cases/questions.use-case";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ questionId: string }> },
) {
  const { questionId } = await params;

  const data = await getQuestionByIdUseCase({
    id: Number.parseInt(questionId),
  });

  return NextResponse.json(data);
}
