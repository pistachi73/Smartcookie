import { getHubById } from "@/data-access/hubs/queries";
import { currentUser } from "@/shared/lib/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ hubId: string }> },
) {
  try {
    const headersList = request.headers;

    const { hubId } = await params;
    console.log(headersList);

    const hubIdNumber = Number.parseInt(hubId);

    if (Number.isNaN(hubIdNumber)) {
      return NextResponse.json({ error: "Invalid hub ID" }, { status: 400 });
    }

    const authenticatedUser = await currentUser();
    console.log("authenticatedUser", authenticatedUser);

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
