import { useEffect } from "react";

import { useCurrentTimeStore } from "../store/current-time-store";

export const useCurrentTime = () => {
  const { now, label, top, subscribe } = useCurrentTimeStore();

  useEffect(() => {
    const unsubscribe = subscribe();
    return unsubscribe;
  }, [subscribe]);

  return {
    now,
    label,
    top,
  };
};
