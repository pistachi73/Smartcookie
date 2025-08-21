import { useMemo } from "react";

import { Avatar, type AvatarProps } from "@/shared/components/ui/avatar";

// Using custom color CSS variables from globals.css
const AVATAR_COLORS = [
  "bg-custom-flamingo-bg text-(--fg)/70",
  "bg-custom-tangerine-bg text-(--fg)/70",
  "bg-custom-banana-bg text-(--fg)/70",
  "bg-custom-sage-bg text-(--fg)/70",
  "bg-custom-peacock-bg text-(--fg)/70",
  "bg-custom-blueberry-bg text-(--fg)/70",
  "bg-custom-lavender-bg text-(--fg)/70",
  "bg-custom-grape-bg text-(--fg)/70",
  "bg-custom-graphite-bg text-(--fg)/70",
  "bg-custom-sunshine-bg text-(--fg)/70",
  "bg-custom-neutral-bg text-(--fg)/70",
];

export interface UserAvatarProps extends AvatarProps {
  className?: string;
  userImage?: string | null;
  userName?: string | null;
}

export const UserAvatar = ({
  className,
  userImage,
  userName,
  size,
  ...props
}: UserAvatarProps) => {
  const initials = useMemo(() => {
    if (!userName) return undefined;

    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  // Generate color classes based on the userName
  const { avatarColorClass } = useMemo(() => {
    if (!userName) return { avatarColorClass: "" };

    // Simple hash function
    const hash = userName.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    const colorIndex = hash % AVATAR_COLORS.length;

    return {
      avatarColorClass: AVATAR_COLORS[colorIndex],
    };
  }, [userName]);

  return (
    <Avatar
      className={`${className} ${!userImage && initials ? avatarColorClass : ""}`}
      src={userImage ?? undefined}
      initials={initials}
      alt={userName ?? undefined}
      size={size}
      {...props}
    />
  );
};
