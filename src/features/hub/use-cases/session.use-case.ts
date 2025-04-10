"use server";

import { db } from "@/db";
import { hub, session } from "@/db/schema";
import { endOfDay, startOfDay } from "date-fns";
import { and, between, eq } from "drizzle-orm";
import type { z } from "zod";
import {
  findOverlappingIntervals,
  hasOverlappingIntervals,
} from "../lib/find-overlapping-sessions";
import type { AddSessionsUseCaseSchema } from "../lib/schemas";

export const addSessionUseCase = async (
  data: z.infer<typeof AddSessionsUseCaseSchema>,
) => {
  const { sessions, userId, hubId } = data;

  // First check if the new sessions overlap with each other
  const newSessionIntervals = sessions.map((s) => [
    new Date(s.startTime).getTime(),
    new Date(s.endTime).getTime(),
  ]) as [number, number][];

  // Check if the new sessions overlap with each other first
  if (hasOverlappingIntervals(newSessionIntervals)) {
    throw new Error("Something went wrong");
  }

  // Extract unique dates from sessions to query
  const uniqueDates = Array.from(
    new Set(
      sessions
        .map((s) => {
          if (!s.startTime) return null;
          const startTime = new Date(s.startTime);
          return startTime.toISOString().split("T")[0];
        })
        .filter((dateStr): dateStr is string => dateStr !== null),
    ),
  );

  // Fetch existing sessions for each unique date
  const sessionArrays = await Promise.all(
    uniqueDates.map(async (dateString) => {
      // We know dateString is a valid date string from the filtering above
      const date = new Date(dateString);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      return db
        .select({
          startTime: session.startTime,
          endTime: session.endTime,
          hubName: hub.name,
        })
        .from(session)
        .leftJoin(hub, eq(session.hubId, hub.id))
        .where(
          and(
            eq(session.userId, userId),
            between(
              session.startTime,
              dayStart.toISOString(),
              dayEnd.toISOString(),
            ),
          ),
        );
    }),
  );

  // Flatten the array of arrays into a single array
  const existingSessions = sessionArrays.flat();

  console.log({ existingSessions });
  // Early return if no existing sessions
  if (existingSessions.length === 0) {
    return {
      success: true,
      existingSessions,
    };
  }

  const existingSessionIntervals = existingSessions.map(
    (s) =>
      [new Date(s.startTime).getTime(), new Date(s.endTime).getTime()] as [
        number,
        number,
      ],
  );

  // Check if new sessions overlap with existing ones
  const overlappingSessionIndexes = findOverlappingIntervals([
    ...newSessionIntervals,
    ...existingSessionIntervals,
  ]);

  console.log({ overlappingSessionIndexes });

  if (overlappingSessionIndexes.length) {
    type OverlappingSession = {
      startTime: string;
      endTime: string;
      hubName?: string;
    };
    const overlappingSessions = overlappingSessionIndexes.map(
      ([startIndex, endIndex]) => {
        const startSession =
          startIndex < sessions.length
            ? sessions[startIndex]
            : existingSessions[startIndex - sessions.length];
        const endSession =
          endIndex < sessions.length
            ? sessions[endIndex]
            : existingSessions[endIndex - sessions.length];
        return {
          s1: startSession,
          s2: endSession,
        };
      },
    ) as { s1: OverlappingSession; s2: OverlappingSession }[];

    return {
      success: false,
      overlappingSessions,
    };
  }

  return {
    success: true,
    existingSessions,
  };
};

// export const addSessionUseCase = withValidationAndAuth(
//   AddSessionsUseCaseSchema.omit({ userId: true }),
//   async (data, userId) => {
//     const { sessions, hubId } = data;

//     // First check if the new sessions overlap with each other
//     const newSessionIntervals = sessions.map((s) => [
//       new Date(s.startTime).getTime(),
//       new Date(s.endTime).getTime(),
//     ]) as [number, number][];

//     // Check if the new sessions overlap with each other first
//     if (hasOverlappingIntervals(newSessionIntervals)) {
//       throw new Error("Something went wrong");
//     }

//     // Extract unique dates from sessions to query
//     const uniqueDates = Array.from(
//       new Set(
//         sessions
//           .map((s) => {
//             if (!s.startTime) return null;
//             const startTime = new Date(s.startTime);
//             return startTime.toISOString().split("T")[0];
//           })
//           .filter((dateStr): dateStr is string => dateStr !== null),
//       ),
//     );

//     // Fetch existing sessions for each unique date
//     const sessionArrays = await Promise.all(
//       uniqueDates.map(async (dateString) => {
//         // We know dateString is a valid date string from the filtering above
//         const date = new Date(dateString);
//         const dayStart = startOfDay(date);
//         const dayEnd = endOfDay(date);

//         return db
//           .select({
//             startTime: session.startTime,
//             endTime: session.endTime,
//             hubName: hub.name,
//           })
//           .from(session)
//           .leftJoin(hub, eq(session.hubId, hub.id))
//           .where(
//             and(
//               eq(session.userId, userId),
//               between(
//                 session.startTime,
//                 dayStart.toISOString(),
//                 dayEnd.toISOString(),
//               ),
//             ),
//           );
//       }),
//     );

//     // Flatten the array of arrays into a single array
//     const existingSessions = sessionArrays.flat();

//     console.log({ existingSessions });
//     // Early return if no existing sessions
//     if (existingSessions.length === 0) {
//       return {
//         success: true,
//         existingSessions,
//       };
//     }

//     const existingSessionIntervals = existingSessions.map(
//       (s) =>
//         [new Date(s.startTime).getTime(), new Date(s.endTime).getTime()] as [
//           number,
//           number,
//         ],
//     );

//     // Check if new sessions overlap with existing ones
//     const overlappingSessionIndexes = findOverlappingIntervals([
//       ...newSessionIntervals,
//       ...existingSessionIntervals,
//     ]);

//     console.log({ overlappingSessionIndexes });

//     if (overlappingSessionIndexes.length) {
//       type OverlappingSession = {
//         startTime: string;
//         endTime: string;
//         hubName?: string;
//       };
//       const overlappingSessions = overlappingSessionIndexes.map(
//         ([startIndex, endIndex]) => {
//           const startSession =
//             startIndex < sessions.length
//               ? sessions[startIndex]
//               : existingSessions[startIndex - sessions.length];
//           const endSession =
//             endIndex < sessions.length
//               ? sessions[endIndex]
//               : existingSessions[endIndex - sessions.length];
//           return {
//             s1: startSession,
//             s2: endSession,
//           };
//         },
//       ) as { s1: OverlappingSession; s2: OverlappingSession }[];

//       return {
//         success: false,
//         overlappingSessions,
//       };
//     }

//     return {
//       success: true,
//       existingSessions,
//     };
//   },
// );
