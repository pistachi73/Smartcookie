"use client";

import { cn } from "@/lib/utils";
import { useCalendarStore } from "@/providers/calendar-store-provider";
import { regularSpring } from "@/utils/animation";
import { AnimatePresence, motion } from "motion/react";
import { useShallow } from "zustand/react/shallow";
import { CalendarSidebarEditSession } from "./calendar-sidebar-edit-session";
import { CalendarSidebarMain } from "./calendar-sidebar-main";

const useCalendarSidebar = () =>
  useCalendarStore(
    useShallow((store) => ({
      activeSidebar: store.activeSidebar,
    })),
  );

export const CalendarSidebar = () => {
  const { activeSidebar } = useCalendarSidebar();
  return (
    <div
      className={cn(
        "h-full w-[280px] rounded-xl shrink-0 bg-base relative transition-[width] duration-500",
      )}
    >
      <AnimatePresence>
        {activeSidebar === "main" && (
          <motion.div
            className="z-1000"
            key="main"
            initial={{
              opacity: 1,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={regularSpring}
          >
            <CalendarSidebarMain />
          </motion.div>
        )}

        {activeSidebar === "edit-session" && (
          <div key={"edit-session"}>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: {
                  delay: 0.15,
                },
              }}
              className="fixed h-[100vh] w-[100vw] bg-background/50 top-0 left-0 z-200"
            />
            <motion.div
              initial={{
                height: "100%",
              }}
              animate={{
                height: "calc(100dvh - 16px)",
                width: "calc(100% + 50px)",
              }}
              // transition={regularSpring}
              className="absolute bottom-0 right-0 bg-base border   rounded-xl z-200"
            >
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.3,
                }}
                className="h-full w-full brightness-125 "
              >
                <CalendarSidebarEditSession />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
