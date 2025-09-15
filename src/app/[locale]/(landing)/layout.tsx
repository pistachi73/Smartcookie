import { Footer } from "@/shared/components/layout/footer";
import { Header } from "@/shared/components/layout/header";
import { currentUser } from "@/shared/lib/auth";
import { getHeaders } from "@/shared/lib/get-headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headers = await getHeaders();
  const user = await currentUser();
  return (
    <>
      <Header user={user} portalEnabled={headers.portalEnabled} />
      {children}
      <Footer />
    </>
  );
}
