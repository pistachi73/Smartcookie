"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { Button, type ButtonProps } from "react-aria-components";

import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { cn } from "@/shared/lib/classes";

import { useDeleteProgressButton } from "./use-delete-progress-button";

type DeleteProgressButtonProps = Omit<
  ButtonProps,
  "onPressStart" | "onPressEnd" | "className"
> & {
  onDelete: () => void;
  className?: {
    container?: string;
    button?: string;
    progressCircle?: string;
  };
  pressDuration?: number;
};

export const DeleteProgressButton = ({
  onDelete,
  className,
  pressDuration,
  ...props
}: DeleteProgressButtonProps) => {
  const { isDeleting, deleteProgress, handleDeletePress, handleDeleteRelease } =
    useDeleteProgressButton({
      onDelete,
      pressDuration,
    });

  return (
    <div className={cn("relative z-10", className?.container)}>
      <Button
        onPressStart={handleDeletePress}
        onPressEnd={handleDeleteRelease}
        aria-label="Delete note"
        className={({ isDisabled }) =>
          cn(
            "size-9 z-20 flex items-center justify-center text-muted-fg hover:bg-transparent!",
            isDisabled && "opacity-50",
            className?.button,
          )
        }
        {...props}
      >
        <HugeiconsIcon
          icon={Delete01Icon}
          size={14}
          data-slot="icon"
          className={cn("transition-colors", isDeleting && "text-danger")}
        />
      </Button>
      <AnimatePresence>
        {isDeleting && (
          <m.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          >
            <ProgressCircle
              value={deleteProgress}
              strokeWidth={2}
              aria-label="Delete progress circle"
              className={cn("size-8 text-danger", className?.progressCircle)}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};
