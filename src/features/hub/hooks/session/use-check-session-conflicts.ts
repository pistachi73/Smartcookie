import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { CheckSessionConflictsUseCaseSchema } from "../../lib/sessions.schema";
import { checkSessionConflictsUseCase } from "../../use-cases/sessions.use-case";

export const useCheckSessionConflicts = () => {
  return useProtectedMutation({
    schema: CheckSessionConflictsUseCaseSchema,
    mutationFn: (data) => checkSessionConflictsUseCase(data),
  });
};
