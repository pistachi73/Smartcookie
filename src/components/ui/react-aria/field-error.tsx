import { cn } from "@/lib/utils";
import { AlertCircleIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Text, type TextProps } from "react-aria-components";

type FieldErrorProps = Omit<TextProps, "children"> & {
  errorMessage?: string;
};

export const FieldError = ({
  className,
  errorMessage,
  ...props
}: FieldErrorProps) => {
  return (
    <AnimatePresence>
      {Boolean(errorMessage) && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        >
          <Text
            slot="errorMessage"
            className={cn(
              "pt-0.5 flex items-center gap-1.5 text-xs font-normal leading-5 text-destructive",
              className,
            )}
            {...props}
          >
            <AlertCircleIcon size={14} />
            {errorMessage}
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
