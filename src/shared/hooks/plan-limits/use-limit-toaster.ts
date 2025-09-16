import { toast } from "sonner";

import { useRouter } from "@/i18n/navigation";

export const useLimitToaster = ({
  resourceType,
}: {
  resourceType: "hub" | "student" | "note";
}) => {
  const router = useRouter();

  return () => {
    toast.error("Limit reached", {
      duration: 5000,
      description: `You have reached the limit for ${resourceType}s. Please upgrade your plan to continue.`,
      action: {
        label: "Upgrade",
        onClick: () => {
          router.push("/portal/account/subscription");
        },
      },
    });
  };
};
