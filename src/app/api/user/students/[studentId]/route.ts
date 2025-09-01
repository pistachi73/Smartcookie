import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getStudentById } from "@/data-access/students/queries";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ studentId: string }> },
) {
  try {
    const { studentId } = await params;

    const parsedStudentId = Number.parseInt(studentId);

    const student = await getStudentById({
      id: parsedStudentId,
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 },
    );
  }
}
