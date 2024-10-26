"use client";

import { createContext, useContext, useMemo, useState } from "react";

const AuthSettingsContextConsumer = createContext<{
  open: boolean;
  redirectTo: string | undefined;
}>({
  open: false,
  redirectTo: undefined,
});

const AuthSettingsContextUpdater = createContext<{
  setOpen: (open: boolean) => void;
  setRedirectTo: (redirectTo: string | undefined) => void;
}>({
  setOpen: () => {},
  setRedirectTo: () => {},
});

export const AuthSettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [redirectTo, setRedirectTo] = useState<string | undefined>(undefined);

  const consumerValue = useMemo(
    () => ({ open, redirectTo }),
    [open, redirectTo],
  );

  const updaterValue = useMemo(() => ({ setOpen, setRedirectTo }), []);

  return (
    <AuthSettingsContextConsumer.Provider value={consumerValue}>
      <AuthSettingsContextUpdater.Provider value={updaterValue}>
        {children}
      </AuthSettingsContextUpdater.Provider>
    </AuthSettingsContextConsumer.Provider>
  );
};

export const useAuthSettingsContextConsumer = () => {
  const context = useContext(AuthSettingsContextConsumer);

  if (context === undefined) {
    throw new Error(
      "useAuthSettingsContext must be used within a AuthSettingsProvider",
    );
  }

  return context;
};

export const useAuthSettingsContextUpdater = () => {
  const context = useContext(AuthSettingsContextUpdater);

  if (context === undefined) {
    throw new Error(
      "useAuthSettingsContext must be used within a AuthSettingsProvider",
    );
  }

  return context;
};
