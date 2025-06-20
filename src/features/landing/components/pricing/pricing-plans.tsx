"use client";

import { Check, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { cn } from "@/shared/lib/classes";
import { memberChecks } from "./constants";
import { PlanFrequencySwitch } from "./frequency-switch";

export const Plans = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentFrequency, setPaymentFrequency] = useState<"M" | "A">("M");

  const sessionId = searchParams.get("session_id");

  return (
    <MaxWidthWrapper className="items-center h-ful flex justify-center pt-12 sm:p-32 sm:pt-12 flex-col space-y-10">
      <Heading
        level={2}
        tracking="tight"
        className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground"
      >
        Choose the right plan for you!
      </Heading>
      <PlanFrequencySwitch
        paymentFrequency={paymentFrequency}
        setPaymentFrequency={setPaymentFrequency}
      />
      <Card className="w-full max-w-[450px]  overflow-hidden bg-muted  transition-transform flex flex-col justify-center">
        <CardHeader>
          <CardTitle>OH Member</CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed">
            Upgrade to the Premium Plan to unlock full lessons, participate in
            community discussions, and access exclusive content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-9">
          <div className="w-full h-px bg-muted-foreground my-9" />
          <div>
            <div className="flex items-center gap-2 relative">
              <p className="text-4xl font-bold tracking-tighter text-foreground">
                {paymentFrequency === "M" ? "9.99€/month" : "100.99€/year"}
              </p>
              {paymentFrequency === "A" && (
                <Badge
                  intent="secondary"
                  className="py-1 rounded-sm bg-transparent border-none bg-gradient-to-tr from-secondary to-secondary/80"
                >
                  15% off
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Billed {paymentFrequency === "M" ? "monthly" : "annually"}
            </p>
          </div>

          <Button intent="primary" className="h-16 text-sm w-full mt-9">
            Become a member
          </Button>

          <div className="space-y-4">
            <p className="font-semibold text-foreground ">For members</p>
            <div className="flex flex-col gap-2">
              {memberChecks.map(({ key, label }) => (
                <PlanCheck key={key} label={label} checked={true} />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </MaxWidthWrapper>
  );
};

const PlanCheck = ({ label, checked }: { label: string; checked: boolean }) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <div
        className={cn(
          "h-6 w-6 flex items-center justify-center rounded-full",
          checked
            ? "bg-secondary text-secondary-foreground"
            : "bg-accent text-foreground/30",
        )}
      >
        {checked ? <Check size={16} /> : <X size={16} />}
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
