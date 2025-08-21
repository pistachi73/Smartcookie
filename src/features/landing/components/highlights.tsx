"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  QuoteDownIcon,
  QuoteUpIcon,
  SparklesIcon,
} from "@hugeicons-pro/core-solid-rounded";
import { Brain02Icon, HealtcareIcon } from "@hugeicons-pro/core-stroke-rounded";
import * as motion from "motion/react-m";
import Image from "next/image";

import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";

import { LandingSectionHeader } from "./landing-section-header";

const MotionHugeIcons = motion.create(HugeiconsIcon);

export const Highlights = () => {
  return (
    <MaxWidthWrapper
      as="section"
      id="main-points"
      className="items-center h-full flex justify-center flex-col space-y-12"
    >
      {/* Header Section */}
      <LandingSectionHeader
        title="Built for busy teachers like you"
        description="Everything you need to manage your lessons, students, and feedback in one intuitive platform. Designed by teachers, for teachers."
        badge="Highlights"
        icon={SparklesIcon}
      />

      <div
        className={cn(
          "w-full grid gap-4",
          "grid-rows-[repeat(7,auto)] grid-cols-2",
          "sm:grid-cols-4 sm:grid-rows-[auto_auto_auto_auto]",
          "lg:grid-cols-6 lg:grid-rows-[auto_1fr_1fr]",
        )}
      >
        {/* Texas image */}
        <div
          className={cn(
            "w-full  h-full relative aspect-square rounded-xl p-6 md:p-8 overflow-hidden",
            "row-start-3 col-start-1 col-span-2 row-span-2",
            "sm:row-start-2 sm:col-start-1 sm:col-span-2 sm:row-span-2",
            "lg:col-start-1 lg:row-start-2 lg:col-span-2 lg:row-span-2",
          )}
        >
          <Image
            src="/texas.jpg"
            alt="Your Daily Teaching Companion"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 350px"
            className="object-cover aspect-square"
            priority={false}
            loading="lazy"
          />
        </div>

        {/* All-in-One Workspace */}
        <div
          className={cn(
            "flex flex-col relative bg-muted rounded-xl p-6 md:p-8 overflow-hidden",
            "aspect-auto row-start-1 col-start-1 col-span-2 row-span-1 space-y-4",
            "sm:justify-between sm:aspect-2/1 sm:row-start-2 sm:col-start-3 sm:col-span-2 sm:row-span-1",
            "lg:aspect-video lg:row-start-1 lg:col-start-1 lg:col-span-2 lg:row-span-1",
          )}
        >
          <p className="text-xl lg:text-2xl  font-semibold leading-tight">
            All your tools, one screen.
          </p>
          <p className="text-base text-muted-fg ">
            Organized. Centralized. Effortless.
          </p>
        </div>

        {/* Health care */}
        <motion.div
          initial="initial"
          whileHover="animate"
          className={cn(
            "group flex flex-col items-center justify-center overflow-hidden relative  bg-primary-tint rounded-xl p-6 md:p-8",
            "row-start-2 col-start-1 col-span-2 row-span-1 py-12",
            "sm:py-0 sm:row-start-1 sm:col-start-1 sm:col-span-2 sm:row-span-1",
            "lg:row-start-1 lg:col-start-3 lg:col-span-2 lg:row-span-1",
          )}
        >
          <MotionHugeIcons
            icon={HealtcareIcon}
            size={72}
            variants={{
              initial: {
                y: 0,
              },
              animate: {
                y: -10,
                rotate: -5,
                scale: 1.05,
              },
            }}
            transition={regularSpring}
            className="group-hover:text-primary"
          />
          <motion.p
            variants={{
              initial: {
                y: 8,
                opacity: 0,
              },
              animate: {
                y: 12,
                opacity: 1,
              },
            }}
            transition={regularSpring}
            className=" leading-0 text-base font-medium text-center text-balance"
          >
            Monitor motivation over time
          </motion.p>
        </motion.div>

        {/* Martina online image */}
        <div
          className={cn(
            " relative overflow-hidden rounded-xl p-6 md:p-8",
            "row-start-6 col-start-1 col-span-2 row-span-1",
            "sm:row-start-1 sm:col-start-3 sm:col-span-2 sm:row-span-1",
            "aspect-video lg:row-start-1 lg:col-start-5 lg:col-span-2 lg:row-span-1",
          )}
        >
          <Image
            src="/martina_teaching_1.png"
            alt="Your Daily Teaching Companion"
            fill
            className="object-cover aspect-video"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 25vw, 350px"
            priority={false}
            loading="lazy"
          />
        </div>

        {/* Quote */}
        <div
          className={cn(
            "group max-h-full relative bg-muted rounded-md p-6 md:p-8 items-center justify-center",
            "hidden",
            "lg:flex lg:row-start-2 lg:col-start-3 lg:col-span-2 lg:row-span-1",
          )}
        >
          <HugeiconsIcon
            icon={QuoteUpIcon}
            size={40}
            className={cn(
              "text-muted-fg  transition-all duration-300",
              "absolute top-4 left-4",
              "size-7 xl:size-10",
              "group-hover:text-primary group-hover:rotate-5",
            )}
          />
          <div className="flex items-center justify-center text-muted-fg  absolute bottom-4 right-4 group-hover:text-primary transition-colors duration-300">
            <HugeiconsIcon
              icon={QuoteDownIcon}
              size={40}
              className="group-hover:-rotate-5 transition-transform"
            />
          </div>
          <blockquote className="text-center text-base xl:text-base font-medium leading-relaxed relative text-pretty">
            Focus on teaching, trust everything else to SmartCookie.
          </blockquote>
        </div>

        {/* Time saved */}
        <div
          className={cn(
            "group flex flex-col justify-between bg-muted rounded-md p-6 md:p-8",
            "row-start-5 col-start-1 col-span-1 row-span-1",
            "aspect-square sm:row-start-3 sm:col-start-3 sm:col-span-1 sm:row-span-1",
            "lg:aspect-square lg:row-start-3 lg:col-start-3 lg:col-span-1 lg:row-span-1",
          )}
        >
          <p className="text-muted-fg text-base lg:text-sm xl:text-base">
            Trusted by
          </p>
          <div className="relative w-fit">
            <p className="text-5xl sm:text-4xl xl:text-5xl font-bold tracking-tight tabular-nums">
              95%
            </p>
            <div className="absolute top-full left-0 bg-primary w-full scale-x-0 group-hover:scale-x-100 origin-left transition-transform h-1 rounded-sm" />
          </div>
        </div>

        {/* Your external brain */}
        <motion.div
          initial="initial"
          whileHover="animate"
          className={cn(
            "group bg-primary-tint flex flex-col items-center justify-center rounded-md",
            "row-start-5 col-start-2 col-span-1 row-span-1",
            "aspect-square sm:row-start-3 sm:col-start-4 sm:col-span-1 sm:row-span-1",
            "lg:aspect-square lg:row-start-3 lg:col-start-4 lg:col-span-1 lg:row-span-1",
          )}
        >
          <MotionHugeIcons
            icon={Brain02Icon}
            size={70}
            className="group-hover:text-primary"
            variants={{
              initial: {
                y: 0,
              },
              animate: {
                y: -10,
                rotate: -5,
                scale: 1.05,
              },
            }}
            transition={regularSpring}
          />
          <motion.p
            variants={{
              initial: {
                y: 8,
                opacity: 0,
              },
              animate: {
                y: 12,
                opacity: 1,
              },
            }}
            transition={regularSpring}
            className=" leading-0 text-base font-medium text-center text-balance"
          >
            Your second brain
          </motion.p>
        </motion.div>

        {/* Tools Replaced */}
        <div
          className={cn(
            "group flex   bg-muted rounded-xl p-6 md:p-8",
            " flex-col gap-4 justify-between row-start-7 col-start-1 col-span-2 row-span-1",
            " sm:aspect-[16/4.5] sm:flex-row sm:gap-24 sm:items-end sm:row-start-4 sm:col-start-1 sm:col-span-4 sm:row-span-1",
            "lg:justify-between lg:gap-0 lg:aspect-square lg:flex-col lg:items-start lg:row-start-2 lg:col-start-5 lg:col-span-2 lg:row-span-2",
          )}
        >
          <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
            <p className="text-5xl md:text-6xl font-bold tracking-tight tabular-nums mb-1 ">
              12
              <span className="group-hover:text-primary transition-all duration-300">
                +
              </span>
            </p>
            <div className="text-xl lg:text-2xl font-semibold  mb-1 shrink-0 text-nowrap">
              Hours Saved Weekly
            </div>
          </div>
          <p className="text-muted-fg text-base">
            Teachers save 12+ hours weekly by trusting SmartCookie to manage
            their admin.
          </p>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
