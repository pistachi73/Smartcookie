import type { SessionNotePosition } from "@/db/schema";
import type { getSessionNotesUseCase } from "../use-cases/session-notes.use-case";

export type SessionNote = Awaited<
  ReturnType<typeof getSessionNotesUseCase>
>["future"][number] & {
  clientId?: string;
};

export type SessionNotesMap = Record<SessionNotePosition, SessionNote[]>;
