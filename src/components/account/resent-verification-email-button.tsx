import { Button } from "@/components/ui/button";
import { useSafeAction } from "@/hooks/use-safe-action";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { resendEmailVerificationEmailAction } from "../auth/actions";

type ResendVerificationEmailButtonProps = {
  isUpdatingEmail: boolean;
  email: string;
};

export const ResendVerificationEmailButton = ({
  isUpdatingEmail,
  email,
}: ResendVerificationEmailButtonProps) => {
  const [counter, setCounter] = useState(60);

  const { execute: resendVerificationToken } = useSafeAction(
    resendEmailVerificationEmailAction,
    {
      onSuccess: () => {
        toast.success("Verification code sent to your email!");
        setCounter(60);
      },
    },
  );

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => {
      timer && clearInterval(timer);
    };
  }, [counter]);

  return (
    <Button
      size="inline"
      variant="link"
      className={cn("text-sm font-light text-muted-foreground", {
        "pointer-events-none": counter > 0,
      })}
      type="button"
      isDisabled={isUpdatingEmail}
      onPress={() => {
        if (counter !== 0) return;
        resendVerificationToken(email);
      }}
    >
      {counter > 0 ? `Resend code in ${counter}s` : "Resend code"}
    </Button>
  );
};
