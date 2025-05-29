import { ProgressCircle } from "@/shared/components/ui/progress-circle";

export const QuestionLoading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <ProgressCircle
            className="size-12 stroke-primary text-primary"
            isIndeterminate
            aria-label="Loading question..."
          />
        </div>
        <p className="text-sm text-muted-fg animate-pulse">
          Loading question...
        </p>
      </div>
    </div>
  );
};
