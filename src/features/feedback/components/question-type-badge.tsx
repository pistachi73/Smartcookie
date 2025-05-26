import type { QuestionType } from "@/db/schema";
import {
  RankingIcon,
  TextIcon,
  ThumbsUpIcon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { tv } from "tailwind-variants";

const questionTypeStyles = tv({
  base: "w-fit h-6 p-1 rounded-sm flex items-center",
  variants: {
    type: {
      text: "bg-custom-blueberry-bg",
      rating: "bg-custom-sage-bg",
      boolean: "bg-custom-grape-bg",
    },
    withLabel: {
      true: "w-fit gap-2 px-1.5",
      false: "size-6 justify-center",
    },
  },
});

export const questionTypeIconMap: Record<
  QuestionType,
  { icon: typeof RankingIcon; label: string }
> = {
  rating: { icon: RankingIcon, label: "Rating" },
  text: { icon: TextIcon, label: "Text" },
  boolean: { icon: ThumbsUpIcon, label: "Yes/No" },
};

export const QuestionTypeBadge = ({
  type,
  label = false,
  className,
}: {
  type: QuestionType;
  label?: boolean | string;
  className?: string;
}) => {
  const { icon, label: labelText } = questionTypeIconMap[type];
  return (
    <div
      className={questionTypeStyles({
        type,
        withLabel: Boolean(label),
        className,
      })}
    >
      <HugeiconsIcon icon={icon} size={16} />
      {typeof label === "string" && (
        <p className="text-xs tabular-nums">{label}</p>
      )}
      {label === true && <p className="text-xs font-medium">{labelText}</p>}
    </div>
  );
};
