import { AuthModal } from "@/features/auth/components/auth-modal";
import { AuthStoreProvider } from "@/features/auth/store/auth-store-provider";

export default function Page() {
  return (
    <AuthStoreProvider
      initialStore={{
        step: "LANDING",
      }}
    >
      <AuthModal />
    </AuthStoreProvider>
  );
}
