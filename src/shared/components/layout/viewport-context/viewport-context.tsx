"use client";

import {
  type PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from "react";

import type { Viewport, ViewportHelpers } from "./types";
import useMediaQueries from "./use-media-queries";
import { createViewportHelpers } from "./utils";

const ViewportContext = createContext<ViewportHelpers | null>(null);

const ViewportProvider = ({
  children,
  ssrViewport,
}: PropsWithChildren<{
  ssrViewport: Viewport;
}>) => {
  const currentViewport = useMediaQueries(ssrViewport);

  const viewportHelpers = useMemo(
    () => createViewportHelpers(currentViewport),
    [currentViewport],
  );

  return (
    <ViewportContext.Provider value={viewportHelpers}>
      {children}
    </ViewportContext.Provider>
  );
};

const useViewport = () => {
  const context = useContext(ViewportContext);

  if (!context) {
    throw new Error("useViewport must be used within a ViewportContext");
  }

  return context;
};

export { ViewportProvider, useViewport };
