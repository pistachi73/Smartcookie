"use client";

import * as motion from "motion/react-m";
import Image from "next/image";

import { regularSpring } from "@/shared/lib/animation";

export default function SurveyThankYou() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-bg  gap-6">
      <div className="flex flex-col items-center gap-6 overflow-hidden mb-16">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ ...regularSpring }}
          className="flex items-center gap-3"
        >
          <div className="relative h-8 w-4">
            <Image
              src="/logos/smartcookie_logo.svg"
              alt="SmartCookie Logo"
              fill
              priority
            />
          </div>
          <span className="text-2xl font-bold tracking-tight">SmartCookie</span>
        </motion.div>
        <motion.div
          className="w-full z-10 bg-bg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={regularSpring}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-center">
              Thank you for your feedback!
            </span>
            <span className="text-base text-muted-fg">
              You can now close this window.
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
