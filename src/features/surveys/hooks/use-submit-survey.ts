"use client";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { SubmitSurveySchema } from "../lib/survey.schema";
import { submitSurveyUseCase } from "../use-cases/surveys.use-case";

export const useSubmitSurvey = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}) => {
  return useProtectedMutation({
    schema: SubmitSurveySchema,
    mutationFn: (input) => submitSurveyUseCase(input),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      if (error instanceof Error) {
        onError?.(error.message);
      }
    },
  });
};
