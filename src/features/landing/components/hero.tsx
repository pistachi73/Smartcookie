"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  StickyNote02Icon,
  TableIcon,
  Time02Icon,
  UserSettingsIcon,
} from "@hugeicons-pro/core-solid-rounded";
import { ArrowRight02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Heading } from "@/shared/components/ui/heading";
import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { TextField } from "@/shared/components/ui/text-field";
import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { useViewport } from "@/shared/components/layout/viewport-context/viewport-context";
import { useProtectedMutation } from "@/shared/hooks/use-protected-mutation";
import { cn } from "@/shared/lib/classes";

import { addEmailMarketingSubscriber } from "@/data-access/email-marketing/mutations";
import { AddEmailMarketingSubscriberSchema } from "@/data-access/email-marketing/schemas";

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: Need this rerender
  useEffect(() => {
    if (measureRef.current) {
      setContainerWidth(measureRef.current.offsetWidth);
    }
  }, [currentTextIndex]);

  return (
    <MaxWidthWrapper
      as="section"
      className="flex items-center  py-16 sm:py-24 md:py-0 justify-center md:min-h-[400px] md:h-[calc(80vh)] md:max-h-[500px]"
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
                          className="inline-block bg-linear-to-r from-primary to-primary-shade bg-clip-text text-transparent"
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
          SmartCookie is an all-in-one tool that simplifies admin, tracks
          lessons, and boosts motivation. A second brain to teach smarter.
        </p>

        <EmailMarketingForm />
      </div>
    </MaxWidthWrapper>
  );
}

const formSchema = z.object({
  email: z.string().email(),
});

export const EmailMarketingForm = () => {
  const { mutate, isPending } = useProtectedMutation({
    requireAuth: false,
    schema: AddEmailMarketingSubscriberSchema,
    mutationFn: addEmailMarketingSubscriber,
    onSuccess: () => {
      toast.success("Thanks for your interest! We'll be in touch soon.");
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    mutate(data);
  };

  return (
    <Form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2"
    >
      <Controller
        control={form.control}
        name="email"
        render={({ field }) => (
          <TextField
            autoComplete="email"
            placeholder="Enter your email"
            className={{
              primitive: "w-full max-w-[400px]",
              fieldGroup: "h-13",
              input: "sm:text-base! h-full",
            }}
            {...field}
          />
        )}
      />

      <Button
        intent="primary"
        size="lg"
        type="submit"
        isPending={isPending}
        className="group h-13 w-full sm:w-auto max-w-[400px] sm:max-w-none gap-6 text-base"
      >
        Discover SmartCookie
        {isPending ? (
          <ProgressCircle isIndeterminate className="size-5" />
        ) : (
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={20}
            className="rshrink-0 group-hover:translate-x-1 transition-transform"
          />
        )}
      </Button>
    </Form>
  );
};
