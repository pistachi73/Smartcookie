import { vi } from "vitest";

export const useNavigateWithParams = vi.fn(() => ({
  createHrefWithParams: vi.fn(
    (path: string, params?: Record<string, string | null>) => {
      const queryPairs = Object.entries(params || {})
        .filter(([, value]) => value !== null && value !== undefined)
        .map(([key, value]) => `${key}=${encodeURIComponent(value!)}`);

      const queryString = queryPairs.join("&");
      return queryString ? `${path}?${queryString}` : path;
    },
  ),
}));

export default useNavigateWithParams;
