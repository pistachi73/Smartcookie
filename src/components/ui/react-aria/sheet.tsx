import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { useContext } from "react";
import {
  ModalOverlay,
  type ModalOverlayProps,
  OverlayTriggerStateContext,
  Modal as RACModal,
} from "react-aria-components";

const overlayStyles = cva(
  "fixed inset-0 z-50 transition-colors bg-black/80 ease-out duration-[200ms]",
  {
    variants: {
      isEntering: {
        true: "animate-overlay-fade-in",
      },
      isExiting: {
        true: "animate-overlay-fade-out",
      },
    },
  },
);

const sheetStyles = cva("fixed bg-background p-4 duration-[200ms]", {
  variants: {
    isEntering: {
      true: "animate-in ",
    },
    isExiting: {
      true: "animate-out",
    },
    side: {
      top: "top-0 data-[entering]:slide-in-from-top data-[exiting]:slide-out-to-top w-full rounded-b-lg left-1/2 -translate-x-1/2 top-0",
      bottom:
        "bottom-0 data-[entering]:slide-in-from-bottom data-[exiting]:slide-out-to-bottom w-full rounded-t-lg bottom-0 left-1/2 -translate-x-1/2",
      left: "p-6 data-[entering]:slide-in-from-left data-[exiting]:slide-out-to-left h-[var(--visual-viewport-height)] rounded-r-lg top-1/2 -translate-y-1/2 left-0",
      right:
        "p-6 data-[entering]:slide-in-from-right data-[exiting]:slide-out-to-right h-[var(--visual-viewport-height)] rounded-l-lg top-1/2 -translate-y-1/2 right-0",
    },
  },
});

type SheetProps = ModalOverlayProps & {
  side?: "top" | "bottom" | "left" | "right";
};

export const Sheet = ({ side = "bottom", className, ...props }: SheetProps) => {
  const state = useContext(OverlayTriggerStateContext)!;
  return (
    <ModalOverlay {...props} className={overlayStyles}>
      <RACModal
        {...props}
        className={({ isEntering, isExiting }) =>
          cn(sheetStyles({ isEntering, isExiting, side }), className)
        }
      />
    </ModalOverlay>
  );
};
