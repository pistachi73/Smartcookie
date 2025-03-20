import { Auth } from "@/features/auth/components";
import { AuthStoreProvider } from "@/features/auth/store/auth-store-provider";

const ForgotPassword = () => {
  return (
    <AuthStoreProvider initialStore={{ step: "RESET_PASSWORD" }}>
      <Auth />
    </AuthStoreProvider>
  );
};

export default ForgotPassword;
