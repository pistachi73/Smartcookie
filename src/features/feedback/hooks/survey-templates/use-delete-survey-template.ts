import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { deleteSurveyTemplate } from "@/data-access/survey-templates/mutations";
import { DeleteSurveyTemplateSchema } from "@/data-access/survey-templates/schemas";

export const useDeleteSurveyTemplate = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  return useProtectedMutation({
    schema: DeleteSurveyTemplateSchema,
    mutationFn: deleteSurveyTemplate,

    onSuccess: () => {
      toast.success("Survey template deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["feedback", "survey-templates"],
      });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to delete survey template");
    },
  });
};
