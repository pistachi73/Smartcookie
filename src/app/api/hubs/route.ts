import { NextResponse } from "next/server";

import { getHubsByUserId } from "@/data-access/hubs/queries";

export async function GET() {
  try {
    console.log("Fetching hubs");
    const hubs = await getHubsByUserId();
    return NextResponse.json(hubs);
  } catch (error) {
    console.error("Error fetching hubs:", error);
    return NextResponse.json(
      { error: "Failed to fetch hubs" },
      { status: 500 },
    );
  }
}
