import { cn } from "@/shared/lib/classes";
import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { ArrowLeft02Icon } from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
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

  console.log(animationDir);

  return (
    <MotionCard
      // @ts-ignore
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
            size="extra-small"
            appearance="plain"
            type="button"
            className="text-sm"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={18} />
            Back
          </Button>
        )}
      </div>
      <Card.Header className="px-0 py-6">
        <Card.Title level={1} tracking="tighter">
          {header}
        </Card.Title>
        <Card.Description>{subHeader}</Card.Description>
      </Card.Header>
      <Card.Content className={cn("px-0 py-4", className)}>
        {children}
      </Card.Content>
    </MotionCard>
  );
};
