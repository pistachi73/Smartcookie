import { Auth } from "@/features/auth/components";
import { AuthStoreProvider } from "@/features/auth/store/auth-store-provider";

const NewPasswordPage = () => {
  return (
    <AuthStoreProvider initialStore={{ step: "UPDATE_PASSWORD" }}>
      <Auth />
    </AuthStoreProvider>
  );
};

export default NewPasswordPage;
