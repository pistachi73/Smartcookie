import { ProgressCircle } from "@/shared/components/ui/progress-circle";
import { cn } from "@/shared/lib/classes";

interface FeedbackLoadingProps {
  title?: string;
  className?: string;
}

export const FeedbackLoading = ({
  title = "Loading...",
  className,
}: FeedbackLoadingProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center flex-col gap-4  min-h-[400px]",
        className,
      )}
    >
      <ProgressCircle
        className="size-12 stroke-primary text-primary"
        isIndeterminate
        aria-label={title}
      />
      <p className="text-sm text-muted-fg ">{title}</p>
    </div>
  );
};
