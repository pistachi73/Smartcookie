import { queryOptions } from "@tanstack/react-query";

import type { getSessionNotesBySessionId } from "@/data-access/session-notes/queries";

export type GetSessionNotesBySessionIdQueryResponse = Awaited<
  ReturnType<typeof getSessionNotesBySessionId>
>;

export type SessionNotesWithClientId =
  GetSessionNotesBySessionIdQueryResponse["in-class"][number] & {
    clientId?: string;
  };

export const getSessionNotesBySessionIdQueryOptions = (sessionId: number) =>
  queryOptions({
    queryKey: ["session-notes", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/sessions/${sessionId}/session-notes`);

      const json =
        (await response.json()) as GetSessionNotesBySessionIdQueryResponse;

      const planNotesWithClientId = json.plans.map((note) => ({
        ...note,
        clientId: undefined,
      })) as SessionNotesWithClientId[];

      const inClassNotesWithClientId = json["in-class"].map((note) => ({
        ...note,
        clientId: undefined,
      })) as SessionNotesWithClientId[];

      return {
        plans: planNotesWithClientId,
        "in-class": inClassNotesWithClientId,
      };
    },
    enabled: !!sessionId,
  });
