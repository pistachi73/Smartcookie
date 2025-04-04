import { useQuery } from "@tanstack/react-query";
import { getSessionNotesUseCase } from "../../use-cases/session-notes/get-session-notes.use-case";

export const useSessionNotes = ({
  sessionId,
  enabled,
}: { sessionId: number; enabled?: boolean }) => {
  return useQuery({
    queryKey: ["session-notes", sessionId],
    queryFn: () => getSessionNotesUseCase({ sessionId }),
    enabled,
  });
};
