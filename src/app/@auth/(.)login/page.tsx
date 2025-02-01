import { AuthModal } from "@/components/auth/auth-modal";
import { AuthStoreProvider } from "@/providers/auth-store-provider";

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
