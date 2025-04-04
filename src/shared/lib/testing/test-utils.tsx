import { DeviceOnlyProvider } from "@/shared/components/layout/device-only/device-only-provider";
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement } from "react";
import { useEffect } from "react";
import { vi } from "vitest";
import { createTestQueryClient } from "./query-client-utils";

interface TestProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

/**
 * A component that wraps the children with all required providers for testing
 */
export function TestProviders({ children, queryClient }: TestProvidersProps) {
  const client = queryClient || createTestQueryClient();

  // Ensure browser APIs are mocked at the component level as well
  useEffect(() => {
    const originalResizeObserver = window.ResizeObserver;
    const originalIntersectionObserver = window.IntersectionObserver;

    window.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));

    window.IntersectionObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
      root: null,
      rootMargin: "",
      thresholds: [],
      takeRecords: vi.fn(),
    }));

    return () => {
      window.ResizeObserver = originalResizeObserver;
      window.IntersectionObserver = originalIntersectionObserver;
    };
  }, []);

  return (
    <QueryClientProvider client={client}>
      <DeviceOnlyProvider deviceType={"desktop"}>{children}</DeviceOnlyProvider>
    </QueryClientProvider>
  );
}

/**
 * Custom render method that wraps components with all required providers
 */
export function customRender(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & { queryClient?: QueryClient },
) {
  const { queryClient, ...renderOptions } = options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <TestProviders queryClient={queryClient}>{children}</TestProviders>
    ),
    ...renderOptions,
  });
}

/**
 * Re-export everything from testing-library
 */
export * from "@testing-library/react";

/**
 * Override the render method with our custom version
 */
export { customRender as render };
