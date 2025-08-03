import type { Temporal } from "temporal-polyfill";

type ValidTemporal =
  | Temporal.ZonedDateTime
  | Temporal.PlainDate
  | Temporal.PlainDateTime;

export const getWeekdayAbbrev = (date: ValidTemporal, locale = "en-US") => {
  return date.toLocaleString(locale, { weekday: "short" });
};

export const getWeekday = (date: ValidTemporal, locale = "en-US") => {
  return date.toLocaleString(locale, { weekday: "long" });
};

export const getMonthAbbrev = (date: ValidTemporal, locale = "en-US") => {
  return date.toLocaleString(locale, { month: "short" });
};

// 24:24 hour format
export const get24HourTime = (date: ValidTemporal) => {
  return date.toLocaleString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
};

//Friday, 21 February 2025
export const formatFullDate = (
  zonedDateTime: Temporal.ZonedDateTime,
  locale = "en-US",
) => {
  // Extract individual components
  const weekday = zonedDateTime.toLocaleString(locale, { weekday: "long" }); // EEEE: Full weekday name
  const day = zonedDateTime.toLocaleString(locale, { day: "2-digit" }); // dd: Day of the month as two digits
  const month = zonedDateTime.toLocaleString(locale, { month: "long" }); // LLLL: Full month name
  const year = zonedDateTime.toLocaleString(locale, { year: "numeric" }); // y: Full year

  // Construct the formatted string with a comma
  return `${weekday}, ${day} ${month} ${year}`;
};

/**
 * Formats a week range in the format "6-10 Jul" or "29 Jun-3 Jul" for cross-month weeks
 */
export const formatWeekRange = (
  startDate: Temporal.PlainDate,
  endDate: Temporal.PlainDate,
  locale = "en-US",
) => {
  const startDay = startDate.day;
  const endDay = endDate.day;
  const startMonth = getMonthAbbrev(startDate, locale);
  const endMonth = getMonthAbbrev(endDate, locale);

  if (startDate.month === endDate.month) {
    // Same month: "6-10 Jul"
    return `${startDay}-${endDay} ${startMonth}`;
  }
  // Different months: "29 Jun-3 Jul"
  return `${startDay} ${startMonth}-${endDay} ${endMonth}`;
};
