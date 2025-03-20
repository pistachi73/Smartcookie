import type { AuthSchema, AuthSteps } from "../lib/validation";

export type AuthState = {
  data: Partial<AuthSchema>;
  step: AuthSteps;
  animationDir: number;
};

export type AuthActions = {
  setData: (data: Partial<AuthSchema>) => void;
  setStep: (step: AuthSteps) => void;
  setAnimationDir: (animationDir: number) => void;
};

export type AuthStore = AuthState & AuthActions;
