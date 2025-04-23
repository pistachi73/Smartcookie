import { getHubsByUserId } from "@/data-access/hub";
import { db } from "@/db";
import {
  type Event,
  type Occurrence,
  attendance,
  event,
  eventOccurrence,
  hub,
  session,
  student,
} from "@/db/schema";
import { withValidationAndAuth } from "@/shared/lib/protected-use-case";
import { jsonAggregateObjects } from "@/shared/lib/query/json-aggregate-objects";
import { and, asc, eq } from "drizzle-orm";
import { Temporal } from "temporal-polyfill";
import { z } from "zod";

export const getCalendarSessionsUseCase = withValidationAndAuth({
  schema: z.object({}),
  useCase: async (userId) => {
    const sessions = await db
      .select({
        id: session.id,
        startTime: session.startTime,
        endTime: session.endTime,
        students: jsonAggregateObjects<
          {
            id: number;
            name: string;
            email: string;
            image: string | null;
          }[]
        >({
          id: student.id,
          name: student.name,
          email: student.email,
          image: student.image,
        }).as("students"),
        hub: {
          id: hub.id,
          name: hub.name,
          color: hub.color,
        },
      })
      .from(session)
      .leftJoin(attendance, eq(attendance.sessionId, session.id))
      .leftJoin(student, eq(attendance.studentId, student.id))
      .leftJoin(hub, eq(session.hubId, hub.id))
      .where(eq(session.userId, userId))
      .groupBy(session.id, hub.id);

    return sessions;
  },
});

export const getCalendarDataUseCase = async (userId: string) => {
  const [hubs, result] = await Promise.all([
    getHubsByUserId(userId),
    await db
      .select()
      .from(event)
      .leftJoin(eventOccurrence, eq(eventOccurrence.eventId, event.id))
      .where(
        and(
          // eq(event.userId, userId),
          // between(EventOccurrences.occurrenceStart, startDate, endDate),
        ),
      )
      .orderBy(asc(event.id), asc(event.startTime))
      .execute(),
  ]);

  const occurrences: Occurrence[] = [];
  const events: Map<number, Event> = new Map();

  result.forEach((record) => {
    const event = record.event;
    const occurrence = record.event_occurrence;
    if (occurrence) {
      const timezone = occurrence.overrides?.timezone || event.timezone;
      const startInstant = Temporal.Instant.from(occurrence.startTime);
      const endInstant = Temporal.Instant.from(occurrence.endTime);

      occurrences.push({
        ...occurrence,
        startTime: startInstant.toZonedDateTimeISO(timezone).toString({
          timeZoneName: "never",
        }),
        endTime: endInstant.toZonedDateTimeISO(timezone).toString({
          timeZoneName: "never",
        }),
      });
    }

    events.set(event.id, event);
  });

  return {
    hubs,
    events: Array.from(events.values()),
    occurrences,
  };
};
