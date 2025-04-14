import { useQuery } from "@tanstack/react-query";
import { getSessionNotesUseCase } from "../../use-cases/session-notes.use-case";

export const createSessionNotesQueryOptions = (sessionId: number) => {
  return {
    queryKey: ["session-notes", sessionId],
    queryFn: () => getSessionNotesUseCase({ sessionId }),
  };
};

export const useSessionNotes = ({
  sessionId,
}: { sessionId: number; enabled?: boolean }) => {
  return useQuery(createSessionNotesQueryOptions(sessionId));
};
