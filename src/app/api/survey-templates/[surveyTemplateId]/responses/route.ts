import { NextResponse } from "next/server";

import { getSurveyTemplateResponses } from "@/data-access/survey-response/queries";

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
