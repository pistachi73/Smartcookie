import { Footer } from "@/shared/components/layout/footer";
import { Header } from "@/shared/components/layout/header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
