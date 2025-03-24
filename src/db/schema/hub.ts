import { relations } from "drizzle-orm";
import {
  index,
  pgEnum,
  serial,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { event } from "./event";
import { quickNote } from "./quick-note";
import { customColorEnum } from "./shared";
import { studentHub } from "./student-hub";
import { user } from "./user";
import { pgTable } from "./utils";

export const hubStatusEnum = pgEnum("hub_status", ["active", "inactive"]);

export const hub = pgTable(
  "hub",
  {
    id: serial().primaryKey(),
    userId: uuid()
      .references(() => user.id, { onDelete: "cascade" })
      .notNull(),
    name: text().notNull(),
    description: text(),
    schedule: text(),
    status: hubStatusEnum("status").default("active"),
    color: customColorEnum("color").default("neutral").notNull(),
    startDate: timestamp({ mode: "string" }).notNull(),
    endDate: timestamp({ mode: "string" }),
    level: varchar({ length: 20 }),
    createdAt: timestamp({ mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: "string" })
      .defaultNow()
      .$onUpdate(() => new Date().toISOString())
      .notNull(),
  },
  (t) => ({
    userIdIdx: index("user_id_idx").on(t.userId),
  }),
);

export type InsertHub = typeof hub.$inferInsert;
export type Hub = typeof hub.$inferSelect;
export type HubStatus = (typeof hubStatusEnum.enumValues)[number];

export const hubRelations = relations(hub, ({ many }) => ({
  students: many(studentHub),
  sessions: many(event),
  quickNotes: many(quickNote),
}));
