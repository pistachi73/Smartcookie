import { Avatar } from "@/components/ui/new/ui/avatar";
import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { useMemo } from "react";

const userAvatarVariants = cva(
  "flex h-full w-full items-center justify-center rounded-full",
  {
    variants: {
      size: {
        lg: "size-14",
        default: "size-12",
        sm: "size-9",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const iconSizeMap: Record<
  NonNullable<VariantProps<typeof userAvatarVariants>["size"]>,
  number
> = {
  lg: 24,
  default: 20,
  sm: 18,
};

type UserAvatarProps = VariantProps<typeof userAvatarVariants> & {
  className?: string;
  userImage?: string | null;
  userName?: string | null;
};

export const UserAvatar = ({
  className,
  userImage,
  userName,
  size,
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

  return (
    <Avatar
      className={cn(userAvatarVariants({ size }), className)}
      src={userImage ?? undefined}
      initials={initials}
      alt={userName ?? undefined}
      shape="circle"
    />
  );
};
