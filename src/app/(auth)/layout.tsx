import { BackToHomePageButton } from "./_components/back-to-home-page-button";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative items-center flex justify-center py-0 sm:p-14 px-0 min-h-screen">
      <BackToHomePageButton />
      {children}
    </div>
  );
};

export default AuthLayout;
