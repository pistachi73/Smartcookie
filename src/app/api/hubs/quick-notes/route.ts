import { getHubsByUserIdForQuickNotes } from "@/data-access/hubs/queries";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const hubs = await getHubsByUserIdForQuickNotes();

    return NextResponse.json(hubs);
  } catch (error) {
    console.error("Error fetching quick notes hubs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
