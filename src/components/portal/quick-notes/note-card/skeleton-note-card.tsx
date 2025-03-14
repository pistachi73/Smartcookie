import { cn } from "@/lib/utils";

interface SkeletonNoteCardProps {
  className?: string;
}

export const SkeletonNoteCard = ({ className }: SkeletonNoteCardProps) => {
  return (
    <div
      className={cn(
        "w-full p-3 rounded-lg border border-border bg-card shadow-sm",
        className,
      )}
    >
      {/* Content skeleton - multiple lines */}
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse w-full" />
        <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
      </div>

      {/* Footer skeleton - just date */}
      <div className="mt-4">
        <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
};
