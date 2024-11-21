import { Calendar } from "@/components/portal/calendar";
import { getSessionsWithExceptionsByHubIdAction } from "@/components/portal/calendar/actions";
import { generateSessionOccurrences } from "@/lib/generate-session-ocurrences";
import { addMonths, endOfMonth, startOfMonth } from "date-fns";

const CalendarPage = async () => {
  const sessions = await getSessionsWithExceptionsByHubIdAction(1);

  console.log({ sessions });
  let sessionOccurrences: any;
  if (sessions?.data) {
    const session = sessions.data[0];

    if (session) {
      const now = new Date();
      const startDate = startOfMonth(now);
      const endDate = addMonths(endOfMonth(now), 1);
      sessionOccurrences = generateSessionOccurrences({
        session: session,
        exceptions: session.exceptions ? session.exceptions : [],
        startDate,
        endDate,
      });

      console.log({ sessionOccurrences });
    }
  }

  return (
    <>
      {sessionOccurrences.map((s) => (
        <p>{String(s.startTime)}</p>
      ))}
      <Calendar />
    </>
  );
};

export default CalendarPage;
