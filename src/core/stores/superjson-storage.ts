import superjson from "superjson";
import { Temporal } from "temporal-polyfill";
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

// Helper to check if we're in browser environment
const isBrowser = typeof window !== "undefined";

export const superjsonStorage: PersistStorage<any> = {
  getItem: (name) => {
    if (!isBrowser) return null;

    const str = localStorage.getItem(name);

    if (!str) return null;

    try {
      return superjson.parse(str);
    } catch (error) {
      console.warn(`Failed to parse stored data for key "${name}":`, error);
      return null;
    }
  },
  setItem: (name, value) => {
    if (!isBrowser) return;

    try {
      localStorage.setItem(name, superjson.stringify(value));
    } catch (error) {
      console.warn(`Failed to store data for key "${name}":`, error);
    }
  },
  removeItem: (name) => {
    if (!isBrowser) return;

    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.warn(`Failed to remove data for key "${name}":`, error);
    }
  },
};
