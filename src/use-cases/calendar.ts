import { getCalendarHubsByUserId } from "@/data-access/hub";

export const getCalendarHubsByUserIdUseCase = async (userId: string) => {
  const hubs = await getCalendarHubsByUserId(userId);

  hubs.forEach((hub) => {
    console.log({ hub });
    hub.sessions.forEach((session) => {
      console.log({ session });
      session.occurrences?.forEach((occurrence) => {
        console.log({ occurrence });
      });
    });
  });

  // console.time("getCalendarHubsByUserIdUseCase");

  // const sessions = hubs.reduce<Session[]>((acc, hub) => {
  //   acc.push(...hub.sessions);
  //   return acc;
  // }, []);

  // const sessionOcurrences = sessions.flatMap((session) =>
  //   generateSessionOccurrences({ session }),
  // );
  // // console.log({ sessionOcurrences });

  // const groupedSessionOccurrences =
  //   groupOccurrencesByDayAndTime(sessionOcurrences);
  // console.timeEnd("getCalendarHubsByUserIdUseCase");

  return {
    hubs: null,
    sessionOccurrences: null,
  };
};
