import type { Variants } from "motion/react";

const easing = [0.2, 0, 0, 1];

/**
 * Simple fade with subtle vertical movement animation
 * Direction-aware transitions that feel smooth and natural
 */
export const containerVariants: Variants = {
  initial: (direction: 1 | -1) => ({
    opacity: 0,
    y: direction > 0 ? 60 : -60,
  }),
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    y: direction > 0 ? -60 : 60,
    transition: {
      opacity: { duration: 0.3, ease: easing },
      y: { duration: 0.3, ease: easing },
    },
  }),
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.4, ease: easing },
      y: {
        type: "spring",
        stiffness: 90,
        damping: 15,
      },
    },
  },
};
