"use client";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { submitSurvey } from "@/data-access/surveys/mutations";
import { SubmitSurveySchema } from "@/data-access/surveys/schemas";

export const useSubmitSurvey = ({
  onSuccess,
}: {
  onSuccess?: (res: unknown) => void;
}) => {
  return useProtectedMutation({
    schema: SubmitSurveySchema,
    mutationFn: submitSurvey,
    onSuccess: (res) => {
      onSuccess?.(res);
    },
  });
};
