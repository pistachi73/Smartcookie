import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-rounded";
import { format } from "date-fns";
import type { Temporal } from "temporal-polyfill";

import { Button } from "@/shared/components/ui/button";

type AgendaWeekPickerProps = {
  date: Temporal.PlainDate;
  setDate?: React.Dispatch<React.SetStateAction<Temporal.PlainDate>>;
};

export const AgendaWeekPicker = ({ date, setDate }: AgendaWeekPickerProps) => {
  const onNext = () => {
    setDate?.((date) => date.add({ days: 7 }));
  };

  const onYesterday = () => {
    setDate?.((date) => date.subtract({ days: 7 }));
  };

  const next7Days = Array.from({ length: 7 }, (_, i) => date.add({ days: i }));
  return (
    <div className="flex flex-row items-center justify-between gap-2 p-1 bg-accent rounded-lg">
      <Button
        intent="plain"
        size="sq-sm"
        className={"size-7 bg-overlay dark:bg-overlay-elevated"}
        onPress={onYesterday}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} strokeWidth={2} />
      </Button>
      <p className="text-sm font-medium flex-1 text-center tabular-nums truncate">
        {next7Days[0] && format(next7Days[0].toString(), "dd MMM yyyy")} -{" "}
        {next7Days[6] && format(next7Days[6].toString(), "dd MMM yyyy")}
      </p>
      <Button
        intent="plain"
        size="sq-sm"
        className={"size-7 bg-overlay  dark:bg-overlay-elevated"}
        onPress={onNext}
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={14}
          strokeWidth={2}
          className="font-semibold"
        />
      </Button>
    </div>
  );
};
