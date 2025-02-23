import type { Temporal } from "@js-temporal/polyfill";

type ValidTemporal =
  | Temporal.ZonedDateTime
  | Temporal.PlainDate
  | Temporal.PlainDateTime;

export function getEndOfMonth<T extends ValidTemporal>(date: T): T;
export function getEndOfMonth(date: ValidTemporal) {
  const daysToAdd = date.daysInMonth - date.day;
  return date.add({ days: daysToAdd });
}

export function getStartOfMonth<T extends ValidTemporal>(date: T): T;
export function getStartOfMonth(date: ValidTemporal): ValidTemporal {
  const daysToSubtract = (date.day - 1 + date.daysInMonth) % date.daysInMonth;
  return date.subtract({ days: daysToSubtract });
}
