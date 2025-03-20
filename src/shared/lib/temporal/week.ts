import type { Temporal } from "temporal-polyfill";

type ValidTemporal =
  | Temporal.ZonedDateTime
  | Temporal.PlainDate
  | Temporal.PlainDateTime;

export function getEndOfWeek<T extends ValidTemporal>(
  date: T,
  weekStartsOn?: number,
): T;
export function getEndOfWeek(date: ValidTemporal, weekStartsOn = 1) {
  const daysToAdd = (7 - date.dayOfWeek + weekStartsOn) % 7;
  return date.add({ days: daysToAdd });
}

export function getStartOfWeek<T extends ValidTemporal>(
  date: T,
  weekStartsOn?: number,
): T;
export function getStartOfWeek(date: ValidTemporal, weekStartsOn = 1) {
  const daysToSubtract = (date.dayOfWeek - weekStartsOn + 7) % 7;
  return date.subtract({ days: daysToSubtract });
}

export const getWeekBoundaries = (date: ValidTemporal, weekStartsOn = 1) => {
  return {
    startOfWeek: getStartOfWeek(date, weekStartsOn),
    endOfWeek: getEndOfWeek(date, weekStartsOn),
  };
};
