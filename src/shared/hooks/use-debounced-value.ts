import { useEffect, useRef, useState } from "react";

export const useDebouncedValue = <T>(
  value: T,
  delay = 500,
  callback?: (value: T) => void,
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const callbackRef = useRef(callback);
  const isFirstRender = useRef(true);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      if (!isFirstRender.current) {
        callbackRef.current?.(value);
      } else {
        isFirstRender.current = false;
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
};
