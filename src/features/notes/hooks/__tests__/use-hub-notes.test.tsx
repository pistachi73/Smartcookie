import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@/shared/lib/testing";
// @ts-ignore - These imports are used in JSX and for typings but linter reports them as only used as types
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useHubNotes } from "../use-hub-notes";

// Mock the query options
vi.mock("../../lib/quick-notes-query-options", () => ({
  getHubNotesQueryOptions: vi.fn().mockImplementation((hubId) => ({
    queryKey: ["hub-notes", hubId],
    queryFn: vi
      .fn()
      .mockResolvedValue([
        { id: 1, content: "Test note", hubId, updatedAt: "2023-01-01" },
      ]),
  })),
}));

describe("useHubNotes", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  it("should return hub notes data when given a hubId", async () => {
    const hubId = 123;

    const wrapper = createQueryClientWrapper(queryClient);

    const { result } = renderHook(() => useHubNotes(hubId), { wrapper });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to resolve
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify the returned data
    expect(result.current.data).toEqual([
      { id: 1, content: "Test note", hubId: 123, updatedAt: "2023-01-01" },
    ]);
  });
});
