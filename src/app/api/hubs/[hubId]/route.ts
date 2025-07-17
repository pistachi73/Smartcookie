import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getHubById } from "@/data-access/hubs/queries";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ hubId: string }> },
) {
  try {
    const { hubId } = await params;

    const hubIdNumber = Number.parseInt(hubId);

    if (Number.isNaN(hubIdNumber)) {
      return NextResponse.json({ error: "Invalid hub ID" }, { status: 400 });
    }

    const hub = await getHubById({ hubId: hubIdNumber });

    if (!hub) {
      return NextResponse.json({ error: "Hub not found" }, { status: 404 });
    }

    return NextResponse.json(hub);
  } catch (error) {
    console.error("Error fetching hub:", error);
    return NextResponse.json({ error: "Failed to fetch hub" }, { status: 500 });
  }
}
