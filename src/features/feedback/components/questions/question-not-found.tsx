import { ArrowLeft02Icon } from "@hugeicons-pro/core-solid-rounded";

import { Link } from "@/shared/components/ui/link";
import { SearchIcon } from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon } from "@hugeicons/react";

export const QuestionNotFound = () => {
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
            <h3 className="text-lg font-semibold mb-2">
              Oops! Question not found
            </h3>
            <p className="text-sm text-muted-fg">
              This question seems to have vanished into thin air!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
