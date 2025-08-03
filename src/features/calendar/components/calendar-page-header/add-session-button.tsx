"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

import { cn } from "@/lib/utils";

interface AddSessionButtonProps {
  onPress: () => void;
}

export const AddSessionButton = ({ onPress }: AddSessionButtonProps) => {
  const { down } = useViewport();
  const isMobile = down("sm");

  return (
    <Button
      intent="primary"
      size={isMobile ? "square-petite" : "small"}
      shape="square"
      className={cn(
        "shrink-0",
        isMobile
          ? "size-9 p-0"
          : "px-0 size-10 @2xl:h-10 @2xl:w-auto @2xl:px-4",
      )}
      onPress={onPress}
    >
      <HugeiconsIcon icon={PlusSignIcon} size={16} />
      {!isMobile && <span className="hidden @2xl:block">Add session</span>}
    </Button>
  );
};
