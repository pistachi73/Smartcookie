import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { deleteSurvey } from "@/data-access/surveys/mutations";
import { DeleteSurveySchema } from "@/data-access/surveys/schemas";
import { getSurveysByHubIdQueryOptions } from "../../lib/hub-surveys-query-options";

export const useDeleteSurvey = ({
  hubId,
  onSuccess,
}: {
  hubId: number;
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useProtectedMutation({
    schema: DeleteSurveySchema,
    mutationFn: deleteSurvey,
    onSuccess: () => {
      toast.success("Survey deleted successfully");
      const invalidateQueryKey = getSurveysByHubIdQueryOptions(hubId).queryKey;

      queryClient.invalidateQueries({
        queryKey: invalidateQueryKey,
      });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to delete survey");
    },
  });
};
