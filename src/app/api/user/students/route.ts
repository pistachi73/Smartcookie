import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getAllStudents } from "@/data-access/students/queries";

export async function GET(_request: NextRequest) {
  try {
    const students = await getAllStudents();

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}
