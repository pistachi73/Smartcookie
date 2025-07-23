import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

import type { AuthState, AuthStore } from "../types/auth-store.types";

export const initAuthStore = (initilData?: Partial<AuthState>): AuthState => {
  return {
    data: {},
    animationDir: 1,
    step: initilData?.step || "LANDING",
  };
};

export const defaultInitState: AuthState = initAuthStore();

export const createAuthStore = (initState: AuthState = defaultInitState) => {
  return createStore<AuthStore>()(
    immer((set) => ({
      ...initState,
      setData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
      setStep: (step) => set(() => ({ step })),
      setAnimationDir: (animationDir) => set(() => ({ animationDir })),
    })),
  );
};
