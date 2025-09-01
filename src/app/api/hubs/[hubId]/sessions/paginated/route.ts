import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getPaginatedSessionsByHubId } from "@/data-access/sessions/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hubId: string }> },
) {
  try {
    const hubId = Number.parseInt((await params).hubId);
    const body = await request.json();

    const { cursor, direction, limit } = body;

    const result = await getPaginatedSessionsByHubId({
      hubId,
      cursor: cursor ? cursor : undefined,
      direction: direction || "next",
      limit: limit || 10,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching paginated sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 },
    );
  }
}
