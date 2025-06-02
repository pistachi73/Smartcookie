import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { SurveyTemplateFormSchema } from "../../lib/surveys.schema";
import { createSurveyTemplateUseCase } from "../../use-cases/survey-templates.use-case";

export const useCreateSurvey = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: SurveyTemplateFormSchema,
    mutationFn: createSurveyTemplateUseCase,
    onSuccess: () => {
      toast.success("Survey created successfully");
      queryClient.invalidateQueries({ queryKey: ["feedback", "surveys"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create survey");
    },
  });
};
