import { getQuestionAnswers } from "@/data-access/anwers/queries";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ questionId: string }> },
) {
  const { questionId } = await params;
  const { searchParams } = new URL(request.url);

  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");

  const data = await getQuestionAnswers({
    id: Number.parseInt(questionId),
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
  });

  return NextResponse.json(data);
}
