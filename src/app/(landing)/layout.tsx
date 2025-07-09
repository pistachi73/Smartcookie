import { Footer } from "@/shared/components/layout/footer";
import { Header } from "@/shared/components/layout/header";
import { currentUser } from "@/shared/lib/auth";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  return (
    <>
      <Header user={user} />
      {children}
      <Footer />
    </>
  );
}
