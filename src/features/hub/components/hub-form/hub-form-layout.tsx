import { Heading } from "@/shared/components/ui/heading";
import { cn } from "@/shared/lib/utils";

export const HubFormLayout = ({
  children,
  header,
  subHeader,
  className,
}: {
  children: React.ReactNode;
  header: string;
  subHeader: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "h-full w-full bg-bg overflow-y-auto pt-12 pb-12 px-4",
        className,
      )}
    >
      <div className="w-full bg-bg flex flex-col items-center max-w-3xl mx-auto gap-6">
        <div className="flex flex-col items-center gap-6 w-full">
          <div className="flex flex-col items-center gap-2 text-center max-w-2xl">
            <Heading
              level={1}
              tracking="tight"
              className="sm:text-2xl font-bold"
            >
              {header}
            </Heading>
            <p className="text-base text-muted-fg leading-relaxed max-w-[34ch]">
              {subHeader}
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
