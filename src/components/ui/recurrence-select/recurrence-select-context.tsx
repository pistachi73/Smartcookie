import { CalendarDate, getDayOfWeek } from "@internationalized/date";
import { createContext, useState } from "react";
import { RRule } from "rrule";
import { type CustomRruleOptions, EndsEnum } from "./utils";

type RecurrenceSelectContextType = {
  rruleOptions: CustomRruleOptions;
  setRruleOptions: React.Dispatch<React.SetStateAction<CustomRruleOptions>>;
  selectedDate: CalendarDate;
  ends: EndsEnum;
  setEnds: React.Dispatch<React.SetStateAction<EndsEnum>>;
  rrule: RRule | null;
  setRrule: React.Dispatch<React.SetStateAction<RRule | null>>;
};

export const RecurrenceSelectContext =
  createContext<RecurrenceSelectContextType>({
    rruleOptions: {},
    setRruleOptions: () => {},
    selectedDate: new CalendarDate(2023, 1, 1),
    ends: EndsEnum.ENDS_NEVER,
    setEnds: () => {},
    rrule: null,
    setRrule: () => {},
  });

type RecurrenceSelectProviderProps = {
  children: React.ReactNode;
  selectedDate: CalendarDate;
};

export const RecurrenceSelectContextProvider = ({
  children,
  selectedDate,
}: RecurrenceSelectProviderProps) => {
  const [rrule, setRrule] = useState<RRule | null>(null);
  const [ends, setEnds] = useState<EndsEnum>(EndsEnum.ENDS_NEVER);
  const [rruleOptions, setRruleOptions] = useState<CustomRruleOptions>({
    dstart: selectedDate.toDate("UTC"),
    freq: RRule.WEEKLY,
    interval: 1,
    weeklyByweekday: [getDayOfWeek(selectedDate, "en-GB")],
    bymonthday: [selectedDate.day],
    until: selectedDate.toDate("UTC"),
  });

  const value = {
    rruleOptions,
    setRruleOptions,
    selectedDate,
    ends,
    setEnds,
    rrule,
    setRrule,
  };

  return (
    <RecurrenceSelectContext value={value}>{children}</RecurrenceSelectContext>
  );
};
