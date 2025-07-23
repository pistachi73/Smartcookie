import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getHubsByUserIdForQuickNotes } from "@/data-access/hubs/queries";

export async function GET(_request: NextRequest) {
  try {
    const hubs = await getHubsByUserIdForQuickNotes();

    console.log(hubs);

    return NextResponse.json(hubs);
  } catch (error) {
    console.error("Error fetching quick notes hubs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
