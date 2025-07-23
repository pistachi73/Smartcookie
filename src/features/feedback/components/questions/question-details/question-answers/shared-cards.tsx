import { HugeiconsIcon, type HugeiconsIconProps } from "@hugeicons/react";
import { UserMultiple03Icon } from "@hugeicons-pro/core-solid-rounded";

import { cn } from "@/shared/lib/classes";

export const DataCard = ({
  iconProps,
  label,
  value,
  className,
}: {
  iconProps: HugeiconsIconProps;
  label: string;
  value: React.ReactNode;
  className?: {
    icon?: string;
    label?: string;
    value?: string;
  };
}) => {
  return (
    <div className="border rounded-xl p-4 bg-overlay">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", className?.icon)}>
          <HugeiconsIcon {...iconProps} size={20} />
        </div>
        <div>
          <p className={cn("text-sm text-muted-fg", className?.label)}>
            {label}
          </p>
          <p className={cn("text-2xl font-bold", className?.value)}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export const ResponseCard = ({
  totalResponses,
}: {
  totalResponses: number;
}) => {
  return (
    <DataCard
      iconProps={{
        icon: UserMultiple03Icon,
      }}
      label="Total Responses"
      value={totalResponses}
      className={{
        icon: "bg-primary-tint text-primary",
      }}
    />
  );
};
