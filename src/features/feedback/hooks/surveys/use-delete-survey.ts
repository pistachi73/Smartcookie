import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteSurveySchema } from "../../lib/surveys.schema";
import { deleteSurveyUseCase } from "../../use-cases/surveys.use-case";

export const useDeleteSurvey = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: DeleteSurveySchema,
    mutationFn: (data) => deleteSurveyUseCase(data),

    onSuccess: () => {
      toast.success("Survey deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["feedback", "surveys"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to delete survey");
    },
  });
};
