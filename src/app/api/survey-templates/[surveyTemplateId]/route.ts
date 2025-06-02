import { getSurveyTemplateByIdUseCase } from "@/features/feedback/use-cases/survey-templates.use-case";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ surveyTemplateId: string }> },
) {
  const { surveyTemplateId } = await params;

  const data = await getSurveyTemplateByIdUseCase({
    id: Number.parseInt(surveyTemplateId),
  });

  return NextResponse.json(data);
}
