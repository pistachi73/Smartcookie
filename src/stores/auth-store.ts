import type { AuthSchema, AuthSteps } from "@/components/auth/validation";
import { immer } from "zustand/middleware/immer";
import { createStore } from "zustand/vanilla";

export type AuthState = {
  data: Partial<AuthSchema>;
  step: AuthSteps;
};

export type AuthActions = {
  setData: (data: Partial<AuthSchema>) => void;
  setStep: (step: AuthSteps) => void;
};

export type AuthStore = AuthState & AuthActions;

export const initAuthStore = (initilData?: Partial<AuthState>): AuthState => {
  return {
    data: {},
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
    })),
  );
};
