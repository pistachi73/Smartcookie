import { Auth } from "@/features/auth/components";
import { AuthStoreProvider } from "@/features/auth/store/auth-store-provider";

const LoginPage = () => {
  return (
    <AuthStoreProvider initialStore={{ step: "LANDING" }}>
      <Auth className="shadow-md h-screen" />
    </AuthStoreProvider>
  );
};

export default LoginPage;
