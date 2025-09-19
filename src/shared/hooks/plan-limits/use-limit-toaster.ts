import { toast } from "sonner";

import { useRouter } from "@/i18n/navigation";

export const useLimitToaster = () => {
  const router = useRouter();

  return ({ title }: { title?: string } = {}) => {
    toast.error(title || "Limit reached", {
      duration: 5000,
      action: {
        label: "Upgrade",
        onClick: () => {
          router.push("/portal/account/subscription");
        },
      },
    });
  };
};
