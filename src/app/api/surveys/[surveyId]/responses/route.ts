import { getSurveyResponsesBySurveyId } from "@/data-access/survey-response/queries";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
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
