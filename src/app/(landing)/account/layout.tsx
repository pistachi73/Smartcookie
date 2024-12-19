import { NavigationButtons } from "@/components/account/navigation-buttons";
import { MaxWidthWrapper } from "@/components/max-width-wrapper";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft02Icon } from "@hugeicons/react";
import Link from "next/link";
import { cn } from "../../../lib/utils";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MaxWidthWrapper className="max-w-[1400px] lg:mt-9 flex flex-col lg:flex-row gap-8">
      <div className="basis-full lg:basis-[30%] lg:space-y-14 lg:-ml-4">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "hidden w-fit lg:flex px-4 text-text-sub flex-row gap-2 text-sm items-center  justify-start font-normal",
          )}
        >
          <ArrowLeft02Icon size={18} />
          Back
        </Link>
        <NavigationButtons />
      </div>
      <div className="basis-[70%]">{children}</div>
    </MaxWidthWrapper>
  );
};

export default AccountLayout;
