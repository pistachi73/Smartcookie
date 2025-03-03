import { Avatar, type AvatarProps } from "@/components/ui/avatar";
import { useMemo } from "react";

type UserAvatarProps = AvatarProps & {
  className?: string;
  userImage?: string | null;
  userName?: string | null;
};

export const UserAvatar = ({ className, userImage, userName, ...props }: UserAvatarProps) => {
  const initials = useMemo(() => {
    if (!userName) return undefined;
    return userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  return (
    <Avatar
      className={className}
      src={userImage ?? undefined}
      initials={initials}
      alt={userName ?? undefined}
      {...props}
    />
  );
};
