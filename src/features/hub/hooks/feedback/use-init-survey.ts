import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createHubSurveySchema } from "../../lib/feedback.schema";
import { createHubSurveyUseCase } from "../../use-cases/feedback.use-case";

export const useInitSurvey = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: createHubSurveySchema,
    mutationFn: async (data) => createHubSurveyUseCase(data),
    onSuccess: (res, data) => {
      const { success, message } = res;
      if (success) {
        toast.success("Survey created successfully");
        queryClient.invalidateQueries({
          queryKey: ["hub-surveys", data.hubId],
        });
        onSuccess?.();
      } else {
        toast.error(message);
      }
    },
    onError: () => {
      toast.error("Failed to create survey");
    },
  });
};
