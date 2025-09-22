"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons-pro/core-stroke-rounded";

import { Button } from "@/shared/components/ui/button";

interface AddSessionButtonProps {
  onPress: () => void;
}

export const AddSessionButton = ({ onPress }: AddSessionButtonProps) => {
  return (
    <Button
      intent="primary"
      size="md"
      onPress={onPress}
      className={
        "shrink-0 size-9 p-0! @2xl:px-2.5! @2xl:w-auto @2xl:h-10 text-sm"
      }
    >
      <HugeiconsIcon icon={PlusSignIcon} size={16} />
      <span className="hidden @2xl:block">Add session</span>
    </Button>
  );
};
