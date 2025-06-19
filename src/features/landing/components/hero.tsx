"use client";

import { Button } from "@/shared/components/ui/button";
import { Heading } from "@/shared/components/ui/heading";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const animatedTexts = [
  "admin.",
  "spreadsheets.",
  "last-minute prep.",
  "chaotic notes.",
];

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
    <section className="flex items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6">
          <Heading
            level={1}
            tracking="tighter"
            className="mb-4 text-4xl sm:text-5xl md:text-6xl lg:text-6xl"
          >
            Focus on teaching,
          </Heading>
          <div className="flex items-baseline justify-center gap-2 text-4xl font-bold tracking-tighter text-muted-fg sm:text-5xl md:text-6xl lg:text-6xl">
            <div>forget about</div>
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
                className="absolute invisible whitespace-nowrap"
                aria-hidden="true"
              >
                {animatedTexts[currentTextIndex]}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTextIndex}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="inline-flex gap-1.5 whitespace-nowrap h-full"
                >
                  {(animatedTexts[currentTextIndex] || "")
                    .split(" ")
                    .map((word, wordIndex) => (
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
                            delay: wordIndex * 0.2,
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

        <div className="mx-auto max-w-2xl">
          <p className="text-base leading-relaxed text-muted-fg sm:text-base text-center text-balance ">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="mt-6 flex flex-row items-center justify-center gap-2">
          <Button intent="primary" size="large" className="group">
            Get Started
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={20}
              className="shrink-0 group-hover:translate-x-1 transition-transform"
            />
          </Button>
          <Button intent="outline" size="large">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
