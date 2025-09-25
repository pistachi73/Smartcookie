"use client";

import Image from "next/image";

import { ProgressBar } from "@/shared/components/ui/progress-bar";

export default function SurveyLoading() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-bg  gap-6">
      <div className="flex flex-col items-center gap-6 overflow-hidden mb-16">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-4">
            <Image
              src="/logos/smartcookie_logo.svg"
              alt="SmartCookie Logo"
              fill
              priority
            />
          </div>
          <span className="text-2xl font-bold tracking-tight">SmartCookie</span>
        </div>
        <div className="w-full z-10 bg-bg">
          <div className="flex flex-col items-center gap-2">
            <span className="text-base text-muted-fg">
              Please wait until the survey is loaded.
            </span>
            <ProgressBar isIndeterminate />
          </div>
        </div>
      </div>
    </div>
  );
}
