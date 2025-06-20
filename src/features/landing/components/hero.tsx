"use client";

import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import {
  StickyNote02Icon,
  TableIcon,
  Time02Icon,
  UserSettingsIcon,
} from "@hugeicons-pro/core-solid-rounded";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const animatedTexts = [
  { text: "admin.", icon: UserSettingsIcon },
  { text: "spreadsheets.", icon: TableIcon },
  { text: "last-minute prep.", icon: Time02Icon },
  { text: "chaotic notes.", icon: StickyNote02Icon },
] as const;

export function Hero() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const measureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (measureRef.current) {
      setContainerWidth(measureRef.current.offsetWidth);
    }
  }, [currentTextIndex]);

  return (
    <MaxWidthWrapper
      as="section"
      className="flex items-center justify-center px-4 py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-4">
          <Heading
            level={1}
            tracking="tighter"
            className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-6xl"
          >
            Focus on teaching,
          </Heading>
          <div className="flex  justify-center gap-1.5 text-4xl font-bold tracking-tighter text-muted-fg sm:text-5xl md:text-6xl lg:text-6xl">
            <div className="">forget about</div>

            <motion.div
              className="relative"
              animate={{ width: containerWidth }}
              transition={{
                type: "spring",
                stiffness: 140,
                damping: 25,
                mass: 1.1,
              }}
            >
              {/* Hidden element to measure width */}
              <div
                ref={measureRef}
                className="absolute invisible whitespace-nowrap flex gap-1.5"
                aria-hidden="true"
              >
                <div className="size-12 mx-2 mr-1" />
                {animatedTexts[currentTextIndex]?.text}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTextIndex}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="inline-flex gap-1.5 whitespace-nowrap -translate-y-3"
                >
                  <motion.div className="overflow-hidden flex items-center mx-2 mr-1 translate-y-1">
                    <motion.div
                      variants={{
                        hidden: {
                          y: "110%",
                        },
                        visible: {
                          y: "0%",
                        },
                        exit: {
                          y: "-110%",
                        },
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 30,
                      }}
                      className="flex items-center justify-center h-full"
                    >
                      <div className="size-12 rounded-xl bg-primary shrink-0 flex items-center justify-center">
                        <HugeiconsIcon
                          icon={
                            animatedTexts[currentTextIndex]?.icon ??
                            StickyNote02Icon
                          }
                          size={20}
                          className="shrink-0 group-hover:translate-x-1 transition-transform text-primary-fg"
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                  {animatedTexts[currentTextIndex]?.text
                    .split(" ")
                    .map((word: string, wordIndex: number) => (
                      <motion.div
                        key={`${currentTextIndex}-${wordIndex}`}
                        className="overflow-hidden"
                      >
                        <motion.span
                          variants={{
                            hidden: {
                              y: "100%",
                            },
                            visible: {
                              y: "0%",
                            },
                            exit: {
                              y: "-100%",
                            },
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 220,
                            damping: 30,
                            delay: (wordIndex + 1) * 0.15,
                          }}
                          style={{
                            lineHeight: "1.2",
                            paddingBottom: "0.2em",
                            marginBottom: "-0.2em",
                          }}
                          className="h-full inline-block bg-gradient-to-r from-primary to-primary-shade bg-clip-text text-transparent"
                        >
                          {word}
                        </motion.span>
                      </motion.div>
                    ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>

        <p className="text-base leading-relaxed text-fg/80 font-medium sm:text-xl text-center text-balance tracking-tight">
          SmartCookie is a platform that helps you manage your tutoring
          business. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-2">
          <Button intent="primary" size="large" className="group sm:h-13 px-8">
            Get Started
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              className="shrink-0 group-hover:translate-x-1 transition-transform"
            />
          </Button>
          <Button intent="secondary" size="large" className="sm:h-13 px-8">
            Learn More
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
