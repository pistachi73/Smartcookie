import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";

export const useSafeAction: typeof useAction = (action, options) => {
  return useAction(action, {
    ...options,
    onError: (params) => {
      if (options?.onError) {
        options.onError(params);
        return;
      }

      if (params.error.validationErrors) {
        toast.error("Invalid input! Please check your entry and try again.");
      }
      if (typeof params.error.serverError === "string") {
        toast.error(params.error.serverError);
      }
    },
  });
};
