import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft02Icon } from "@hugeicons/react";
import { m } from "framer-motion";
import { useEffect } from "react";
import { useAuthContext } from "./auth-context";

const MotionCard = m(Card);

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
  const { animationDir, setAnimationDir } = useAuthContext();

  useEffect(() => {
    setAnimationDir(1);
  }, [setAnimationDir]);

  return (
    <MotionCard
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
            onClick={async () => {
              await setAnimationDir(-1);
              backButtonOnClick?.();
            }}
            variant="link"
            type="button"
            className="text-sm"
          >
            <ArrowLeft02Icon size={18} />
            Back
          </Button>
        )}
      </div>
      <CardHeader className="px-0 py-6">
        <CardTitle className="text-2xl font-semibold tracking-tighter ">
          {header}
        </CardTitle>
        <CardDescription className="mt-2 text-base">
          {subHeader}
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("px-0 py-4", className)}>
        {children}
      </CardContent>
    </MotionCard>
  );
};
