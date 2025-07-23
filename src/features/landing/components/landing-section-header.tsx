import { HugeiconsIcon } from "@hugeicons/react";
import type { UserGroupIcon } from "@hugeicons-pro/core-solid-rounded";

import { Badge } from "@/shared/components/ui/badge";
import { Heading } from "@/shared/components/ui/heading";

type LandingSectionHeaderProps = {
  title: string;
  description: string;
  badge: string;
  icon: typeof UserGroupIcon;
};

export const LandingSectionHeader = ({
  title,
  description,
  badge,
  icon,
}: LandingSectionHeaderProps) => {
  return (
    <div className="text-center space-y-6">
      <Badge
        intent="primary"
        className="px-4 py-2 text-sm font-medium inline-flex items-center gap-2"
      >
        <HugeiconsIcon icon={icon} size={16} />
        {badge}
      </Badge>
      <Heading
        level={2}
        tracking="tight"
        className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground"
      >
        {title}
      </Heading>
      <p className="text-lg text-muted-fg max-w-2xl mx-auto">{description}</p>
    </div>
  );
};
