"use client";

import { type ReactNode, createContext, use, useRef } from "react";

import {
  createQuickNotesStore,
  initQuickNotesStore,
} from "@/features/quick-notes/store/quick-notes-store";
import type { QuickNotesStore } from "@/features/quick-notes/types/quick-notes-store.types";
import { useStore } from "zustand";

export type QuickNotesStoreApi = ReturnType<typeof createQuickNotesStore>;

export const QuickNotesStoreContext = createContext<
  QuickNotesStoreApi | undefined
>(undefined);

export interface QuickNotesStoreProviderProps {
  children: ReactNode;
  initialVisibleHubs?: number[];
}

export const QuickNotesStoreProvider = ({
  children,
  initialVisibleHubs,
}: QuickNotesStoreProviderProps) => {
  const storeRef = useRef<QuickNotesStoreApi | undefined>(undefined);

  // Initialize store on first render
  if (!storeRef.current) {
    const initialState = initQuickNotesStore({
      visibleHubs: initialVisibleHubs || [],
    });
    storeRef.current = createQuickNotesStore(initialState);
  }

  return (
    <QuickNotesStoreContext.Provider value={storeRef.current}>
      {children}
    </QuickNotesStoreContext.Provider>
  );
};

export const useQuickNotesStore = <T,>(
  selector: (store: QuickNotesStore) => T,
): T => {
  const quickNotesStoreContext = use(QuickNotesStoreContext);

  if (!quickNotesStoreContext) {
    throw new Error(
      "useQuickNotesStore must be used within QuickNotesStoreProvider",
    );
  }

  return useStore(quickNotesStoreContext, selector);
};
