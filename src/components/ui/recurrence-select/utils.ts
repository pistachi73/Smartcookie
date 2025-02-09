import { getWeekdayCardinal } from "@/lib/calendar";
import { type CalendarDate, getDayOfWeek } from "@internationalized/date";
import { format } from "date-fns";
import { type Frequency, type Options, RRule, Weekday } from "rrule";
import type { Language } from "rrule/dist/esm/nlp/i18n";
import type { ParsedOptions } from "rrule/dist/esm/types";

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

export const getSelectItems = (selectedDate: CalendarDate, value?: string) => {
  const shortWeekdayStr = format(selectedDate.toDate("UTC"), "iii");

  type Section = {
    section: string;
    items: {
      value: string;
      name: string;
      auxName?: string;
    }[];
  };

  const sections: [Section, Section, Section] = [
    {
      section: "no-repeat",
      items: [
        {
          value: getSelectItemsValue(
            PrefefinedRecurrencesEnum.NO_RECURRENCE,
            selectedDate,
          ),
          name: "Does not repeat",
        },
      ],
    },
    {
      section: "predefined",
      items: [
        {
          value: getSelectItemsValue(
            PrefefinedRecurrencesEnum.EVERY_DAY,
            selectedDate,
          ),
          name: "Every day",
        },
        {
          value: getSelectItemsValue(
            PrefefinedRecurrencesEnum.EVERY_WEEKDAY,
            selectedDate,
          ),
          name: "Every weekday",
          auxName: "Mon - Fri",
        },
        {
          value: getSelectItemsValue(
            PrefefinedRecurrencesEnum.EVERY_WEEK_ON_SELECTED_DATE,
            selectedDate,
          ),
          name: "Every week",
          auxName: `on ${shortWeekdayStr}`,
        },
        {
          value: getSelectItemsValue(
            PrefefinedRecurrencesEnum.EVERY_MONTHDAY,
            selectedDate,
          ),
          name: "Every month",
          auxName: `on the ${format(selectedDate.toDate("UTC"), "do")}`,
        },
        {
          value: getSelectItemsValue(
            PrefefinedRecurrencesEnum.EVERY_CARDINAL_MONTHDAY,
            selectedDate,
          ),
          name: "Every month",
          auxName: `on the ${getWeekdayCardinal(selectedDate.toDate("UTC")).label} ${shortWeekdayStr}`,
        },
        {
          value: getSelectItemsValue(
            PrefefinedRecurrencesEnum.EVERY_YEARDAY,
            selectedDate,
          ),
          name: "Every year",
          auxName: `on ${format(selectedDate.toDate("UTC"), "MMM d")}`,
        },
      ],
    },
    {
      section: "custom",
      items: [{ value: "custom-recurrence", name: "Custom..." }],
    },
  ];

  if (
    value &&
    !sections.some((section) =>
      section.items.some((item) => item.value === value),
    )
  ) {
    try {
      const rruleLabels = parseRruleText(value);
      sections[1].items.push({
        value,
        name: rruleLabels.label,
        auxName: rruleLabels.auxLabel,
      });
    } catch (e) {
      console.log(e);
    }
  }

  return sections;
};

export const getSelectItemsValue = (
  predefinedRecurrence: PrefefinedRecurrencesEnum,
  selectedDate: CalendarDate,
): string => {
  if (predefinedRecurrence === PrefefinedRecurrencesEnum.NO_RECURRENCE) {
    return PrefefinedRecurrencesEnum.NO_RECURRENCE;
  }

  if (predefinedRecurrence === PrefefinedRecurrencesEnum.CUSTOM) {
    return PrefefinedRecurrencesEnum.CUSTOM;
  }

  const options = {
    dstart: selectedDate.toDate("UTC"),
    ...getPredefinedRecurrencesOptionsMap(selectedDate)[predefinedRecurrence],
  };

  const rrule = new RRule(
    convertCustomToRRuleOptions({
      rruleOptions: options,
      ends: EndsEnum.ENDS_NEVER,
    }),
  );

  return rrule.toString();
};

export type NullableCustomRruleOptions = {
  dstart?: Options["dtstart"];
  freq: Options["freq"];
  interval: Options["interval"];
  weeklyByweekday?: Options["byweekday"];
  monthlyByweekday?: Options["byweekday"];
  bymonthday?: Options["bymonthday"];
  until?: Options["until"] | null;
  count?: Options["count"] | null;
};

export type CustomRruleOptions = Partial<{
  [K in keyof NullableCustomRruleOptions]: NonNullable<
    NullableCustomRruleOptions[K]
  >;
}>;

export const convertCustomToRRuleOptions = ({
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

export const convertRRuleOptionsToCustom = (
  rruleOptions: ParsedOptions,
): CustomRruleOptions => {
  const { freq, byweekday, until, count, ...rest } = rruleOptions;

  const options: CustomRruleOptions = {
    ...rest,
    freq,
    ...(freq === RRule.WEEKLY && {
      weeklyByweekday: byweekday,
    }),
    ...(freq === RRule.MONTHLY && {
      monthlyByweekday: byweekday,
    }),
    until: until || undefined,
    count: count || undefined,
  };

  return options;
};

export const parseRruleText = (
  rruleString?: string,
): { label: string; auxLabel: string } => {
  if (!rruleString || rruleString === PrefefinedRecurrencesEnum.NO_RECURRENCE)
    return { label: "Does not repeat", auxLabel: "" };
  if (rruleString === PrefefinedRecurrencesEnum.CUSTOM)
    return { label: "Custom", auxLabel: "" };

  const rrule = RRule.fromString(rruleString);
  const fullText = rrule.toText(undefined, rruleLanguage);
  const wordArray = fullText.split(" ");

  const sliceIndex = rrule.options.interval > 1 ? 3 : 2;

  return {
    label:
      wordArray.slice(0, sliceIndex).join(" ").charAt(0).toUpperCase() +
      wordArray.slice(0, sliceIndex).join(" ").slice(1),
    auxLabel: wordArray.slice(sliceIndex).join(" "),
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
