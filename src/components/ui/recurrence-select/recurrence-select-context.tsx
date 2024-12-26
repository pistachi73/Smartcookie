import { CalendarDate, getDayOfWeek } from "@internationalized/date";
import { createContext, useMemo, useState } from "react";
import { RRule } from "rrule";
import type { NonNullableRruleOptions } from "./utils";

type RecurrenceSelectContextType = {
  rruleOptions: Partial<NonNullableRruleOptions>;
  setRruleOptions: React.Dispatch<
    React.SetStateAction<Partial<NonNullableRruleOptions>>
  >;
  selectedDate: CalendarDate;
};

export const RecurrenceSelectContext =
  createContext<RecurrenceSelectContextType>({
    rruleOptions: {},
    setRruleOptions: () => {},
    selectedDate: new CalendarDate(2023, 1, 1),
  });

type RecurrenceSelectProviderProps = {
  children: React.ReactNode;
  selectedDate: CalendarDate;
};

export const RecurrenceSelectContextProvider = ({
  children,
  selectedDate,
}: RecurrenceSelectProviderProps) => {
  const [rruleOptions, setRruleOptions] = useState<
    Partial<NonNullableRruleOptions>
  >({
    freq: RRule.WEEKLY,
    interval: 1,
    byweekday: [getDayOfWeek(selectedDate, "en-GB")],
    until: selectedDate.toDate("UTC"),
  });

  const value = useMemo(
    () => ({ rruleOptions, setRruleOptions, selectedDate }),
    [rruleOptions, selectedDate],
  );

  return (
    <RecurrenceSelectContext value={value}>{children}</RecurrenceSelectContext>
  );
};
