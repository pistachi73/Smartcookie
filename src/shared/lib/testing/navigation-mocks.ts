import { vi } from "vitest";

/**
 * Creates a mock implementation of Next.js useSearchParams hook
 * @param params - Object with key-value pairs to initialize the search params
 * @returns Mock search params object with all necessary methods
 */
export const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams(params);
  return {
    get: (key: string) => searchParams.get(key),
    has: (key: string) => searchParams.has(key),
    getAll: (key: string) => searchParams.getAll(key),
    keys: () => searchParams.keys(),
    values: () => searchParams.values(),
    entries: () => searchParams.entries(),
    forEach: (callback: (value: string, key: string) => void) =>
      searchParams.forEach(callback),
    toString: () => searchParams.toString(),
  };
};

/**
 * Mock implementation of Next.js navigation hooks
 * Call this in your test setup to mock useRouter, usePathname, and useSearchParams
 */
export const mockNextNavigation = () => {
  return vi.mock("next/navigation", () => ({
    useParams: vi.fn(),
    usePathname: vi.fn(),
    useRouter: vi.fn(),
    useSearchParams: vi.fn(),
  }));
};
