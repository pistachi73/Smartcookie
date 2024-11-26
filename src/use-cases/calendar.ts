import type { Session } from "@/db/schema";
import { generateSessionOccurrences } from "@/lib/generate-session-ocurrences";
import { groupOccurrencesByDayAndTime } from "@/lib/group-overlapping-occurrences";
import { getCalendarHubsByUserId } from "../data-access/hub";

export const getCalendarHubsByUserIdUseCase = async (userId: string) => {
  const hubs = await getCalendarHubsByUserId(userId);

  console.time("getCalendarHubsByUserIdUseCase");

  const sessions = hubs.reduce<Session[]>((acc, hub) => {
    acc.push(...hub.sessions);
    return acc;
  }, []);

  const sessionOcurrences = sessions.flatMap((session) =>
    generateSessionOccurrences({ session }),
  );

  const groupedSessionOccurrences =
    groupOccurrencesByDayAndTime(sessionOcurrences);
  console.timeEnd("getCalendarHubsByUserIdUseCase");

  return {
    hubs,
    sessionOccurrences: groupedSessionOccurrences,
  };
};
