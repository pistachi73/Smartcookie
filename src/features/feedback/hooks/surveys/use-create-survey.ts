import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreateSurveySchema } from "../../lib/surveys.schema";
import { createSurveyUseCase } from "../../use-cases/surveys.use-case";

export const useCreateSurvey = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: CreateSurveySchema,
    mutationFn: createSurveyUseCase,
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
