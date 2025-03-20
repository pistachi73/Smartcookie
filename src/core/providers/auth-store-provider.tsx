"use client";

import {
  createAuthStore,
  initAuthStore,
} from "@/features/auth/store/auth-store";
import type {
  AuthState,
  AuthStore,
} from "@/features/auth/types/auth-store.types";
import { type ReactNode, createContext, use, useState } from "react";
import { useStore } from "zustand";

export type AuthStoreApi = ReturnType<typeof createAuthStore>;

export const AuthStoreContext = createContext<AuthStoreApi | undefined>(
  undefined,
);

export interface AuthStoreProviderProps {
  children: ReactNode;
  initialStore?: Partial<AuthState>;
}

export const AuthStoreProvider = ({
  children,
  initialStore,
}: AuthStoreProviderProps) => {
  const [store] = useState(() => createAuthStore(initAuthStore(initialStore)));

  return (
    <AuthStoreContext.Provider value={store}>
      {children}
    </AuthStoreContext.Provider>
  );
};

export const useAuthStore = <T,>(selector: (store: AuthStore) => T): T => {
  const authStoreContext = use(AuthStoreContext);

  if (!authStoreContext) {
    throw new Error("useAuthStore must be used within AuthStoreProvider");
  }

  return useStore(authStoreContext, selector);
};
