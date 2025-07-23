import type { AgendaSessionData } from "@/shared/components/sessions/agenda-session-card";

import type { getAgendaSessionsUseCase } from "../use-cases/dashboard.use-case";

/**
 * Transforms dashboard session data to the AgendaSessionData interface
 * for use with the shared AgendaSessionCard component
 */
export const transformToAgendaSessionData = (
  sessions:
    | Awaited<ReturnType<typeof getAgendaSessionsUseCase>>
    | Record<string, never>,
): Record<string, AgendaSessionData[]> => {
  if (!sessions || Object.keys(sessions).length === 0) return {};

  return Object.fromEntries(
    Object.entries(sessions).map(([day, daySessions]) => [
      day,
      daySessions.map((session) => ({
        id: session.id,
        startTime: session.startTime,
        endTime: session.endTime,
        hub: session.hub,
        students: session.students ?? [],
      })),
    ]),
  );
};
