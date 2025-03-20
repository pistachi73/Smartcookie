import type { Transition } from "motion/react";

export const regularSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 35,
};
