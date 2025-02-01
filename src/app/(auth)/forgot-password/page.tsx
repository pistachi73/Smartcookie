import { Auth } from "@/components/auth";
import { AuthStoreProvider } from "@/providers/auth-store-provider";

const ForgotPassword = () => {
  return (
    <AuthStoreProvider initialStore={{ step: "RESET_PASSWORD" }}>
      <Auth />
    </AuthStoreProvider>
  );
};

export default ForgotPassword;
