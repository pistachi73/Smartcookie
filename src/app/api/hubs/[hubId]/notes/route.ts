import { getNotesByHubId } from "@/data-access/quick-notes/queries";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hubId: string }> },
) {
  try {
    const { hubId } = await params;

    if (Number.isNaN(hubId)) {
      return NextResponse.json(
        { error: "hubId must be a valid number" },
        { status: 400 },
      );
    }

    const notes = await getNotesByHubId({ hubId: Number.parseInt(hubId) });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
