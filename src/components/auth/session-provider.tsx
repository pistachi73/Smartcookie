"use client";

import type { Session } from "@auth/core/types";
import { createContext, useContext, useMemo } from "react";

const CustomSessionContext = createContext(null as Session | null);

type CustomSessionProviderProps = {
  children: React.ReactNode;
  session: Session | null;
};

export const CustomSessionProvider = ({
  children,
  session,
}: CustomSessionProviderProps) => {
  const value = useMemo(() => session, [session]);

  return (
    <CustomSessionContext.Provider value={value}>
      {children}
    </CustomSessionContext.Provider>
  );
};

export const useCustomSession = () => {
  const value = useContext(CustomSessionContext);

  if (value === undefined) {
    throw new Error(
      "useCustomSession must be used within a CustomSessionProvider",
    );
  }

  return value;
};
