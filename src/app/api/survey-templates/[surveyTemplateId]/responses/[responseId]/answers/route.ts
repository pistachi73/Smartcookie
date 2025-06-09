import { getSurveyResponseAnswersUseCase } from "@/features/feedback/use-cases/survey-templates.use-case";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
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

  const data = await getSurveyResponseAnswersUseCase({
    surveyResponseId: Number.parseInt(responseId),
  });

  return NextResponse.json(data);
}
