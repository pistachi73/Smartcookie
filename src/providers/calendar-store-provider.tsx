// src/providers/counter-store-provider.tsx
"use client";

import { type ReactNode, createContext, use, useState } from "react";
import { useStore } from "zustand";

import {
  type CalendarState,
  type CalendarStore,
  createCalendarStore,
  initCalendarStore,
} from "@/stores/calendar-store";

export type CalendarStoreApi = ReturnType<typeof createCalendarStore>;

export const CalendarStoreContext = createContext<CalendarStoreApi | undefined>(
  undefined,
);

export interface CalendarStoreProviderProps {
  children: ReactNode;
  initialCalendarStore?: Partial<CalendarState>;
  skipHydration?: boolean;
}

export const CalendarStoreProvider = ({
  children,
  initialCalendarStore,
  skipHydration,
}: CalendarStoreProviderProps) => {
  const [store] = useState(() =>
    createCalendarStore(initCalendarStore(initialCalendarStore), skipHydration),
  );

  return (
    <CalendarStoreContext.Provider value={store}>
      {children}
    </CalendarStoreContext.Provider>
  );
};

export const useCalendarStore = <T,>(
  selector: (store: CalendarStore) => T,
): T => {
  const calendarStoreContext = use(CalendarStoreContext);

  if (!calendarStoreContext) {
    throw new Error(
      "useCalendarStore must be used within CalendarStoreProvider",
    );
  }

  return useStore(calendarStoreContext, selector);
};
