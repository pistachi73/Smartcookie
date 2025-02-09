import { format } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { calculateOccurrenceTop } from "./utils";

export const useCurrentTime = () => {
  const [now, setNow] = useState(new Date());
  const timerRef = useRef<number | null>(null);

  // This function updates the current time, then schedules the next update
  const tick = useCallback(() => {
    setNow(new Date());
    const current = new Date();
    // Calculate delay until the next minute starts
    const delay =
      60000 - (current.getSeconds() * 1000 + current.getMilliseconds());
    timerRef.current = window.setTimeout(tick, delay);
  }, []);

  useEffect(() => {
    // Schedule the first tick aligned to the next minute boundary.
    const current = new Date();
    const delay =
      60000 - (current.getSeconds() * 1000 + current.getMilliseconds());
    timerRef.current = window.setTimeout(tick, delay);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [tick]);

  // Compute the top offset using your custom function.
  const top = calculateOccurrenceTop({
    hours: now.getHours(),
    minutes: now.getMinutes(),
  });

  return {
    label: format(now, "HH:mm"),
    top,
  };
};
