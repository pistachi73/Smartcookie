import { Avatar, type AvatarProps } from "@/shared/components/ui/avatar";
import { useMemo } from "react";

// Using custom color CSS variables from globals.css
const AVATAR_COLORS = [
  "bg-[var(--color-custom-flamingo-bg)] text-[var(--fg)]",
  "bg-[var(--color-custom-tangerine-bg)] text-[var(--fg)]",
  "bg-[var(--color-custom-banana-bg)] text-[var(--fg)]",
  "bg-[var(--color-custom-sage-bg)] text-[var(--fg)]",
  "bg-[var(--color-custom-peacock-bg)] text-[var(--fg)]",
  "bg-[var(--color-custom-blueberry-bg)] text-[var(--fg)]",
  "bg-[var(--color-custom-lavender-bg)] text-[var(--fg)]",
  "bg-[var(--color-custom-grape-bg)] text-[var(--fg)]",
  "bg-[var(--color-custom-graphite-bg)] text-[var(--fg)]",
  "bg-[var(--color-custom-sunshine-bg)] text-[var(--fg)]",
  "bg-[var(--color-custom-neutral-bg)] text-[var(--fg)]",
];

export interface UserAvatarProps extends AvatarProps {
  className?: string;
  userImage?: string | null;
  userName?: string | null;
  userEmail?: string | null;
}

export const UserAvatar = ({
  className,
  userImage,
  userName,
  userEmail,
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
      className={`${className || ""} ${!userImage && initials ? avatarColorClass : ""}`}
      src={userImage ?? undefined}
      initials={initials}
      alt={userName ?? undefined}
      {...props}
    />
  );
};
