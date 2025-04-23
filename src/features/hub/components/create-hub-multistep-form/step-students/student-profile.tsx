import { UserAvatar } from "@/shared/components/ui/user-avatar";
import { cn } from "@/shared/lib/classes";
import { Tick02Icon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import * as m from "motion/react-m";

export const StudentProfile = ({
  name,
  email,
  image,
  isSelected,
  className,
}: {
  name: string;
  email: string;
  image: string | null;
  isSelected?: boolean;
  className?: string;
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative size-8">
        <UserAvatar userImage={image} userName={name} />

        {isSelected && (
          <m.div
            className="w-full h-full z-10 absolute top-0 right-0 flex items-center justify-center bg-primary rounded-full"
            initial={{ opacity: 1, scale: 0.25 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              mass: 0.5,
            }}
          >
            <HugeiconsIcon icon={Tick02Icon} size={16} />
          </m.div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-fg line-clamp-1">{email}</p>
      </div>
    </div>
  );
};
