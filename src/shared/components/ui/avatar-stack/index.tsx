"use client";

import { useMemo } from "react";
import { tv, type VariantProps } from "tailwind-variants";

import { StudentProfile } from "../../students/student-profile";
import { Avatar } from "../avatar";
import { Tooltip } from "../tooltip";
import { UserAvatar } from "../user-avatar";

const avatarStack = tv({
  base: "flex",
  variants: {
    spacing: {
      tight: "-space-x-2.5",
      normal: "-space-x-1.5",
      loose: "-space-x-0.5",
    },
    size: {
      xs: "",
      sm: "",
      md: "",
      lg: "",
      xl: "",
    },
  },
  defaultVariants: {
    spacing: "normal",
    size: "md",
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
  showTooltips?: boolean;
  keyPrefix?: string;
};

export const AvatarStack = <TUser extends User>({
  users,
  maxAvatars = 5,
  spacing = "normal",
  size = "md",
  className,
  showTooltips = true,
  keyPrefix = "avatar-stack",
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
        <div key={`${keyPrefix}-${user.id}`} className="relative">
          {showTooltips ? (
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
          ) : (
            <UserAvatar
              userName={user.name}
              userImage={user.image}
              size={size}
              className={className?.avatar}
            />
          )}
        </div>
      ))}
      {hasOverflow && (
        <div className="relative z-10">
          {showTooltips ? (
            <Tooltip delay={100} closeDelay={100}>
              <Tooltip.Trigger data-testid="overflow-avatar">
                <Avatar
                  className="bg-secondary outline-overlay"
                  initials={`+${overflowCount}`}
                  size={size}
                />
              </Tooltip.Trigger>
              <Tooltip.Content className="space-y-3 p-3">
                {overflowUsers.map((user) => (
                  <StudentProfile
                    key={`${keyPrefix}-${user.id}-user-overflow`}
                    name={user.name}
                    email={user.email ?? undefined}
                    image={user.image}
                    avatarSize={size}
                  />
                ))}
              </Tooltip.Content>
            </Tooltip>
          ) : (
            <Avatar
              className="bg-secondary outline-overlay"
              initials={`+${overflowCount}`}
              size={size}
            />
          )}
        </div>
      )}
    </div>
  );
};
