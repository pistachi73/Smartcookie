import { CalendarDate } from "@internationalized/date";
import { datetime } from "rrule";
import { DatePicker } from "../../date-picker";
import type { SetRruleOptions } from "../utils";

type StartDaySelectProps = {
  setRruleOptions: SetRruleOptions;
  minDate?: CalendarDate;
  maxDate?: CalendarDate;
  startDate?: Date | null;
  onStartDateChange?: (date: CalendarDate | null) => void;
};

export const StartDaySelect = ({
  setRruleOptions,
  startDate,
  minDate,
  maxDate,
  onStartDateChange,
}: StartDaySelectProps) => {
  return (
    <DatePicker
      aria-label="Recurrence start date"
      value={
        startDate
          ? new CalendarDate(
              startDate.getFullYear(),
              startDate.getMonth() + 1,
              startDate.getDate(),
            )
          : undefined
      }
      onChange={(startDate) => {
        setRruleOptions((prev) => ({
          ...prev,
          dstart: startDate
            ? datetime(startDate.year, startDate.month, startDate.day)
            : null,
        }));
        onStartDateChange?.(startDate);
      }}
      overlayProps={{
        placement: "right top",
      }}
      minValue={minDate}
      maxValue={maxDate}
    />
  );
};
