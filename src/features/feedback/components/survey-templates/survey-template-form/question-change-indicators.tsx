import {
  ArrowDown02Icon,
  ArrowUp02Icon,
  Settings02Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { HugeiconsIcon } from "@hugeicons/react";
import { tv } from "tailwind-variants";

import type { SurveyTemplateQuestionChange } from "@/features/feedback/types/survey-template-form-store.types";
import { Tooltip } from "@/shared/components/ui/tooltip";

type QuestionChangeIndicatorsProps = {
  changes: Array<SurveyTemplateQuestionChange>;
};

const changeIndicatorStyles = tv({
  base: "flex items-center justify-center size-6 rounded-sm",
  variants: {
    type: {
      move_up: "text-success ",
      move_down: " text-danger ",
      settings_changed: " text-muted-fg ",
    },
  },
});

const changeIconMap = {
  move_up: ArrowUp02Icon,
  move_down: ArrowDown02Icon,
  settings_changed: Settings02Icon,
} as const;

type ChangeType = keyof typeof changeIconMap;

export const QuestionChangeIndicators = ({
  changes,
}: QuestionChangeIndicatorsProps) => {
  const renderChangeIcon = (
    change: { type: string; message: string },
    index: number,
  ) => {
    if (!(change.type in changeIconMap)) return null;

    const changeType = change.type as ChangeType;
    const IconComponent = changeIconMap[changeType];

    return (
      <Tooltip key={`change-${index}`} delay={300}>
        <Tooltip.Trigger
          className={changeIndicatorStyles({ type: changeType })}
        >
          <HugeiconsIcon icon={IconComponent} size={14} />
        </Tooltip.Trigger>
        <Tooltip.Content>{change.message}</Tooltip.Content>
      </Tooltip>
    );
  };

  if (changes.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1">
      {changes.map((change, index) => renderChangeIcon(change, index))}
    </div>
  );
};
