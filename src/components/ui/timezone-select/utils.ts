import { UTCTimezone, timezones } from "./timezones";

export const getCurrentTimezone = () => {
  const date = new Date();
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const timezoneOffset = timezoneOffsetMinutes / -60;

  const timezone = findTimezoneByOffset(timezoneOffset);

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
