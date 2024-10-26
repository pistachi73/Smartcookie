import React from "react";
import type { AuthSteps } from ".";

export const AuthContext = React.createContext<{
  formType: AuthSteps;
  animationDir: number;
  setFormType: (formType: AuthSteps) => void;
  setAnimationDir: (animationDir: number) => void;
}>({
  formType: "LANDING",
  animationDir: 1,
  setFormType: () => {},
  setAnimationDir: () => {},
});

export const AuthProvider = ({
  initialFormType,
  children,
}: {
  initialFormType?: AuthSteps;
  children: React.ReactNode;
}) => {
  const [formType, setFormType] = React.useState<AuthSteps>(
    initialFormType ?? "LANDING",
  );

  const [animationDir, setAnimationDir] = React.useState(1);

  return (
    <AuthContext.Provider
      value={{
        formType,
        animationDir,
        setFormType,
        setAnimationDir,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }

  return context;
};
