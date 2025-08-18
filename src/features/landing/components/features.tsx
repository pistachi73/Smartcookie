import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Calendar03Icon,
  Chart02Icon,
  FolderLibraryIcon,
  HealtcareIcon,
  StickyNote02Icon,
} from "@hugeicons-pro/core-solid-rounded";
import Image, { type ImageProps } from "next/image";

import { Card } from "@/shared/components/ui/card";
import { Heading } from "@/shared/components/ui/heading";
import { MaxWidthWrapper } from "@/shared/components/layout/max-width-wrapper";
import { cn } from "@/shared/lib/classes";

export const Features = () => {
  return (
    <MaxWidthWrapper className="md:space-y-8 space-y-4" id="features">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4">
        <VerticalFeatureCard
          title="Schedule Lessons Effortlessly"
          subtitle="Integrated Calendar"
          description="Streamline your booking process with intelligent scheduling that adapts to your availability"
          image={{
            src: "/images/features/calendar.png",
            alt: "Calendar interface",
            priority: true,
            loading: "eager",
          }}
          icon={Calendar03Icon}
        />
        <VerticalFeatureCard
          title="Capture Notes Easily"
          subtitle="Next-Level Notes"
          description="Keep all your key details linked to students and lessons. Forget about messy or lost notes."
          image={{
            src: "/images/features/quick_notes.png",
            alt: "Quick Notes",
            priority: true,
            loading: "eager",
          }}
          icon={StickyNote02Icon}
        />
      </div>
      <HorizontalFeatureCard />
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 gap-4">
        <VerticalFeatureCard
          title="Manage Courses Smoothly"
          subtitle="Smart Dashboard"
          description="Keep all your courses organized in one place. Quickly switch between classes without losing focus."
          image={{
            src: "/images/features/hubs.png",
            alt: "Hubs",
            priority: false,
            loading: "lazy",
          }}
          icon={FolderLibraryIcon}
        />
        <VerticalFeatureCard
          title="Track Workload Effortlessly"
          subtitle="Stay on Top of Workload"
          description="Get a clear overview of your tasks and lessons. Balance your schedule and avoid burnout."
          image={{
            src: "/images/features/dashboard.png",
            alt: "Dashboard",
            priority: false,
            loading: "lazy",
          }}
          icon={Chart02Icon}
        />
      </div>
    </MaxWidthWrapper>
  );
};

type VerticalFeatureCardProps = {
  title: string;
  subtitle: string;
  description: string;
  image: {
    src: string;
    alt: string;
    priority?: boolean;
    loading?: ImageProps["loading"];
  };
  icon: typeof Calendar03Icon;
};

export const VerticalFeatureCard = ({
  title,
  subtitle,
  description,
  image,
  icon,
}: VerticalFeatureCardProps) => {
  return (
    <Card
      className={cn(
        "p-0! pb-0! group relative",
        "rounded-xl border-transparent border-2  overflow-hidden justify-between",
        "transition-all duration-300",
        "bg-muted hover:border-muted-fg/80",
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
      <div className="flex flex-col gap-2 p-6">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-sm bg-white flex items-center justify-center shadow-sm">
            <HugeiconsIcon icon={icon} size={16} className="text-primary" />
          </div>
          <p className="text-base font-medium">{subtitle}</p>
        </div>
        <div className="w-full flex items-center justify-between">
          <Heading>{title}</Heading>
        </div>
        <p className="text-muted-fg">{description}</p>
      </div>

      {/* Calendar Image with Gradient */}
      <div className="w-full relative aspect-video">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="aspect-video object-cover object-top rounded-lg h-auto w-full group-hover:scale-102 transition-transform duration-300 origin-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 550px"
          priority={image.priority}
        />
        {/* Subtle gradient overlay at bottom right */}
      </div>
      <div
        className={cn(
          "absolute h-[30px] w-full bottom-0 left-0 bg-linear-to-t",
          "from-muted/70 to-muted/0",
        )}
      />
    </Card>
  );
};

export const HorizontalFeatureCard = () => {
  return (
    <Card
      className={cn(
        "p-0!  group relative flex-col lg:flex-row",
        "flex rounded-xl bg-custom-flamingo-bg-tint/30 border-2 border-transparent overflow-hidden",
        "hover:border-primary transition-all duration-300 bg-primary-tint",
      )}
    >
      <div
        className={cn(
          "absolute top-4 right-4 lg:top-auto lg:bottom-4 lg:left-4",
          "size-10 rounded-full bg-white flex items-center justify-center",
          " group-hover:translate-x-1 transition-transform",
        )}
      >
        <HugeiconsIcon icon={ArrowRight02Icon} size={22} />
      </div>
      {/* Text Content */}
      <div className="lg:basis-[40%] lg:pb-22 flex flex-row lg:flex-col justify-between px-6 lg:pr-0 lg:flex-1">
        <div className="flex flex-col gap-2 py-6">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-sm bg-white flex items-center justify-center shadow-sm">
              <HugeiconsIcon
                icon={HealtcareIcon}
                size={16}
                className="text-primary"
              />
            </div>
            <p className="text-base font-medium">
              Frictionless Feedback Tracking.
            </p>
          </div>
          <Heading>Collect Feedback Thoughtfully</Heading>
          <p className="text-base text-fg/80">
            Record meaningful insights on your own terms. Use meaningful
            feedback to adapt and improve your teaching.
          </p>
        </div>
      </div>

      {/* Calendar Image with Gradient */}
      <div className="aspect-64/27 relative lg:flex-1 w-full flex items-end justify-end lg:basis-[60%] shrink-0">
        <Image
          src="/images/features/feedback.png"
          alt="Calendar interface"
          fill
          className="aspect-64/27 object-cover object-top rounded-lg h-auto w-full group-hover:scale-102 transition-transform duration-300 origin-bottom-right"
          sizes="(max-width: 1024px) 80vw, 600px"
          priority={false}
          loading="lazy"
        />
        <div
          className={cn(
            "absolute h-[30px] w-full bottom-0 left-0 bg-linear-to-t from-primary-tint/70 to-primary-tint/0",
          )}
        />
      </div>
    </Card>
  );
};
