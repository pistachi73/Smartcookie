import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Hook that provides navigation functions that preserve all search parameters
 * Similar to react-router's useNavigateWithParams but for Next.js
 */
export function useNavigateWithParams() {
  const searchParams = useSearchParams();

  /**
   * Creates a URL that preserves all existing search parameters
   * @param path - The base path
   * @param additionalParams - Additional parameters to add or update in the URL
   * @returns The URL with preserved and additional parameters
   */
  const createHrefWithParams = useCallback(
    (
      path: string,
      additionalParams: Record<string, string | null> = {},
    ): string => {
      // Create a new URLSearchParams object
      const newParams = new URLSearchParams();

      // Preserve all existing parameters
      searchParams.forEach((value, key) => {
        newParams.set(key, value);
      });

      // Add any additional parameters
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value === null) {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      // Build the URL with the retained parameters
      const queryString = newParams.toString();
      return queryString ? `${path}?${queryString}` : path;
    },
    [searchParams],
  );

  return {
    createHrefWithParams,
  };
}

export default useNavigateWithParams;
