import { getNotesByHubId } from "@/data-access/quick-notes/queries";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface RouteParams {
  params: {
    hubId: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const hubId = Number.parseInt(params.hubId, 10);

    if (Number.isNaN(hubId)) {
      return NextResponse.json(
        { error: "hubId must be a valid number" },
        { status: 400 },
      );
    }

    const notes = await getNotesByHubId({ hubId });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
