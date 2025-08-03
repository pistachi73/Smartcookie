import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { updateSurveyTemplate } from "@/data-access/survey-templates/mutations";
import { UpdateSurveyTemplateSchema } from "@/data-access/survey-templates/schemas";

export const useUpdateSurveyTemplate = ({
  onSuccess,
}: {
  onSuccess?: () => void;
} = {}) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: UpdateSurveyTemplateSchema,
    mutationFn: updateSurveyTemplate,
    onSuccess: (_, variables) => {
      toast.success("Survey template updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["feedback", "survey-templates"],
      });
      queryClient.invalidateQueries({
        queryKey: ["survey-template", variables.id],
      });
      onSuccess?.();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update survey template");
    },
  });
};
