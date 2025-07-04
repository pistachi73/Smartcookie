import { Heading } from "@/shared/components/ui/heading";
import { cn } from "@/shared/lib/classes";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import * as motion from "motion/react-m";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAuthStore } from "../store/auth-store-provider";

// @ts-ignore
const MotionCard = motion.create(Card);

type FormWrapperProps = {
  children: React.ReactNode;
  header: string;
  subHeader?: string | React.ReactNode;
  backButton?: boolean;
  backButtonOnClick?: () => void;
  className?: string;
};

export const FormWrapper = ({
  children,
  header,
  subHeader,
  backButton,
  backButtonOnClick,
  className,
}: FormWrapperProps) => {
  const { animationDir, setAnimationDir } = useAuthStore(
    useShallow((state) => ({
      animationDir: state.animationDir,
      setAnimationDir: state.setAnimationDir,
    })),
  );

  useEffect(() => {
    setAnimationDir(1);
  }, [setAnimationDir]);

  return (
    <motion.div
      className="w-full border-none bg-transparent shadow-none"
      initial={{ opacity: 0, x: animationDir === 1 ? 20 : -20 }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: animationDir === 1 ? -20 : 20,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 35,
      }}
    >
      <div className="min-h-[20px]">
        {backButton && (
          <Button
            onPress={async () => {
              await setAnimationDir(-1);
              backButtonOnClick?.();
            }}
            size="small"
            intent="plain"
            type="button"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
            Back
          </Button>
        )}
      </div>
      <div className="py-6 space-y-1">
        <Heading
          level={2}
          tracking="tight"
          className="sm:text-2xl font-semibold"
        >
          {header}
        </Heading>
        <p className="text-base text-muted-fg">{subHeader}</p>
      </div>
      <div className={cn("px-0 py-4", className)}>{children}</div>
    </motion.div>
  );
};
