import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { createHubSurvey } from "@/data-access/surveys/mutations";
import { createHubSurveySchema } from "../../lib/feedback.schema";

export const useInitSurvey = ({ onSuccess }: { onSuccess?: () => void }) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: createHubSurveySchema,
    mutationFn: createHubSurvey,
    onSuccess: (res, data) => {
      if (isDataAccessError(res)) {
        toast.error(res.message);
        return;
      }

      toast.success("Survey created successfully");
      queryClient.invalidateQueries({
        queryKey: ["hub-surveys", data.hubId],
      });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create survey");
    },
  });
};
