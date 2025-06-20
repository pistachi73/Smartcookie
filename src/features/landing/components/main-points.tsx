"use client";

import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardDescription, CardTitle } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { regularSpring } from "@/shared/lib/animation";
import {
  Analytics02Icon,
  Brain02Icon,
  FrameworksIcon,
  HealtcareIcon,
  Settings02Icon,
  SparklesIcon,
  Target03Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import * as motion from "motion/react-m";

const MotionCard = motion.create(Card);

const mainPointsData = [
  {
    mainPoint: {
      title: "All-in-One Workspace",
      description: "All Your Tools, One Screen",
      icon: FrameworksIcon,
      accentColor: "var(--color-custom-blueberry-bg-shade)",
    },
    statistic: {
      number: "12+",
      label: "Tools Replaced",
      description: "Average tools tutors use separately",
      icon: Settings02Icon,
    },
  },
  {
    mainPoint: {
      title: "Your Daily Teaching Companion",
      description: "Your Second Brain (for Teaching)",
      icon: Brain02Icon,
      accentColor: "var(--color-custom-lavender-bg-shade)",
    },
    statistic: {
      number: "85%",
      label: "Time Saved",
      description: "Less time on admin, more on teaching",
      icon: Analytics02Icon,
    },
  },
  {
    mainPoint: {
      title: "Track Emotions & Engagement",
      description: "Track What Really Matters",
      icon: HealtcareIcon,
      accentColor: "var(--color-custom-sage-bg-shade)",
    },
    statistic: {
      number: "92%",
      label: "Success Rate",
      description: "Classes with emotional tracking",
      icon: Target03Icon,
    },
  },
];

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      ...regularSpring,
      delay: index * 0.1,
    },
  }),
};

export const MainPoints = () => {
  return (
    <MaxWidthWrapper
      as="section"
      className="items-center h-full flex justify-center flex-col space-y-12"
    >
      {/* Header Section */}
      <div className="text-center space-y-6">
        <Badge
          intent="primary"
          className="px-4 py-2 text-sm font-medium inline-flex items-center gap-2"
        >
          <HugeiconsIcon icon={SparklesIcon} size={16} />
          Key Features
        </Badge>
        <Heading
          level={2}
          tracking="tight"
          className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground"
        >
          Everything you need to succeed
        </Heading>
        <p className="text-lg text-muted-fg max-w-2xl mx-auto">
          Streamline your tutoring workflow with powerful tools designed
          specifically for private tutors and educators.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="w-full">
        <div className="grid grid-cols-4 grid-rows-3 gap-4 h-[600px] md:h-[500px]">
          {/* Feature Card 1 - Top Left */}
          <MotionCard
            variants={cardVariants}
            custom={0}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="col-span-1 row-span-1 bg-overlay p-4 relative overflow-hidden border-0 flex flex-col justify-center"
          >
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-fg rounded-full p-2">
                  <HugeiconsIcon
                    icon={FrameworksIcon}
                    size={24}
                    className="text-primary-fg"
                  />
                </div>
              </div>
              <CardTitle className="text-sm font-bold mb-1">
                All-in-One Workspace
              </CardTitle>
              <CardDescription className="text-xs text-fg/70">
                All Your Tools, One Screen
              </CardDescription>
            </div>
          </MotionCard>

          {/* Statistic 1 - Top Center */}
          <MotionCard
            variants={cardVariants}
            custom={1}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="col-span-1 row-span-1 bg-overlay p-4 relative overflow-hidden border-0 flex flex-col justify-center"
          >
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-blue-100">
                  <HugeiconsIcon
                    icon={Settings02Icon}
                    size={16}
                    className="text-blue-600"
                  />
                </div>
              </div>
              <div className="text-2xl font-bold tracking-tight tabular-nums mb-1 text-blue-600">
                12+
              </div>
              <div className="text-xs font-medium text-fg/90 mb-1">
                Tools Replaced
              </div>
            </div>
          </MotionCard>

          {/* Large Feature Card - Top Right */}
          <MotionCard
            variants={cardVariants}
            custom={2}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="col-span-2 row-span-2 bg-overlay p-6 relative overflow-hidden border-0 flex flex-col justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-20% via-overlay/20 via-40% to-overlay/60" />

            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-fg rounded-full p-3 relative">
                  <HugeiconsIcon
                    icon={Brain02Icon}
                    size={40}
                    className="text-primary-fg"
                  />
                </div>
              </div>
              <CardTitle className="text-xl font-bold mb-3">
                Your Daily Teaching Companion
              </CardTitle>
              <CardDescription className="text-sm text-fg/70 mb-4">
                Your Second Brain (for Teaching)
              </CardDescription>

              <div className="flex justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold tracking-tight tabular-nums mb-1 text-purple-600">
                    85%
                  </div>
                  <div className="text-sm font-medium text-fg/90">
                    Time Saved
                  </div>
                </div>
              </div>
            </div>
          </MotionCard>

          {/* Feature Card 3 - Middle Left */}
          <MotionCard
            variants={cardVariants}
            custom={3}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="col-span-1 row-span-1 bg-overlay p-4 relative overflow-hidden border-0 flex flex-col justify-center"
          >
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-fg rounded-full p-2">
                  <HugeiconsIcon
                    icon={HealtcareIcon}
                    size={24}
                    className="text-primary-fg"
                  />
                </div>
              </div>
              <CardTitle className="text-sm font-bold mb-1">
                Track Emotions & Engagement
              </CardTitle>
              <CardDescription className="text-xs text-fg/70">
                Track What Really Matters
              </CardDescription>
            </div>
          </MotionCard>

          {/* Statistic 3 - Middle Center */}
          <MotionCard
            variants={cardVariants}
            custom={4}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="col-span-1 row-span-1 bg-overlay p-4 relative overflow-hidden border-0 flex flex-col justify-center"
          >
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-2">
                <div className="p-2 rounded-full bg-green-100">
                  <HugeiconsIcon
                    icon={Target03Icon}
                    size={16}
                    className="text-green-600"
                  />
                </div>
              </div>
              <div className="text-2xl font-bold tracking-tight tabular-nums mb-1 text-green-600">
                92%
              </div>
              <div className="text-xs font-medium text-fg/90 mb-1">
                Success Rate
              </div>
            </div>
          </MotionCard>

          {/* Wide Bottom Card */}
          <MotionCard
            variants={cardVariants}
            custom={5}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="col-span-4 row-span-1 bg-overlay p-6 relative overflow-hidden border-0"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="bg-fg rounded-full p-3">
                  <HugeiconsIcon
                    icon={SparklesIcon}
                    size={32}
                    className="text-primary-fg"
                  />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold mb-1">
                    Ready to Transform Your Tutoring?
                  </CardTitle>
                  <CardDescription className="text-sm text-fg/70">
                    Join thousands of tutors who have streamlined their workflow
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold tracking-tight tabular-nums mb-1 text-orange-600">
                  1000+
                </div>
                <div className="text-sm font-medium text-fg/90">
                  Happy Tutors
                </div>
              </div>
            </div>
          </MotionCard>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};
