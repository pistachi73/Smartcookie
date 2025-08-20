import { HugeiconsIcon } from "@hugeicons/react";
import { Tick02Icon } from "@hugeicons-pro/core-solid-rounded";
import * as m from "motion/react-m";

import {
  UserAvatar,
  type UserAvatarProps,
} from "@/shared/components/ui/user-avatar";
import { cn } from "@/shared/lib/classes";

import { avatarSizes } from "../ui/avatar";

export const StudentProfile = ({
  name,
  email,
  image,
  isSelected,
  className,
  avatarSize = "md",
}: {
  name: string;
  email?: string;
  image: string | null;
  isSelected?: boolean;
  className?: string;
  avatarSize?: UserAvatarProps["size"];
}) => {
  const size = avatarSizes[avatarSize];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative h-full">
        <div
          style={{
            width: size.width,
            height: size.height,
          }}
        >
          <UserAvatar userImage={image} userName={name} size={avatarSize} />

          {isSelected && (
            <m.div
              className="w-full h-full z-10 absolute top-0 right-0 flex items-center justify-center bg-primary text-primary-fg rounded-full"
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
      </div>
      <div className="space-y-0.5 text-left">
        <p className="text-sm font-medium">{name}</p>
        {email && (
          <p className="text-xs font-normal text-muted-fg line-clamp-1">
            {email}
          </p>
        )}
      </div>
    </div>
  );
};
