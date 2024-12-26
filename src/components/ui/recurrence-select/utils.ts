import { type Frequency, type Options, RRule } from "rrule";

export enum EndsEnum {
  ENDS_NEVER = "ENDS_NEVER",
  ENDS_ON = "ENDS_ON",
  ENDS_AFTER = "ENDS_AFTER",
}

export type NonNullableRruleOptions = {
  [K in keyof Options]: NonNullable<Options[K]>;
};

export const daysOfWeekCheckboxes: {
  id: number;
  label: string;
}[] = [
  { id: 1, label: "M" },
  { id: 2, label: "T" },
  { id: 3, label: "W" },
  { id: 4, label: "T" },
  { id: 5, label: "F" },
  { id: 6, label: "S" },
  { id: 7, label: "S" },
];

export enum PrefefinedRecurrencesEnum {
  NO_RECURRENCE = "no-recurrence",
  EVERY_WEEKDAY = "every-weekday",
  EVERY_WEEK_ON_SELECTED_DATE = "every-week-on-selected-date",
  CUSTOM = "custom-recurrence",
}

export const getFrequencyItems = (
  interval: number,
): { id: Frequency; label: string }[] => {
  const isPlural = interval > 1;
  return [
    {
      id: RRule.DAILY,
      label: `day${isPlural ? "s" : ""}`,
    },
    {
      id: RRule.WEEKLY,
      label: `week${isPlural ? "s" : ""}`,
    },
    {
      id: RRule.MONTHLY,
      label: `month${isPlural ? "s" : ""}`,
    },
    {
      id: RRule.YEARLY,
      label: `year${isPlural ? "s" : ""}`,
    },
  ];
};
