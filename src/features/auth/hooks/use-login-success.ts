import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

import { DEFAULT_LOGIN_REDIRECT } from "@/core/config/app-config";
import { useRouter } from "@/i18n/navigation";

export const useLoginSuccess = () => {
  const router = useRouter();
  const params = useSearchParams();
  const session = useSession();
  const callbackUrl = params.get("callbackUrl");

  const onLoginSuccess = () => {
    session.update();
    router.push(callbackUrl || DEFAULT_LOGIN_REDIRECT);
  };

  return onLoginSuccess;
};
