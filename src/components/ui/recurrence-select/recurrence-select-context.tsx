import { CalendarDate, getDayOfWeek } from "@internationalized/date";
import { createContext, useState } from "react";
import { RRule } from "rrule";
import {
  type CustomRruleOptions,
  EndsEnum,
  PrefefinedRecurrencesEnum,
} from "./utils";

type RecurrenceSelectContextType = {
  rruleOptions: CustomRruleOptions;
  value: string | undefined;
  setRruleOptions: React.Dispatch<React.SetStateAction<CustomRruleOptions>>;
  selectedDate: CalendarDate;
  ends: EndsEnum;
  setEnds: React.Dispatch<React.SetStateAction<EndsEnum>>;
  rrule: RRule | null;
  setRrule: React.Dispatch<React.SetStateAction<RRule | null>>;
  onChange: (rrule?: string) => void;
};

export const RecurrenceSelectContext =
  createContext<RecurrenceSelectContextType>({
    rruleOptions: {},
    value: undefined,
    setRruleOptions: () => {},
    selectedDate: new CalendarDate(2023, 1, 1),
    ends: EndsEnum.ENDS_NEVER,
    setEnds: () => {},
    rrule: null,
    setRrule: () => {},
    onChange: () => {},
  });

type RecurrenceSelectProviderProps = {
  children: React.ReactNode;
  selectedDate: CalendarDate;
  onChange: (rrule: string | undefined) => void;
  value?: string;
};

export const RecurrenceSelectContextProvider = ({
  children,
  selectedDate,
  onChange,
  value = PrefefinedRecurrencesEnum.NO_RECURRENCE,
}: RecurrenceSelectProviderProps) => {
  const [rrule, setRrule] = useState<RRule | null>(() => {
    if (
      value === PrefefinedRecurrencesEnum.CUSTOM ||
      value === PrefefinedRecurrencesEnum.NO_RECURRENCE
    ) {
      return null;
    }
    return RRule.fromString(value);
  });

  const [ends, setEnds] = useState<EndsEnum>(
    rrule?.options.until
      ? EndsEnum.ENDS_ON
      : rrule?.options.count
        ? EndsEnum.ENDS_AFTER
        : EndsEnum.ENDS_NEVER,
  );

  const [rruleOptions, setRruleOptions] = useState<CustomRruleOptions>(() => {
    const { options } = rrule ?? {};

    return {
      dstart: options?.dtstart || selectedDate.toDate("UTC"),
      freq: options?.freq || RRule.WEEKLY,
      interval: options?.interval || 1,
      weeklyByweekday:
        options?.freq === RRule.WEEKLY
          ? options?.byweekday || undefined
          : [getDayOfWeek(selectedDate, "en-GB")],
      monthlyByweekday:
        options?.freq === RRule.MONTHLY
          ? options?.byweekday || undefined
          : [getDayOfWeek(selectedDate, "en-GB")],
      bymonthday: options?.bymonthday || [selectedDate.day],
      until: options?.until || selectedDate.toDate("UTC"),
      count: options?.count || 1,
    };
  });

  // useEffect(() => {
  //   if (
  //     value === PrefefinedRecurrencesEnum.CUSTOM ||
  //     value === PrefefinedRecurrencesEnum.NO_RECURRENCE
  //   )
  //     return;

  //   const rrule = RRule.fromString(value);

  //   setRrule(rrule);
  //   setEnds(
  //     rrule.options.until
  //       ? EndsEnum.ENDS_ON
  //       : rrule.options.count
  //         ? EndsEnum.ENDS_AFTER
  //         : EndsEnum.ENDS_NEVER,
  //   );
  //   setRruleOptions({
  //     dstart: rrule.options.dtstart,
  //     freq: rrule.options.freq,
  //     interval: rrule.options.interval,
  //     ...(rrule.options.freq === RRule.WEEKLY &&
  //       rrule.options.byweekday && {
  //         weeklyByweekday: rrule.options.byweekday,
  //       }),
  //     ...(rrule.options.freq === RRule.MONTHLY &&
  //       rrule.options.byweekday && {
  //         monthlyByweekday: rrule.options.byweekday,
  //       }),
  //     bymonthday: rrule.options.bymonthday,
  //     until: rrule.options.until || undefined,
  //     count: rrule.options.count || undefined,
  //   });
  // }, [value]);

  const contextValue = {
    rruleOptions,
    setRruleOptions,
    selectedDate,
    ends,
    setEnds,
    rrule,
    setRrule,
    value,
    onChange,
  };

  return (
    <RecurrenceSelectContext value={contextValue}>
      {children}
    </RecurrenceSelectContext>
  );
};
