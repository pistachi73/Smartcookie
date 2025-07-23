import { NextResponse } from "next/server";

import { getSurveyResponsesBySurveyId } from "@/data-access/survey-response/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ surveyId: string }> },
) {
  try {
    const { surveyId } = await params;

    const responses = await getSurveyResponsesBySurveyId({
      surveyId,
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Error fetching survey responses:", error);
    return NextResponse.json(
      { error: "Failed to fetch survey responses" },
      { status: 500 },
    );
  }
}
