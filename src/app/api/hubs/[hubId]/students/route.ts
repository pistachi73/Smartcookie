import { getStudentsByHubId } from "@/data-access/students/queries";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ hubId: string }> },
) {
  try {
    const { hubId } = await params;

    if (Number.isNaN(hubId)) {
      return NextResponse.json({ error: "Invalid hub ID" }, { status: 400 });
    }

    const students = await getStudentsByHubId({
      hubId: Number.parseInt(hubId),
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching hub students:", error);
    return NextResponse.json(
      { error: "Failed to fetch hub students" },
      { status: 500 },
    );
  }
}
