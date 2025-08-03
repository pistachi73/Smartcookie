import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getSessionNotesBySessionId } from "@/data-access/session-notes/queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> },
) {
  try {
    const { sessionId } = await params;

    const sessionIdNumber = Number.parseInt(sessionId);

    if (Number.isNaN(sessionIdNumber)) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 },
      );
    }

    const sessionNotes = await getSessionNotesBySessionId({
      sessionId: sessionIdNumber,
    });

    return NextResponse.json(sessionNotes);
  } catch (error) {
    console.error("Error fetching session notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch session notes" },
      { status: 500 },
    );
  }
}
