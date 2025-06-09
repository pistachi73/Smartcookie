import { getQuestionById } from "@/data-access/questions/queries";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ questionId: string }> },
) {
  const { questionId } = await params;

  const data = await getQuestionById({
    id: Number.parseInt(questionId),
  });

  return NextResponse.json(data);
}
