import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { createSurveyTemplate } from "@/data-access/survey-templates/mutations";
import { CreateSurveyTemplateSchema } from "@/data-access/survey-templates/schemas";

export const useCreateSurveyTemplate = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: CreateSurveyTemplateSchema,
    mutationFn: createSurveyTemplate,
    onSuccess: () => {
      toast.success("Survey template created successfully");
      queryClient.invalidateQueries({
        queryKey: ["feedback", "survey-templates"],
      });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create survey template");
    },
  });
};
