import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@/shared/lib/testing/query-client-utils";
import { act, renderHook } from "@/shared/lib/testing/test-utils";
import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DELETION_TIME_MS, useDeleteQuickNote } from "../use-delete-quick-note";

const mocks = vi.hoisted(() => ({
  deleteQuickNote: vi.fn(),
}));

vi.mock("@/data-access/quick-notes/mutations", () => ({
  deleteQuickNote: mocks.deleteQuickNote,
}));

vi.useFakeTimers();

global.requestAnimationFrame = vi.fn((cb) => {
  setTimeout(() => cb(0), 0);
  return 1;
});
global.cancelAnimationFrame = vi.fn();

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
}));

vi.mock("@/shared/hooks/use-current-user", () => ({
  useCurrentUser: vi.fn().mockReturnValue({
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
  }),
}));

const renderHookWithQueryClient = (queryClient: QueryClient) => {
  return renderHook(() => useDeleteQuickNote({ noteId: 123, hubId: 456 }), {
    wrapper: createQueryClientWrapper(queryClient),
  });
};

describe("useDeleteQuickNote", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;
  const initialMockNotes = [
    { id: 123, content: "Test note", hubId: 456, updatedAt: "2023-01-01" },
    { id: 124, content: "Another note", hubId: 456, updatedAt: "2023-01-02" },
  ];

  beforeEach(() => {
    vi.mocked(mocks.deleteQuickNote).mockResolvedValue({ success: true });
    queryClient = createTestQueryClient();
    vi.spyOn(queryClient, "setQueryData");
    vi.spyOn(queryClient, "getQueryData").mockReturnValue(initialMockNotes);
    vi.spyOn(queryClient, "cancelQueries").mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { result } = renderHookWithQueryClient(queryClient);
    expect(result.current.isDeleting).toBe(false);
    expect(result.current.deleteProgress).toBe(0);
    expect(typeof result.current.handleDeletePress).toBe("function");
    expect(typeof result.current.handleDeleteRelease).toBe("function");
  });

  it("should call cancelAnimationFrame on release", () => {
    const { result } = renderHookWithQueryClient(queryClient);
    act(() => {
      result.current.handleDeletePress();
      result.current.handleDeleteRelease();
    });

    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("should clean up animation on unmount", () => {
    const { result, unmount } = renderHookWithQueryClient(queryClient);

    act(() => {
      result.current.handleDeletePress();
    });
    unmount();

    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });

  it("should perform optimistic updates when deleting a note", async () => {
    const { result } = renderHookWithQueryClient(queryClient);

    await act(async () => {
      result.current.handleDeletePress();
      vi.advanceTimersByTime(DELETION_TIME_MS);
    });

    expect(mocks.deleteQuickNote).toHaveBeenCalledWith({ id: 123 });
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({
      queryKey: ["hub-notes", 456],
    });
    expect(queryClient.setQueryData).toHaveBeenCalled();
  });

  it("should handle errors and roll back optimistic updates", async () => {
    vi.mocked(mocks.deleteQuickNote).mockRejectedValueOnce(
      new Error("Delete failed"),
    );

    const { result } = renderHookWithQueryClient(queryClient);

    await act(async () => {
      result.current.handleDeletePress();
      vi.advanceTimersByTime(DELETION_TIME_MS);
    });

    expect(toast.error).toHaveBeenCalledWith("Failed to delete note");
    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      ["hub-notes", 456],
      initialMockNotes,
    );
  });
});
