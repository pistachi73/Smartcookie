import { Heading } from "@/shared/components/ui/heading";
import { Link } from "@/shared/components/ui/link";
import { ArrowLeft02Icon, SearchIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

interface FeedbackNotFoundProps {
  title: string;
  description: string;
}

export const FeedbackNotFound = ({
  title,
  description,
}: FeedbackNotFoundProps) => {
  return (
    <div className="space-y-10">
      <Link
        intent="secondary"
        href="/portal/feedback"
        className={"flex items-center gap-1.5 text-sm mb-6"}
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={18} data-slot="icon" />
        Back to hall
      </Link>

      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <HugeiconsIcon
            icon={SearchIcon}
            size={40}
            className="mx-auto text-primary animate-bounce"
          />
          <div>
            <Heading className="text-lg font-semibold mb-2">{title}</Heading>
            <p className="text-sm text-muted-fg">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
