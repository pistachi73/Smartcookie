import { NavigationButtons } from "@/features/account/components/navigation-buttons";
import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <MaxWidthWrapper className="max-w-[1400px] lg:mt-9 flex flex-col lg:flex-row gap-8">
      <div className="basis-full lg:basis-[30%] lg:space-y-14 lg:-ml-4">
        <NavigationButtons />
      </div>
      <div className="basis-[70%]">{children}</div>
    </MaxWidthWrapper>
  );
};

export default AccountLayout;
