"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";

interface AddSessionButtonProps {
  onPress: () => void;
}

export const AddSessionButton = ({ onPress }: AddSessionButtonProps) => {
  const { down } = useViewport();
  const isMobile = down("sm");

  return (
    <Button
      intent="primary"
      size={isMobile ? "sq-sm" : "md"}
      className="shrink-0"
      onPress={onPress}
    >
      <HugeiconsIcon icon={PlusSignIcon} size={16} />
      {!isMobile && <span className="hidden @2xl:block">Add session</span>}
    </Button>
  );
};
