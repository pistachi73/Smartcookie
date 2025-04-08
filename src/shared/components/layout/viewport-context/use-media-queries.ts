import { useEffect, useState } from "react";

import type { Viewport } from "./types";
import { BREAKPOINTS, getCurrentViewport, getMediaQueryString } from "./utils";

// hook to get current viewport:
// server-side: viewport is set to ssrViewport
// client-side: viewport is updated based on media queries (window.matchMedia)
const useMediaQueries = (ssrViewport: Viewport) => {
  const [viewport, setViewport] = useState(ssrViewport);

  useEffect(() => {
    // create media query lists for each breakpoint
    const mediaQueryLists = BREAKPOINTS.map((breakpoint) =>
      window.matchMedia(getMediaQueryString(breakpoint)),
    );

    // update viewport if current viewport is different from state viewport
    const updateViewport = () => {
      setViewport((state) => {
        const currentViewport = getCurrentViewport(mediaQueryLists);
        return state !== currentViewport ? currentViewport : state;
      });
    };

    // add event listeners for each media query list
    mediaQueryLists.forEach((mediaQueryList) => {
      mediaQueryList.addEventListener("change", updateViewport);
    });

    // update viewport if current viewport is different from ssr viewport
    updateViewport();

    // remove event listeners for each media query list
    return () => {
      mediaQueryLists.forEach((mediaQueryList) => {
        mediaQueryList.removeEventListener("change", updateViewport);
      });
    };
  }, []);

  return viewport;
};

export default useMediaQueries;
