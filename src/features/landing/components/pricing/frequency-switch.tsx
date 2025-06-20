"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { regularSpring } from "@/shared/lib/animation";
import { cn } from "@/shared/lib/classes";
import * as motion from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import "./frequency-switch.css";

type PlanFrequencySwitchProps = {
  paymentFrequency: "M" | "A";
  setPaymentFrequency: (paymentFrequency: "M" | "A") => void;
};

export const PlanFrequencySwitch = ({
  paymentFrequency,
  setPaymentFrequency,
}: PlanFrequencySwitchProps) => {
  const monthlyRef = useRef<HTMLButtonElement>(null);
  const annualRef = useRef<HTMLButtonElement>(null);
  const [blobStyle, setBlobStyle] = useState<{
    left: number;
    width: number;
  }>({ left: 0, width: 0 });

  useEffect(() => {
    const activeRef = paymentFrequency === "M" ? monthlyRef : annualRef;
    const button = activeRef.current;

    if (button) {
      const rect = button.getBoundingClientRect();
      const parentRect = button.parentElement?.getBoundingClientRect();

      if (parentRect) {
        setBlobStyle({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      }
    }
  }, [paymentFrequency]);

  return (
    <div className="relative flex items-center justify-center p-1 bg-muted rounded-full gap-1t">
      {/* Blob that matches active button dimensions */}
      <motion.div
        className="absolute rounded-full h-[calc(100%-8px)] top-1 bg-white shadow-sm border z-0"
        animate={{
          left: blobStyle.left,
          width: blobStyle.width,
        }}
        transition={regularSpring}
      />

      {/* Monthly Button */}
      <Button
        ref={monthlyRef}
        onPress={() => {
          setPaymentFrequency("M");
        }}
        type="button"
        intent="plain"
        size="large"
        className={cn(
          "hover:bg-transparent flex items-center gap-2 font-semibold transition-colors relative z-10",
          paymentFrequency === "M" ? "" : "text-muted-fg",
        )}
      >
        Monthly
      </Button>

      {/* Annual Button */}
      <Button
        ref={annualRef}
        onPress={() => {
          setPaymentFrequency("A");
        }}
        type="button"
        intent="plain"
        size="large"
        className={cn(
          "hover:bg-transparent flex items-center gap-2 font-semibold transition-colors relative z-10",
          paymentFrequency === "A" ? "" : "text-muted-fg",
        )}
      >
        Annual
        <Badge
          intent={paymentFrequency === "A" ? "primary" : "secondary"}
          className="transition-colors duration-300"
        >
          -15%
        </Badge>
      </Button>
    </div>
  );
};
