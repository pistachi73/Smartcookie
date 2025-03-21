import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@/shared/lib/testing/query-client-utils";
import { renderHook, waitFor } from "@/shared/lib/testing/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useHubNotes } from "../use-hub-notes";

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

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { id: 1, content: "Test note", hubId: 123, updatedAt: "2023-01-01" },
    ]);
  });
});
