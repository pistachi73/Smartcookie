import { getSessionsByHubId } from "@/data-access/sessions/queries";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hubId: string }> },
) {
  try {
    const { hubId } = await params;

    const hubIdNumber = Number.parseInt(hubId);

    if (Number.isNaN(hubIdNumber)) {
      return NextResponse.json({ error: "Invalid hub ID" }, { status: 400 });
    }

    const sessions = await getSessionsByHubId({ hubId: hubIdNumber });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}
