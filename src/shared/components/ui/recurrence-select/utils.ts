import { type Frequency, type Options, RRule } from "rrule";
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

export type CustomRruleOptions = {
  dstart: Options["dtstart"];
  freq: Options["freq"];
  interval: Options["interval"];
  byweekday?: Options["byweekday"];
  bymonthday: number[];
  until?: Options["until"] | null;
  count?: Options["count"] | null;
};

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
      rruleOptions.byweekday && {
        byweekday: rruleOptions.byweekday,
      }),
    ...(rruleOptions.freq === RRule.MONTHLY &&
      rruleOptions.bymonthday && {
        bymonthday: rruleOptions.bymonthday,
      }),
    ...(ends === EndsEnum.ENDS_ON && { until: rruleOptions.until }),
    ...(ends === EndsEnum.ENDS_AFTER && { count: rruleOptions.count }),
  };
};

export const parseRruleText = (
  rruleString?: string,
): { label: string; auxLabel: string } => {
  if (!rruleString) return { label: "Does not repeat", auxLabel: "" };

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

export type SetRruleOptions = React.Dispatch<
  React.SetStateAction<CustomRruleOptions>
>;
