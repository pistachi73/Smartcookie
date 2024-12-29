import { getWeekdayCardinal } from "@/lib/calendar";
import { type CalendarDate, getDayOfWeek } from "@internationalized/date";
import { format } from "date-fns";
import { type Frequency, type Options, RRule, Weekday } from "rrule";
import type { Language } from "rrule/dist/esm/nlp/i18n";

export enum EndsEnum {
  ENDS_NEVER = "ENDS_NEVER",
  ENDS_ON = "ENDS_ON",
  ENDS_AFTER = "ENDS_AFTER",
}

export const daysOfWeekCheckboxes: {
  id: number;
  label: string;
}[] = [
  { id: 0, label: "M" },
  { id: 1, label: "T" },
  { id: 2, label: "W" },
  { id: 3, label: "T" },
  { id: 4, label: "F" },
  { id: 5, label: "S" },
  { id: 6, label: "S" },
];

export enum PrefefinedRecurrencesEnum {
  NO_RECURRENCE = "no-recurrence",
  EVERY_DAY = "every-day",
  EVERY_WEEKDAY = "every-weekday",
  EVERY_WEEK_ON_SELECTED_DATE = "every-week-on-selected-date",
  EVERY_MONTHDAY = "every-monthday",
  EVERY_CARDINAL_MONTHDAY = "every-month-on-selected-date",
  EVERY_YEARDAY = "every-yearday",
  CUSTOM = "custom-recurrence",
}

export const getPredefinedRecurrencesOptionsMap = (
  selectedDate: CalendarDate,
): {
  [key in PrefefinedRecurrencesEnum]: CustomRruleOptions | null;
} => {
  return {
    [PrefefinedRecurrencesEnum.NO_RECURRENCE]: null,
    [PrefefinedRecurrencesEnum.CUSTOM]: null,
    [PrefefinedRecurrencesEnum.EVERY_DAY]: {
      freq: RRule.DAILY,
      interval: 1,
    },
    [PrefefinedRecurrencesEnum.EVERY_WEEKDAY]: {
      freq: RRule.WEEKLY,
      interval: 1,
      weeklyByweekday: [0, 1, 2, 3, 4],
    },
    [PrefefinedRecurrencesEnum.EVERY_WEEK_ON_SELECTED_DATE]: {
      freq: RRule.WEEKLY,
      interval: 1,
      weeklyByweekday: [getDayOfWeek(selectedDate, "en-GB")],
    },
    [PrefefinedRecurrencesEnum.EVERY_MONTHDAY]: {
      freq: RRule.MONTHLY,
      interval: 1,
      bymonthday: [selectedDate.day],
      monthlyByweekday: undefined,
    },
    [PrefefinedRecurrencesEnum.EVERY_CARDINAL_MONTHDAY]: {
      freq: RRule.MONTHLY,
      interval: 1,
      bymonthday: undefined,
      monthlyByweekday: [
        new Weekday(
          getDayOfWeek(selectedDate, "en-GB"),
          getWeekdayCardinal(selectedDate.toDate("UTC")).cardinal,
        ),
      ],
    },
    [PrefefinedRecurrencesEnum.EVERY_YEARDAY]: {
      freq: RRule.YEARLY,
      interval: 1,
    },
  };
};

export const getPredefinedRecurrencesLabelMap = (
  selectedDate: CalendarDate,
): {
  [key in PrefefinedRecurrencesEnum]: {
    label: string;
    auxLabel?: string;
  } | null;
} => {
  return {
    [PrefefinedRecurrencesEnum.NO_RECURRENCE]: {
      label: "Does not repeat",
    },
    [PrefefinedRecurrencesEnum.EVERY_DAY]: {
      label: "Every day",
    },
    [PrefefinedRecurrencesEnum.EVERY_WEEKDAY]: {
      label: "Every weekday",
      auxLabel: "Mon - Fri",
    },
    [PrefefinedRecurrencesEnum.EVERY_WEEK_ON_SELECTED_DATE]: {
      label: "Every week",
      auxLabel: `on ${format(selectedDate.toDate("UTC"), "iii")}`,
    },
    [PrefefinedRecurrencesEnum.EVERY_MONTHDAY]: {
      label: "Every month",
      auxLabel: `on the ${format(selectedDate.toDate("UTC"), "do")}`,
    },
    [PrefefinedRecurrencesEnum.EVERY_CARDINAL_MONTHDAY]: {
      label: "Every month",
      auxLabel: `on the ${getWeekdayCardinal(selectedDate.toDate("UTC")).label} ${format(selectedDate.toDate("UTC"), "iii")}`,
    },
    [PrefefinedRecurrencesEnum.EVERY_YEARDAY]: {
      label: "Every year",
      auxLabel: `on ${format(selectedDate.toDate("UTC"), "MMM d")}`,
    },
    [PrefefinedRecurrencesEnum.CUSTOM]: null,
  };
};

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

export type NullableCustomRruleOptions = {
  dstart?: Options["dtstart"];
  freq: Options["freq"];
  interval: Options["interval"];
  weeklyByweekday?: Options["byweekday"];
  monthlyByweekday?: Options["byweekday"];
  bymonthday?: Options["bymonthday"];
  until?: Options["until"];
  count?: Options["count"];
};

export type CustomRruleOptions = Partial<{
  [K in keyof NullableCustomRruleOptions]: NonNullable<
    NullableCustomRruleOptions[K]
  >;
}>;

export const parseRruleOptions = ({
  rruleOptions,
  ends,
}: {
  rruleOptions: CustomRruleOptions;
  ends: EndsEnum;
}): Partial<Options> => {
  return {
    dtstart: rruleOptions.dstart,
    freq: rruleOptions.freq,
    ...(rruleOptions.interval && { interval: rruleOptions.interval }),
    ...(rruleOptions.freq === RRule.WEEKLY &&
      rruleOptions.weeklyByweekday && {
        byweekday: rruleOptions.weeklyByweekday,
      }),
    ...(rruleOptions.freq === RRule.MONTHLY &&
      rruleOptions.monthlyByweekday && {
        byweekday: rruleOptions.monthlyByweekday,
      }),
    ...(rruleOptions.freq === RRule.MONTHLY &&
      rruleOptions.bymonthday && {
        bymonthday: rruleOptions.bymonthday,
      }),
    ...(ends === EndsEnum.ENDS_ON && { until: rruleOptions.until }),
    ...(ends === EndsEnum.ENDS_AFTER && { count: rruleOptions.count }),
  };
};

export const rruleLanguage: Language = {
  dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  monthNames: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  tokens: {},
};

export const parseRruleText = (
  rrule: RRule | null,
  interval: number,
): { label: string; auxLabel: string } => {
  if (!rrule) return { label: "Does not repeat", auxLabel: "" };

  const fullText = rrule.toText(undefined, rruleLanguage);
  const wordArray = fullText.split(" ");

  const sliceIndex = interval > 1 ? 3 : 2;

  return {
    label: wordArray.slice(0, sliceIndex).join(" "),
    auxLabel: wordArray.slice(sliceIndex).join(" "),
  };
};
