import { cva } from "class-variance-authority";
import {
  ModalOverlay,
  type ModalOverlayProps,
  Modal as RACModal,
} from "react-aria-components";

export const overlayStyles = cva(
  "fixed inset-0 z-[9900] bg-black/25 backdrop-blur flex items-center justify-center",
  {
    variants: {
      isEntering: {
        true: "animate-in fade-in-0 duration-200 ease-out",
      },
      isExiting: {
        true: "animate-out fade-out-0 duration-200 ease-in",
      },
    },
  },
);

export const modalStyles = cva("p-4 w-full max-w-md max-h-full rounded-2xl", {
  variants: {
    isEntering: {
      true: "animate-in zoom-in-105 slide-in-from-botom-4 ease-out duration-200",
    },
    isExiting: {
      true: "animate-out zoom-out-95 slide-out-to-bottom-4 ease-in duration-200",
    },
  },
});

export function Modal(props: ModalOverlayProps) {
  return (
    <ModalOverlay {...props} className={overlayStyles}>
      <RACModal {...props} className={modalStyles} />
    </ModalOverlay>
  );
}
