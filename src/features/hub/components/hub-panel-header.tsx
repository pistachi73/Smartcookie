import { Heading } from "@/shared/components/ui/heading";
import { cn } from "@/shared/lib/classes";

type HubPanelHeaderProps = {
  title: string;
  actions: React.ReactNode;
};

export const HubPanelHeader = ({ title, actions }: HubPanelHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between mb-4 flex-wrap gap-3 ">
      <Heading level={2}>{title}</Heading>
      <div
        className={cn(
          "fixed bottom-0 py-3  left-0 px-3  w-full  z-10  bg-white border-t",
          "items-center sm:py-0 sm:px-0 sm:w-fit sm:flex sm:static sm:bg-transparent sm:border-none",
        )}
      >
        {actions}
      </div>
    </div>
  );
};
