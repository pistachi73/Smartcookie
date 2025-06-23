"use client";

import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { TextField } from "@/shared/components/ui/text-field";
import { cn } from "@/shared/lib/classes";
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
  const { up } = useViewport();
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
      className="flex items-center py-24 md:py-0 justify-center md:min-h-[400px] md:h-[calc(80vh)] md:max-h-[500px]"
    >
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-4">
          <Heading
            level={1}
            tracking="tighter"
            className="text-[42px] sm:text-4xl md:text-5xl lg:text-6xl"
            style={{
              lineHeight: "1.3",
            }}
          >
            Focus on teaching,
          </Heading>
          <div
            className={cn(
              "flex  lg:flex-row flex-col items-center justify-center lg:gap-1.5 text-4xl font-bold tracking-tighter text-muted-fg ",
              "text-[42px] sm:text-4xl md:text-5xl lg:text-6xl",
            )}
          >
            <span
              style={{
                lineHeight: "1.3",
              }}
              className="inline-block"
            >
              forget about
            </span>

            <motion.div
              className="relative flex flex-col lg:flex-row items-center"
              animate={{ width: up("lg") ? containerWidth : "100%" }}
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
                <div className="size-12 lg:mx-2 lg:mr-1" />
                {animatedTexts[currentTextIndex]?.text}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTextIndex}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="inline-flex gap-1.5 whitespace-nowrap items-center h-full"
                >
                  <motion.div className="overflow-hidden flex items-center lg:mx-2 lg:mr-1 h-full">
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
                            lineHeight: "1.3",
                            paddingBottom: "0.3em",
                            marginBottom: "-0.3em",
                          }}
                          className="inline-block bg-gradient-to-r from-primary to-primary-shade bg-clip-text text-transparent"
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

        <p className="max-w-[400px] sm:max-w-none mx-auto text-base leading-relaxed text-fg/80 font-medium sm:text-xl text-center text-balance tracking-tight">
          SmartCookie is a platform that helps you manage your tutoring
          business. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        {/* <div className="mt-6 flex flex-row items-center justify-center gap-2">
          <Button intent="primary" size="large" className="group h-13 px-8">
            Get Started
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              className="shrink-0 group-hover:translate-x-1 transition-transform"
            />
          </Button>
          <Button intent="secondary" size="large" className="h-13 px-8">
            Learn More
          </Button>
        </div> */}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
          <TextField
            placeholder="Enter your email"
            className={{
              primitive: "w-full max-w-[400px]",
              fieldGroup: "w-full sm:w-[400px] h-13",
            }}
          />
          <Button
            intent="primary"
            size="large"
            className="group h-13 w-full sm:w-auto max-w-[400px] sm:max-w-none"
          >
            Request a Demo
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              className="rshrink-0 group-hover:translate-x-1 transition-transform"
            />
          </Button>
        </div>
      </div>
    </MaxWidthWrapper>
  );
}
