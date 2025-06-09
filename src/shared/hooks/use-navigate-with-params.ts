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
      // Convert existing search params to object
      const existingParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        existingParams[key] = value;
      });

      // Merge with additional params
      const allParams = { ...existingParams };
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value === null) {
          delete allParams[key];
        } else {
          allParams[key] = value;
        }
      });

      // Build query string manually
      const queryPairs = Object.entries(allParams)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);

      const queryString = queryPairs.join("&");

      return queryString ? `${path}?${queryString}` : path;
    },
    [searchParams],
  );

  return {
    createHrefWithParams,
  };
}

export default useNavigateWithParams;
