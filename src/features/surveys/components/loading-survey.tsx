"use client";

import * as motion from "motion/react-m";
import Image from "next/image";

import { ProgressBar } from "@/shared/components/ui/progress-bar";
import { regularSpring } from "@/shared/lib/animation";

export default function LoadingSurvey() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-bg  gap-6">
      <motion.div
        key="loading-survey"
        className="flex flex-col items-center gap-6 overflow-hidden mb-16"
        transition={regularSpring}
      >
        <motion.div className="flex items-center gap-3">
          <div className="relative h-8 w-4">
            <Image src="/Logo.svg" alt="SmartCookie Logo" fill priority />
          </div>
          <span className="text-2xl font-bold tracking-tight">SmartCookie</span>
        </motion.div>
        <motion.div className="w-full z-10">
          <ProgressBar isIndeterminate />
        </motion.div>
      </motion.div>
    </div>
  );
}
