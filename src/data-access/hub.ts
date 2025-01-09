import { db } from "@/db";
import { hub, session } from "@/db/schema";
import { eq } from "drizzle-orm";
import { parseDateWithTimezone } from "./utils";

export const getHubsByUserId = async (userId: string) => {
  return await db.query.hub.findMany({
    where: eq(hub.userId, userId),
    with: {
      sessions: {
        with: {
          exceptions: true,
        },
      },
    },
  });
};

export const getCalendarHubsByUserId = async (userId: string) => {
  return await db.query.hub.findMany({
    // where: eq(hub.userId, userId),
    with: {
      sessions: {
        columns: {
          startTime: false,
          endTime: false,
        },
        extras: {
          startTime: parseDateWithTimezone(
            session.startTime,
            session.timezone,
            "startTime",
          ),
          endTime: parseDateWithTimezone(
            session.endTime,
            session.timezone,
            "endTime",
          ),
        },
        with: {
          occurrences: true,
        },
      },
    },
  });
};
