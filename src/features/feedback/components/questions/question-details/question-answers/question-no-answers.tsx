import { HugeiconsIcon } from "@hugeicons/react";

import type { QuestionType } from "@/db/schema";
import { cn } from "@/shared/lib/classes";
import {
  Calendar03Icon,
  RankingIcon,
  TextIcon,
  ThumbsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded";

const questionTypeIconMap: Record<
  QuestionType,
  {
    iconClass: string;
    icon: typeof TextIcon;
    label: string;
  }
> = {
  text: {
    iconClass: "bg-custom-blueberry-bg",
    icon: TextIcon,
    label: "Waiting for written feedback!",
  },
  boolean: {
    iconClass: "bg-custom-grape-bg",
    icon: ThumbsUpIcon,
    label: "Waiting for yes/no responses!",
  },
  rating: {
    iconClass: "bg-custom-sage-bg",
    icon: RankingIcon,
    label: "Waiting for rating responses!",
  },
};

export const QuestionNoAnswers = ({ type }: { type: QuestionType }) => {
  const { iconClass, icon, label } = questionTypeIconMap[type];
  return (
    <div className="text-center py-16 flex flex-col items-center gap-4">
      <div
        className={cn(
          "relative size-14  rounded-full flex items-center justify-center animate-bounce",
          iconClass,
        )}
      >
        <HugeiconsIcon icon={icon} size={24} className={iconClass} />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">No responses found</h3>
        <p className="text-sm text-muted-fg">{label}</p>
      </div>
      <div className="w-fit flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-dashed border-muted-fg/30">
        <HugeiconsIcon
          icon={Calendar03Icon}
          size={16}
          className="text-muted-fg"
        />
        <span className="text-sm text-muted-fg">
          Try adjusting the date filter to see more responses
        </span>
      </div>
    </div>
  );
};
