"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  type ComponentProps,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const PanelContext = createContext({ value: "" });

export function ResizablePanelRoot({
  children,
  value,
  ...rest
}: {
  children: ReactNode;
  value: string;
} & ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (ref.current && value) {
      const height = ref.current.getBoundingClientRect().height;
      if (height === 0) {
        setHeight(-1);
      } else {
        setHeight(height);
      }
    }
  }, [value]);
  console.log({ height });

  return (
    <motion.div
      animate={{ height: height === -1 ? 0 : height > 0 ? height : undefined }}
      transition={{ type: "spring", bounce: 0, duration: 0.8 }}
      style={{ overflow: "hidden", position: "relative" }}
    >
      <div ref={ref}>
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
        >
          <div {...rest}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
