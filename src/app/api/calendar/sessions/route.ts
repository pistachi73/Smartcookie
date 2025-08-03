import type { NextRequest } from "next/server";
import { z } from "zod";

import { currentUser } from "@/shared/lib/auth";

import { getCalendarSessionsByDateRange } from "@/data-access/sessions/queries";

const GetCalendarSessionsSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const validatedParams = GetCalendarSessionsSchema.parse({
      startDate,
      endDate,
    });

    const sessions = await getCalendarSessionsByDateRange(validatedParams);

    return Response.json(sessions);
  } catch (error) {
    console.error("Error fetching calendar sessions:", error);
    return Response.json(
      { error: "Failed to fetch calendar sessions" },
      { status: 500 },
    );
  }
}
