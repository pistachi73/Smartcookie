import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@/shared/lib/testing/query-client-utils";
import { act, renderHook, waitFor } from "@/shared/lib/testing/test-utils";

import { useAddQuickNote } from "../use-add-quick-note";

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/shared/hooks/use-current-user", () => ({
  useCurrentUser: vi.fn().mockReturnValue({
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
  }),
}));

const mocks = vi.hoisted(() => ({
  createQuickNote: vi.fn(),
}));

const mockQuickNote = {
  content: "New Test Note",
  hubId: 123,
  updatedAt: "2023-01-02T00:00:00Z",
};

const mockQuickNoteReturn = {
  id: 999,
  content: "New Test Note",
  hubId: 123,
  updatedAt: "2023-01-02T00:00:00Z",
  userId: "123",
  createdAt: "2023-01-02T00:00:00Z",
};

const mockQueryKey = ["hub-notes", mockQuickNote.hubId];

vi.mock("@/data-access/quick-notes/mutations", () => ({
  createQuickNote: mocks.createQuickNote,
}));

const renderHookWithQueryClient = (queryClient: QueryClient) => {
  return renderHook(() => useAddQuickNote(), {
    wrapper: createQueryClientWrapper(queryClient),
  });
};

describe("useAddQuickNote", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    vi.mocked(mocks.createQuickNote).mockResolvedValue(mockQuickNoteReturn);

    queryClient = createTestQueryClient();

    vi.spyOn(queryClient, "setQueryData");
    vi.spyOn(queryClient, "getQueryData").mockReturnValue([
      { id: 1, content: "Existing note", hubId: 123, updatedAt: "2023-01-01" },
    ]);
    vi.spyOn(queryClient, "cancelQueries").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should add a new note and handle optimistic updates", async () => {
    const { result } = renderHookWithQueryClient(queryClient);

    await act(async () => {
      result.current.mutate(mockQuickNote);
    });

    expect(queryClient.getQueryData).toHaveBeenCalledWith(mockQueryKey);
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({
      queryKey: mockQueryKey,
    });
    expect(queryClient.setQueryData).toHaveBeenCalledTimes(2);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockQuickNoteReturn);
  });

  it("should handle errors and revert optimistic updates", async () => {
    vi.mocked(mocks.createQuickNote).mockRejectedValue(
      new Error("Failed to add note"),
    );
    const { result } = renderHookWithQueryClient(queryClient);

    const originalData = queryClient.getQueryData(["hub-notes", 123]);

    const errorNote = {
      content: "ERROR_CASE",
      hubId: 123,
      updatedAt: "2023-01-05T00:00:00Z",
    };

    await act(async () => {
      result.current.mutate(errorNote);
    });

    expect(queryClient.setQueryData).toHaveBeenCalled();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      ["hub-notes", 123],
      originalData,
    );

    expect(toast.error).toHaveBeenCalledWith("Failed to add note");
  });

  it("should handle server returning null data", async () => {
    const { result } = renderHookWithQueryClient(queryClient);

    const nullDataNote = {
      content: "SERVER_ERROR",
      hubId: 123,
      updatedAt: "2023-01-06T00:00:00Z",
    };

    await act(async () => {
      result.current.mutate(nullDataNote);
    });

    expect(queryClient.setQueryData).toHaveBeenCalled();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isError).toBe(false);
  });

  it("should handle errors while maintaining focus registry integrity", async () => {
    vi.mocked(mocks.createQuickNote).mockRejectedValue(
      new Error("Failed to add note"),
    );

    const { result } = renderHookWithQueryClient(queryClient);

    const errorNote = {
      content: "ERROR_CASE",
      hubId: 123,
      updatedAt: "2023-01-07T00:00:00Z",
    };

    await act(async () => {
      result.current.mutate(errorNote);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
