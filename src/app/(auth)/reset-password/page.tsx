import { Auth } from "@/components/auth";
import { AuthStoreProvider } from "@/providers/auth-store-provider";

const NewPasswordPage = () => {
  return (
    <AuthStoreProvider initialStore={{ step: "UPDATE_PASSWORD" }}>
      <Auth />
    </AuthStoreProvider>
  );
};

export default NewPasswordPage;
