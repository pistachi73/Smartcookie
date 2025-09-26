import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  RankingIcon,
  TextIcon,
  ThumbsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded";

import { cn } from "@/shared/lib/classes";

import type { QuestionType } from "@/db/schema";

const questionTypeIconMap: Record<
  QuestionType,
  {
    iconClass: string;
    icon: typeof TextIcon;
  }
> = {
  text: {
    iconClass: "bg-custom-blueberry-bg",
    icon: TextIcon,
  },
  boolean: {
    iconClass: "bg-custom-grape-bg",
    icon: ThumbsUpIcon,
  },
  rating: {
    iconClass: "bg-custom-sage-bg",
    icon: RankingIcon,
  },
};

export const QuestionNoAnswers = ({ type }: { type: QuestionType }) => {
  const { iconClass, icon } = questionTypeIconMap[type];
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
