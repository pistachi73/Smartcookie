import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { cn } from "@/shared/lib/classes";
import {
  ArrowRight02Icon,
  Calendar03Icon,
} from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export const Features = () => {
  return (
    <MaxWidthWrapper className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
        <Card
          className={cn(
            "p-0! pb-1! group relative",
            "rounded-xl border-transparent bg-custom-sage-bg-tint/30 border-2  overflow-hidden",
            "hover:border-custom-sage-bg transition-all duration-300",
          )}
        >
          <div
            className={cn(
              "absolute top-4 right-4",
              "size-10 rounded-full bg-white flex items-center justify-center",
              " group-hover:translate-x-1 transition-transform",
            )}
          >
            <HugeiconsIcon icon={ArrowRight02Icon} size={22} />
          </div>
          {/* Text Content */}
          <div className="flex flex-col gap-2 px-6 py-6">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-sm bg-white flex items-center justify-center shadow-sm">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={16}
                  className="text-custom-sage-bg-shade"
                />
              </div>
              <p className="text-base font-medium">Integrated Calendar</p>
            </div>
            <div className="w-full flex items-center justify-between">
              <Heading>Schedule Lessons Effortlessly</Heading>
            </div>
            <p className="text-sm text-fg/80">
              Streamline your booking process with intelligent scheduling that
              adapts to your availability
            </p>
          </div>

          {/* Calendar Image with Gradient */}
          <div className="w-full pr-1 h-full">
            <div className="flex-1 relative h-full w-full">
              <img
                src="/calenadar_2.png"
                alt="Calendar interface"
                className="object-cover object-top rounded-lg h-auto w-full group-hover:scale-105 transition-transform duration-300 origin-bottom-right"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle gradient overlay at bottom right */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 rounded-lg" />
            </div>
          </div>
        </Card>
        <Card
          className={cn(
            "p-0! pb-1!",
            "rounded-xl border-none bg-custom-blueberry-bg-tint/30 border border-custom-sage-bg overflow-hidden",
          )}
        >
          {/* Text Content */}
          <div className="flex flex-col gap-2 px-6 py-6">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-sm bg-white flex items-center justify-center shadow-sm">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={16}
                  className="text-custom-sage-bg-shade"
                />
              </div>
              <p className="text-base font-medium">Integrated Calendar</p>
            </div>
            <Heading>Schedule Lessons Effortlessly</Heading>
            <p className="text-sm text-fg/80">
              Streamline your booking process with intelligent scheduling that
              adapts to your availability
            </p>
          </div>

          {/* Calendar Image with Gradient */}
          <div className="w-full pr-1 h-full">
            <div className="flex-1 relative h-full w-full">
              <img
                src="/quick_notes.png"
                alt="Calendar interface"
                className="object-cover object-top rounded-lg h-auto w-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle gradient overlay at bottom right */}
            </div>
          </div>
        </Card>
      </div>
      <Card
        className={cn(
          "p-0! pb-1! group",
          "flex flex-row rounded-xl bg-custom-flamingo-bg-tint/30 border-2 border-transparent overflow-hidden",
          "hover:border-custom-flamingo-bg transition-all duration-300",
        )}
      >
        {/* Text Content */}
        <div className="flex flex-col justify-between pb-4 pl-6">
          <div className="flex flex-col gap-2 py-6">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-sm bg-white flex items-center justify-center shadow-sm">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={16}
                  className="text-custom-flamingo-bg"
                />
              </div>
              <p className="text-base font-medium">Integrated Calendar</p>
            </div>
            <Heading>Schedule Lessons Effortlessly</Heading>
            <p className="text-base text-fg/80">
              Streamline your booking process with intelligent scheduling that
              adapts to your availability
            </p>
          </div>
          <div
            className={cn(
              "size-10 rounded-full bg-white flex items-center justify-center",
              " group-hover:translate-x-1 transition-transform",
            )}
          >
            <HugeiconsIcon icon={ArrowRight02Icon} size={22} />
          </div>
        </div>

        {/* Calendar Image with Gradient */}
        <div className="w-full pr-1 h-full">
          <div className="flex-1 relative h-full w-full">
            <img
              src="/feedback.png"
              alt="Calendar interface"
              className="object-cover object-top rounded-lg h-auto w-full group-hover:scale-103 transition-transform duration-300 origin-bottom-right"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Subtle gradient overlay at bottom right */}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-6 ">
        <Card
          className={cn(
            "p-0! pb-1!",
            "rounded-xl border-none bg-custom-sage-bg-tint border border-custom-sage-bg overflow-hidden",
            "bg-[color-mix(in_oklab,var(--color-custom-sage-bg),white_50%)]",
          )}
        >
          {/* Text Content */}
          <div className="flex flex-col gap-2 px-6 py-6">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-sm bg-white flex items-center justify-center shadow-sm">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={16}
                  className="text-custom-sage-bg-shade"
                />
              </div>
              <p className="text-base font-medium">Integrated Calendar</p>
            </div>
            <Heading>Schedule Lessons Effortlessly</Heading>
            <p className="text-sm text-fg/80">
              Streamline your booking process with intelligent scheduling that
              adapts to your availability
            </p>
          </div>

          {/* Calendar Image with Gradient */}
          <div className="w-full pr-1 h-full">
            <div className="flex-1 relative h-full w-full">
              <img
                src="/calenadar_2.png"
                alt="Calendar interface"
                className="object-cover object-top rounded-lg h-auto w-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle gradient overlay at bottom right */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/20 rounded-lg" />
            </div>
          </div>
        </Card>
        <Card
          className={cn(
            "p-0! pb-1!",
            "rounded-xl border-none bg-custom-sage-bg-tint border border-custom-sage-bg overflow-hidden",
            "bg-[color-mix(in_oklab,var(--color-custom-blueberry-bg),white_80%)] ",
          )}
        >
          {/* Text Content */}
          <div className="flex flex-col gap-2 px-6 py-6">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-sm bg-white flex items-center justify-center shadow-sm">
                <HugeiconsIcon
                  icon={Calendar03Icon}
                  size={16}
                  className="text-custom-sage-bg-shade"
                />
              </div>
              <p className="text-base font-medium">Integrated Calendar</p>
            </div>
            <Heading>Schedule Lessons Effortlessly</Heading>
            <p className="text-sm text-fg/80">
              Streamline your booking process with intelligent scheduling that
              adapts to your availability
            </p>
          </div>

          {/* Calendar Image with Gradient */}
          <div className="w-full pr-1 h-full">
            <div className="flex-1 relative h-full w-full">
              <img
                src="/quick_notes.png"
                alt="Calendar interface"
                className="object-cover object-top rounded-lg h-auto w-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle gradient overlay at bottom right */}
            </div>
          </div>
        </Card>
      </div>
    </MaxWidthWrapper>
  );
};
