import { Auth } from "@/components/auth";
import { AuthStoreProvider } from "@/providers/auth-store-provider";

const LoginPage = () => {
  return (
    <AuthStoreProvider initialStore={{ step: "LANDING" }}>
      <Auth className="shadow-md h-screen" />
    </AuthStoreProvider>
  );
};

export default LoginPage;
