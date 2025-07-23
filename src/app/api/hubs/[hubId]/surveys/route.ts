import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSurveysByHubId } from "@/data-access/surveys/queries";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ hubId: string }> },
) {
  const { hubId } = await params;

  try {
    const surveys = await getSurveysByHubId({ hubId: Number(hubId) });
    return NextResponse.json(surveys);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch surveys" },
      { status: 500 },
    );
  }
}
