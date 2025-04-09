import { type QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type RenderOptions, render } from "@testing-library/react";
import type { ReactElement } from "react";
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

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
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
