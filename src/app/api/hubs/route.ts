import { getHubsByUserId } from "@/data-access/hubs/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
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
