import { checkSessionConflicts } from "@/data-access/sessions/mutations";
import { CheckSessionConflictsSchema } from "@/data-access/sessions/schemas";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

export const useCheckSessionConflicts = () => {
  return useProtectedMutation({
    schema: CheckSessionConflictsSchema,
    mutationFn: checkSessionConflicts,
  });
};
