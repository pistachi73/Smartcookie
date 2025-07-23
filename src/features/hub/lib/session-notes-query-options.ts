import { queryOptions } from "@tanstack/react-query";

import type { getSessionNotesBySessionId } from "@/data-access/session-notes/queries";

export type GetSessionNotesBySessionIdQueryResponse = Awaited<
  ReturnType<typeof getSessionNotesBySessionId>
>;

export const getSessionNotesBySessionIdQueryOptions = (sessionId: number) =>
  queryOptions({
    queryKey: ["session-notes", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/sessions/${sessionId}/session-notes`);

      const json =
        (await response.json()) as GetSessionNotesBySessionIdQueryResponse;
      return json;
    },
    enabled: !!sessionId,
  });
