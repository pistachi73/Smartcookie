import superjson from "superjson"; //  can use anything: serialize-javascript, devalue, etc.
import type { PersistStorage } from "zustand/middleware";

export const superjsonStorage: PersistStorage<any> = {
  getItem: (name) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    return superjson.parse(str);
  },
  setItem: (name, value) => {
    localStorage.setItem(name, superjson.stringify(value));
  },
  removeItem: (name) => localStorage.removeItem(name),
};
