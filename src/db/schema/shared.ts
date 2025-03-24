import { pgEnum } from "drizzle-orm/pg-core";

export const customColorEnum = pgEnum("custom_color", [
  "flamingo",
  "tangerine",
  "banana",
  "sage",
  "peacock",
  "blueberry",
  "lavender",
  "grape",
  "graphite",
  "neutral",
  "sunshine",
  "stone",
  "slate",
]);

export type CustomColor = (typeof customColorEnum.enumValues)[number];
