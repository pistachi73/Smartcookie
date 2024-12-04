import { UTCTimezone, timezones } from "./timezones";

export const getCurrentTimezone = () => {
  const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timezone = findTimezoneByName(timezoneName);

  if (!timezone) return UTCTimezone;

  return timezone;
};

export const findTimezoneByName = (name: string) => {
  console.log({ name });
  return timezones.find((timezone) => timezone.name === name);
};
export const findTimezoneByOffset = (offset: number) => {
  return timezones.find((timezone) => timezone.offset === offset);
};
