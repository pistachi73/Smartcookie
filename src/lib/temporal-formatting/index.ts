import type { Temporal } from "@js-temporal/polyfill";

// 24:24 hour format
export const formatDate24Hour = (date: Temporal.ZonedDateTime) => {
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
