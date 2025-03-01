import { Temporal } from "@js-temporal/polyfill";
import superjson from "superjson";
import type { PersistStorage } from "zustand/middleware";

superjson.registerCustom<Temporal.PlainDate, string>(
  {
    isApplicable: (v): v is Temporal.PlainDate =>
      v instanceof Temporal.PlainDate,
    serialize: (v) => v.toJSON(),
    deserialize: (v) => Temporal.PlainDate.from(v),
  },
  "Temporal.PlainDate",
);

export const superjsonStorage: PersistStorage<any> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return superjson.parse(str);
  },
  setItem: (name, value) => {
    window?.localStorage?.setItem(name, superjson.stringify(value));
  },
  removeItem: (name) => localStorage.removeItem(name),
};
