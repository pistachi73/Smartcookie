import { NextResponse } from "next/server";

import { getSurveyTemplateById } from "@/data-access/survey-templates/queries";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ surveyTemplateId: string }> },
) {
  const { surveyTemplateId } = await params;

  const data = await getSurveyTemplateById({
    id: Number.parseInt(surveyTemplateId),
  });

  return NextResponse.json(data);
}
