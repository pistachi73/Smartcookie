import { getSurveyTemplateResponses } from "@/data-access/survey-response/queries";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ surveyTemplateId: string }> },
) {
  const { surveyTemplateId } = await params;

  const data = await getSurveyTemplateResponses({
    surveyTemplateId: Number.parseInt(surveyTemplateId),
  });

  return NextResponse.json(data);
}
