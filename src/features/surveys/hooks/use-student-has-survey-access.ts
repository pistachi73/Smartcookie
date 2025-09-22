import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { checkStudentHasSurveyAccess } from "@/data-access/surveys/mutations";
import { CheckStudentHasSurveyAccessSchema } from "@/data-access/surveys/schemas";

export const useStudentHasSurveyAccess = () => {
  return useProtectedMutation({
    requireAuth: false,
    schema: CheckStudentHasSurveyAccessSchema,
    mutationFn: checkStudentHasSurveyAccess,
  });
};
