"use client";

import { cn } from "@/shared/lib/classes";
import { useMemo } from "react";
import { type VariantProps, tv } from "tailwind-variants";
import { Avatar } from "./avatar";
import { Tooltip } from "./tooltip";
import { UserAvatar } from "./user-avatar";

const avatarStack = tv({
  base: "flex",
  variants: {
    spacing: {
      tight: "-space-x-2.5",
      normal: "-space-x-1.5",
      loose: "-space-x-0.5",
    },
    size: {
      "extra-small": "",
      small: "",
      medium: "",
      large: "",
      "extra-large": "",
    },
  },
  defaultVariants: {
    spacing: "normal",
    size: "medium",
  },
});

export interface User {
  id: string | number;
  name: string;
  image: string | null;
  email?: string | null;
}

export type AvatarStackProps<TUser extends User> = VariantProps<
  typeof avatarStack
> & {
  users: TUser[];
  maxAvatars?: number;
  className?: {
    container?: string;
    avatar?: string;
  };
  isTestEnv?: boolean;
};

export const AvatarStack = <TUser extends User>({
  users,
  maxAvatars = 5,
  spacing = "normal",
  size = "medium",
  className,
}: AvatarStackProps<TUser>) => {
  const { visibleUsers, overflowUsers, hasOverflow } = useMemo(() => {
    if (users.length <= maxAvatars) {
      return {
        visibleUsers: users,
        overflowUsers: [],
        hasOverflow: false,
      };
    }

    return {
      visibleUsers: users.slice(0, maxAvatars),
      overflowUsers: users.slice(maxAvatars),
      hasOverflow: true,
    };
  }, [users, maxAvatars]);

  const overflowCount = overflowUsers.length;

  return (
    <div
      className={avatarStack({
        spacing,
        size,
        className: className?.container,
      })}
      data-testid="avatar-stack"
    >
      {visibleUsers.map((user) => (
        <div key={user.id} className="relative">
          <Tooltip delay={100} closeDelay={100}>
            <Tooltip.Trigger>
              <UserAvatar
                userName={user.name}
                userImage={user.image}
                size={size}
                className={className?.avatar}
              />
            </Tooltip.Trigger>
            <Tooltip.Content className="px-3 py-2">
              <p className="font-medium">{user.name}</p>
              {user.email && (
                <p className="text-xs text-muted-fg">{user.email}</p>
              )}
            </Tooltip.Content>
          </Tooltip>
        </div>
      ))}
      {hasOverflow && (
        <div className="relative z-10">
          <Tooltip delay={100} closeDelay={100}>
            <Tooltip.Trigger data-testid="overflow-avatar">
              <Avatar
                className="bg-overlay-elevated outline-overlay"
                initials={`+${overflowCount}`}
                size={size}
              />
            </Tooltip.Trigger>
            <Tooltip.Content className="space-y-2 max-w-xs px-3 py-2">
              {overflowUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-1.5 py-1">
                  <UserAvatar
                    className={cn(
                      "bg-overlay-elevated-highlight",
                      className?.avatar,
                    )}
                    userName={user.name}
                    userImage={user.image}
                    size={size}
                  />
                  <div>
                    <p className="font-medium">{user.name}</p>
                    {user.email && (
                      <p className="text-xs text-muted-fg">{user.email}</p>
                    )}
                  </div>
                </div>
              ))}
            </Tooltip.Content>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
