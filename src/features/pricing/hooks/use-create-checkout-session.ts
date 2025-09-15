import { toast } from "sonner";

import { useCurrentUser } from "@/shared/hooks/use-current-user";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { createCheckoutSession } from "@/data-access/payment/mutations";
import { createCheckoutSessionSchema } from "@/data-access/payment/schemas";
import { useRouter } from "@/i18n/navigation";

type UseCreateCheckoutSessionProps = {
  onSuccess?: () => void;
};

export const useCreateCheckoutSession = ({
  onSuccess,
}: UseCreateCheckoutSessionProps = {}) => {
  const router = useRouter();
  const user = useCurrentUser();

  const { mutate, isPending } = useProtectedMutation({
    schema: createCheckoutSessionSchema,
    mutationFn: createCheckoutSession,
    onSuccess: (result) => {
      if (isDataAccessError(result)) {
        switch (result.type) {
          case "USER_ALREADY_HAS_SUBSCRIPTION":
            onSuccess?.();
            router.push("/portal/account?t=subscription");
            return;
        }

        toast.error("Failed to create checkout session");
        return;
      }

      if (!result.checkoutSession.url) {
        toast.error("Error creating checkout session. Please contact support.");
        return;
      }

      router.push(result.checkoutSession.url);
    },
  });

  const handleCreateCheckoutSession = ({ priceId }: { priceId: string }) => {
    if (!user) {
      router.push("/login");
      return;
    }
    mutate({ priceId });
  };

  return {
    mutate: handleCreateCheckoutSession,
    isPending,
  };
};
