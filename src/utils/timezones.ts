type Timezone = {
  name: string;
  offset: number;
  abbreviation: string;
  descriptiveName: string;
};

export const UTCTimezone: Timezone = {
  name: "UTC",
  offset: 0,
  abbreviation: "UTC",
  descriptiveName: "(UTC+00:00) UTC",
};

export const timezones: Timezone[] = [
  {
    name: "Pacific/Honolulu",
    offset: -10,
    abbreviation: "HST",
    descriptiveName: "(UTC-10:00) Pacific - Honolulu",
  },
  {
    name: "America/Anchorage",
    offset: -9,
    abbreviation: "AKST",
    descriptiveName: "(UTC-09:00) America - Anchorage",
  },
  {
    name: "America/Los_Angeles",
    offset: -8,
    abbreviation: "PST",
    descriptiveName: "(UTC-08:00) America - Los Angeles",
  },
  {
    name: "America/Denver",
    offset: -7,
    abbreviation: "MST",
    descriptiveName: "(UTC-07:00) America - Denver",
  },
  {
    name: "America/Phoenix",
    offset: -7,
    abbreviation: "MST",
    descriptiveName: "(UTC-07:00) America - Phoenix",
  },
  {
    name: "America/Chicago",
    offset: -6,
    abbreviation: "CST",
    descriptiveName: "(UTC-06:00) America - Chicago",
  },
  {
    name: "America/New_York",
    offset: -5,
    abbreviation: "EST",
    descriptiveName: "(UTC-05:00) America - New York",
  },
  {
    name: "America/Sao_Paulo",
    offset: -3,
    abbreviation: "BRT",
    descriptiveName: "(UTC-03:00) America - Sao Paulo",
  },
  {
    name: "America/Argentina/Buenos_Aires",
    offset: -3,
    abbreviation: "ART",
    descriptiveName: "(UTC-03:00) America - Argentina - Buenos Aires",
  },
  {
    name: "America/Santiago",
    offset: -3,
    abbreviation: "CLT",
    descriptiveName: "(UTC-03:00) America - Santiago",
  },
  {
    name: "UTC",
    offset: 0,
    abbreviation: "UTC",
    descriptiveName: "(UTC+00:00) UTC",
  },
  {
    name: "Europe/London",
    offset: 0,
    abbreviation: "GMT",
    descriptiveName: "(UTC+00:00) Europe - London",
  },
  {
    name: "Atlantic/Reykjavik",
    offset: 0,
    abbreviation: "GMT",
    descriptiveName: "(UTC+00:00) Atlantic - Reykjavik",
  },
  {
    name: "Europe/Berlin",
    offset: 1,
    abbreviation: "CET",
    descriptiveName: "(UTC+01:00) Europe - Berlin",
  },
  {
    name: "Europe/Paris",
    offset: 1,
    abbreviation: "CET",
    descriptiveName: "(UTC+01:00) Europe - Paris",
  },
  {
    name: "Europe/Madrid",
    offset: 1,
    abbreviation: "CET",
    descriptiveName: "(UTC+01:00) Europe - Madrid",
  },
  {
    name: "Europe/Rome",
    offset: 1,
    abbreviation: "CET",
    descriptiveName: "(UTC+01:00) Europe - Rome",
  },
  {
    name: "Africa/Lagos",
    offset: 1,
    abbreviation: "WAT",
    descriptiveName: "(UTC+01:00) Africa - Lagos",
  },
  {
    name: "Africa/Johannesburg",
    offset: 2,
    abbreviation: "SAST",
    descriptiveName: "(UTC+02:00) Africa - Johannesburg",
  },
  {
    name: "Africa/Cairo",
    offset: 2,
    abbreviation: "EET",
    descriptiveName: "(UTC+02:00) Africa - Cairo",
  },
  {
    name: "Europe/Moscow",
    offset: 3,
    abbreviation: "MSK",
    descriptiveName: "(UTC+03:00) Europe - Moscow",
  },
  {
    name: "Asia/Dubai",
    offset: 4,
    abbreviation: "GST",
    descriptiveName: "(UTC+04:00) Asia - Dubai",
  },
  {
    name: "Asia/Kolkata",
    offset: 5.5,
    abbreviation: "IST",
    descriptiveName: "(UTC+05:30) Asia - Kolkata",
  },
  {
    name: "Asia/Shanghai",
    offset: 8,
    abbreviation: "CST",
    descriptiveName: "(UTC+08:00) Asia - Shanghai",
  },
  {
    name: "Asia/Singapore",
    offset: 8,
    abbreviation: "SGT",
    descriptiveName: "(UTC+08:00) Asia - Singapore",
  },
  {
    name: "Australia/Perth",
    offset: 8,
    abbreviation: "AWST",
    descriptiveName: "(UTC+08:00) Australia - Perth",
  },
  {
    name: "Antarctica/Casey",
    offset: 8,
    abbreviation: "CAST",
    descriptiveName: "(UTC+08:00) Antarctica - Casey",
  },
  {
    name: "Asia/Tokyo",
    offset: 9,
    abbreviation: "JST",
    descriptiveName: "(UTC+09:00) Asia - Tokyo",
  },
  {
    name: "Asia/Seoul",
    offset: 9,
    abbreviation: "KST",
    descriptiveName: "(UTC+09:00) Asia - Seoul",
  },
  {
    name: "Australia/Brisbane",
    offset: 10,
    abbreviation: "AEST",
    descriptiveName: "(UTC+10:00) Australia - Brisbane",
  },
  {
    name: "Australia/Sydney",
    offset: 11,
    abbreviation: "AEDT",
    descriptiveName: "(UTC+11:00) Australia - Sydney",
  },
  {
    name: "Australia/Melbourne",
    offset: 11,
    abbreviation: "AEDT",
    descriptiveName: "(UTC+11:00) Australia - Melbourne",
  },
  {
    name: "Pacific/Fiji",
    offset: 12,
    abbreviation: "FJT",
    descriptiveName: "(UTC+12:00) Pacific - Fiji",
  },
  {
    name: "Pacific/Auckland",
    offset: 13,
    abbreviation: "NZDT",
    descriptiveName: "(UTC+13:00) Pacific - Auckland",
  },
];
