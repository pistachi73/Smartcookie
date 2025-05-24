import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { PublicError } from "@/shared/services/errors";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createHubSurveySchema } from "../../lib/feedback.schema";
import { createHubSurveyUseCase } from "../../use-cases/feedback.use-case";

export const useCreateSurvey = ({
  hubId,
  onSuccess,
}: {
  hubId: number;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: createHubSurveySchema,
    mutationFn: async (data) => createHubSurveyUseCase(data),
    onSuccess: () => {
      toast.success("Survey created successfully");
      queryClient.invalidateQueries({ queryKey: ["hub-surveys", hubId] });
      onSuccess?.();
    },
    onError: (error) => {
      console.log(error);
      if (error instanceof PublicError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create survey");
      }
    },
  });
};
