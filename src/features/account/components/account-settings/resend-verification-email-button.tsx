import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Link } from "@/shared/components/ui/link";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";

import { isDataAccessError } from "@/data-access/errors";
import { sendEmailVerificationEmail } from "@/data-access/verification-token/mutations";
import { SendEmailVerificationEmailSchema } from "@/data-access/verification-token/schemas";

type ResendVerificationEmailButtonProps = {
  isUpdatingEmail: boolean;
  email: string;
};

export const ResendVerificationEmailButton = ({
  isUpdatingEmail,
  email,
}: ResendVerificationEmailButtonProps) => {
  const [counter, setCounter] = useState(60);

  const { mutate: resendEmailVerificationEmail } = useProtectedMutation({
    schema: SendEmailVerificationEmailSchema,
    mutationFn: sendEmailVerificationEmail,
    onSuccess: (result) => {
      if (isDataAccessError(result)) {
        toast.error("Failed to send email verification");
        return;
      }
      setCounter(60);
      toast.success("Verification code sent to your email");
    },
    onError: () => {
      toast.error("Something went wrong, please try again later.");
    },
  });

  useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => {
      timer && clearInterval(timer);
    };
  }, [counter]);

  return (
    <Link
      intent="secondary"
      className="text-sm cursor-pointer"
      isDisabled={isUpdatingEmail || counter > 0}
      onPress={() => {
        if (counter !== 0 || email) return;
        resendEmailVerificationEmail({ email });
      }}
    >
      {counter > 0 ? `Resend code in ${counter}s` : "Resend code"}
    </Link>
  );
};
