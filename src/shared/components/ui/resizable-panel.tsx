"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  type ComponentProps,
  type ReactNode,
  createContext,
  useContext,
} from "react";
import useMeasure from "react-use-measure";

const PanelContext = createContext({ value: "" });

export function ResizablePanelRoot({
  children,
  value,
  rerenderKey,
  customHeight,
  ...rest
}: {
  children: ReactNode;
  value: string;
  rerenderKey?: string;
  customHeight?: number;
} & ComponentProps<"div">) {
  const [ref, bounds] = useMeasure();

  return (
    <motion.div
      animate={{
        height:
          customHeight !== undefined
            ? customHeight
            : bounds.height > 0
              ? bounds.height
              : undefined,
      }}
      transition={{ type: "spring", bounce: 0, duration: 0.5 }}
      style={{ overflow: "hidden", position: "relative" }}
      className="w-full"
    >
      <div ref={ref} className={"w-full"}>
        <PanelContext.Provider value={{ value }}>
          <div {...rest}>{children}</div>
        </PanelContext.Provider>
      </div>
    </motion.div>
  );
}

export function ResizablePanelContent({
  value,
  children,
  ...rest
}: {
  value: string;
  children?: ReactNode;
} & ComponentProps<"div">) {
  const panelContext = useContext(PanelContext);
  const isActive = panelContext.value === value;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              type: "ease",
              ease: "easeInOut",
              duration: 0.3,
              delay: 0.2,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              type: "ease",
              ease: "easeInOut",
              duration: 0.2,
            },
          }}
          className={"w-full"}
        >
          <div {...rest}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
