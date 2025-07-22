import { z } from "zod";

import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { checkStudentHasSurveyAccessUseCase } from "../use-cases/surveys.use-case";

export const useStudentHasSurveyAccess = () => {
  return useProtectedMutation({
    schema: z.object({
      email: z.string().email(),
      surveyId: z.string(),
    }),
    mutationFn: (data) => checkStudentHasSurveyAccessUseCase(data),
  });
};
