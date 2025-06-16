import type { GetSessionNotesBySessionIdQueryResponse } from "../lib/session-notes-query-options";

export type ClientSessionNote =
  GetSessionNotesBySessionIdQueryResponse["future"][number] & {
    clientId?: string;
  };

export type ClientSessionNotesMap = Record<
  keyof GetSessionNotesBySessionIdQueryResponse,
  ClientSessionNote[]
>;
