"use client";

import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { regularSpring } from "@/shared/lib/animation";
import {
  Brain02Icon,
  FrameworksIcon,
  HealtcareIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import * as motion from "motion/react-m";

const MotionCard = motion.create(Card);

const mainPoints = [
  {
    title: "All-in-One Workspace",
    subtitle: "Centralized & Simplified",
    description: "All Your Tools, One Screen",
    icon: FrameworksIcon,
    bgColor: "bg-[var(--color-custom-blueberry-bg-tint)]",
    borderColor: "border-[var(--color-custom-blueberry-bg)]",
    accentColor: "var(--color-custom-blueberry-bg-shade)",
  },
  {
    title: "Your Daily Teaching Companion",
    subtitle: "Stay on Track, Every Day",
    description: "Your Second Brain (for Teaching)",
    icon: Brain02Icon,
    bgColor: "bg-[var(--color-custom-lavender-bg-tint)]",
    borderColor: "border-[var(--color-custom-lavender-bg)]",
    accentColor: "var(--color-custom-lavender-bg-shade)",
  },
  {
    title: "Track Emotions & Engagement",
    subtitle: "Understand How They Feel",
    description: "Track What Really Matters",
    icon: HealtcareIcon,
    bgColor: "bg-[var(--color-custom-sage-bg-tint)]",
    borderColor: "border-[var(--color-custom-sage-bg)]",
    accentColor: "var(--color-custom-sage-bg-shade)",
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
    <MaxWidthWrapper as="section">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {mainPoints.map((point, index) => (
          <MotionCard
            key={point.title}
            variants={cardVariants}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-overlay p-4 relative overflow-hidden"
          >
            <motion.div
              className="absolute inset-0 rounded-lg opacity-0"
              style={{ backgroundColor: point.accentColor }}
              variants={{
                initial: { opacity: 0 },
                hover: {
                  opacity: 0.05,
                  transition: { ...regularSpring },
                },
              }}
            />

            {/* Enhanced dots background pattern */}
            <div
              className="absolute -top-4 left-0 right-0 h-40 opacity-45"
              style={{
                backgroundImage: `radial-gradient(circle at center, ${point.accentColor} 1.5px, transparent 0)`,
                backgroundSize: "16px 16px",
              }}
            />

            {/* Improved gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-20% via-overlay/60 via-40% to-overlay" />

            {/* Content */}
            <div className="w-full flex justify-center items-center relative">
              {/* Background circle with opacity */}
              <motion.div
                className="absolute rounded-full w-16 h-16 opacity-20"
                style={{ backgroundColor: point.accentColor }}
                variants={{
                  initial: { scale: 1, opacity: 0.2 },
                  hover: {
                    scale: [1, 1.2, 1.1],
                    opacity: [0.2, 0.3, 0.25],
                    transition: {
                      duration: 0.6,
                      ease: "easeInOut",
                      times: [0, 0.5, 1],
                    },
                  },
                }}
              />

              {/* Icon circle */}
              <motion.div
                className="bg-fg rounded-full p-2 relative z-20"
                variants={{
                  initial: { scale: 1 },
                  hover: {
                    scale: [1, 1.1, 1.05],
                    transition: {
                      duration: 0.4,
                      ease: "easeInOut",
                      times: [0, 0.6, 1],
                    },
                  },
                }}
              >
                <motion.div
                  variants={{
                    initial: { rotate: 0 },
                    hover: {
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.5, ease: "easeInOut" },
                    },
                  }}
                >
                  <HugeiconsIcon
                    icon={point.icon}
                    size={32}
                    className="text-primary-fg"
                  />
                </motion.div>
              </motion.div>
            </div>

            <CardHeader className="text-center relative z-10">
              <CardTitle>{point.title}</CardTitle>
              <CardDescription>{point.description}</CardDescription>
            </CardHeader>
          </MotionCard>
        ))}
      </div>
    </MaxWidthWrapper>
  );
};
