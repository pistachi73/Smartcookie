import { getCalendarHubsByUserId } from "@/data-access/hub";
import type { Session } from "@/db/schema";
import { generateSessionOccurrences } from "@/lib/generate-session-ocurrences";
import { groupOccurrencesByDayAndTime } from "@/lib/group-overlapping-occurrences";

export const getCalendarHubsByUserIdUseCase = async (userId: string) => {
  const hubs = await getCalendarHubsByUserId(userId);

  // hubs.forEach((hub) => {
  //   console.log({ hub });
  //   hub.sessions.forEach((session) => {
  //     console.log({ session });
  //     session.exceptions?.forEach((exception) => {
  //       console.log({ exception });
  //     });
  //   });
  // });

  console.time("getCalendarHubsByUserIdUseCase");

  const sessions = hubs.reduce<Session[]>((acc, hub) => {
    acc.push(...hub.sessions);
    return acc;
  }, []);

  const sessionOcurrences = sessions.flatMap((session) =>
    generateSessionOccurrences({ session }),
  );
  // console.log({ sessionOcurrences });

  const groupedSessionOccurrences =
    groupOccurrencesByDayAndTime(sessionOcurrences);
  console.timeEnd("getCalendarHubsByUserIdUseCase");

  return {
    hubs,
    sessionOccurrences: groupedSessionOccurrences,
  };
};
