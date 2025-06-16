import { getSurveyTemplateResponseAnswers } from "@/data-access/survey-response/queries";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  {
    params,
  }: {
    params: Promise<{
      surveyTemplateId: string;
      responseId: string;
    }>;
  },
) {
  const { responseId } = await params;

  const data = await getSurveyTemplateResponseAnswers({
    surveyResponseId: Number.parseInt(responseId),
  });

  return NextResponse.json(data);
}
