import type { AgendaSessionData } from "@/shared/components/sessions/agenda-session-card";

import type { CalendarSession } from "../types/calendar.types";

/**
 * Transforms calendar session data to the AgendaSessionData interface
 * for use with the shared AgendaSessionCard component
 */
export const transformCalendarSessionToAgendaData = (
  session: CalendarSession,
): AgendaSessionData => {
  return {
    id: session.id,
    startTime: session.startTime,
    endTime: session.endTime,
    hub: session.hub,
    students: session.students ?? [],
  };
};
