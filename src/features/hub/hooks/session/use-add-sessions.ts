import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { toast } from "sonner";
import { AddSessionsUseCaseSchema } from "../../lib/schemas";
import { addSessionUseCase } from "../../use-cases/session.use-case";

export const useAddSessions = () => {
  return useProtectedMutation({
    schema: AddSessionsUseCaseSchema.omit({ userId: true }),
    mutationFn: (data, { userId }) => addSessionUseCase({ ...data, userId }),
    onSuccess: () => {
      toast.success("Session added successfully");
    },
  });
};
