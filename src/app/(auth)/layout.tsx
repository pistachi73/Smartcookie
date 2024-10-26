import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative items-center flex justify-center py-0 sm:p-14 px-0 min-h-screen">
      <Button asChild variant="outline" className="absolute top-4 left-4">
        <Link href={"/"}>
          <ArrowLeft size={18} className="mr-2" />
          Back to home page
        </Link>
      </Button>

      {children}
    </div>
  );
};

export default AuthLayout;
