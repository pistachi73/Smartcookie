import { useEffect, useRef, useState } from "react";

export const useDebouncedValue = <T>(value: T, delay = 500) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};
