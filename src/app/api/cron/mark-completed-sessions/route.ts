import { subDays } from "date-fns";
import { and, eq, lt } from "drizzle-orm";

import { db } from "@/db";
import { session } from "@/db/schema";
import { env } from "@/env";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    const oneDayAgo = subDays(new Date(), 1);

    const result = await db
      .update(session)
      .set({
        status: "completed",
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          lt(session.endTime, oneDayAgo.toISOString()),
          eq(session.status, "upcoming"),
        ),
      )
      .returning({
        id: session.id,
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Marked ${result.length} sessions as completed`,
        updatedSessions: result.length,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Failed to mark sessions as completed:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to mark sessions as completed",
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
