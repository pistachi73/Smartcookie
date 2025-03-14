"use client";

import { type ReactNode, createContext, use, useRef } from "react";

import { createQuickNotesStore, initQuickNotesStore } from "@/stores/quick-notes-store";
import type { QuickNotesStore } from "@/stores/quick-notes-store/quick-notes-store.types";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "zustand";
import { quickNotesQueryOptions } from "../components/portal/quick-notes/utils";
export type QuickNotesStoreApi = ReturnType<typeof createQuickNotesStore>;

export const QuickNotesStoreContext = createContext<QuickNotesStoreApi | undefined>(undefined);

export interface QuickNotesStoreProviderProps {
  children: ReactNode;
}

export const QuickNotesStoreProvider = ({ children }: QuickNotesStoreProviderProps) => {
  const { data } = useQuery(quickNotesQueryOptions);
  const storeRef = useRef<QuickNotesStoreApi | undefined>(undefined);

  if (!storeRef.current) {
    const initialState = initQuickNotesStore({
      hubIds: data?.map(({ hub }) => hub.id) || [],
      hubs: data?.map(({ hub }) => hub) || [],
    });
    storeRef.current = createQuickNotesStore(initialState);
  }

  return (
    <QuickNotesStoreContext.Provider value={storeRef.current}>
      {children}
    </QuickNotesStoreContext.Provider>
  );
};

export const useQuickNotesStore = <T,>(selector: (store: QuickNotesStore) => T): T => {
  const quickNotesStoreContext = use(QuickNotesStoreContext);

  if (!quickNotesStoreContext) {
    throw new Error("useQuickNotesStore must be used within QuickNotesStoreProvider");
  }

  return useStore(quickNotesStoreContext, selector);
};
