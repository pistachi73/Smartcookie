// @ts-ignore - These imports are used in JSX and for typings but linter reports them as only used as types
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Creates a QueryClient instance with testing-friendly configuration
 */
export function createTestQueryClient(_options?: {
  defaultData?: Record<string, unknown>;
}): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Number.POSITIVE_INFINITY,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Creates a wrapper component that provides a QueryClient
 * for use with renderHook or render
 */
export function createQueryClientWrapper(queryClient?: QueryClient) {
  const client = queryClient || createTestQueryClient();

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}
