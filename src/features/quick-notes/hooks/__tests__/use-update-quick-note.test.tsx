import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@/shared/lib/testing/query-client-utils";
import { act, renderHook } from "@/shared/lib/testing/test-utils";
import type { QueryClient } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  type UseUpdateQuickNoteProps,
  useUpdateQuickNote,
} from "../use-update-quick-note";

const mocks = vi.hoisted(() => ({
  updateQuickNote: vi.fn(),
}));

vi.mock("@/data-access/quick-notes/mutations", () => ({
  updateQuickNote: mocks.updateQuickNote,
}));

vi.mock("@/shared/hooks/use-current-user", () => ({
  useCurrentUser: vi.fn().mockReturnValue({
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
  }),
}));

vi.useFakeTimers();

const mockHookProps: UseUpdateQuickNoteProps = {
  noteId: 123,
  initialContent: "Initial test content",
  hubId: 456,
};

const renderHookWithQueryClient = (
  queryClient: QueryClient,
  hookProps: UseUpdateQuickNoteProps = mockHookProps,
) => {
  return renderHook(() => useUpdateQuickNote(hookProps), {
    wrapper: createQueryClientWrapper(queryClient),
  });
};

describe("useUpdateQuickNote", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    vi.mocked(mocks.updateQuickNote).mockResolvedValue({
      id: 123,
      content: "Updated content",
      updatedAt: new Date().toISOString(),
    });

    queryClient = createTestQueryClient();

    vi.spyOn(queryClient, "setQueryData");
    vi.spyOn(queryClient, "getQueryData").mockReturnValue([
      {
        id: 123,
        content: "Initial content",
        hubId: 456,
        updatedAt: "2023-01-01",
      },
    ]);
    vi.spyOn(queryClient, "cancelQueries").mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with the provided initial content", () => {
    const { result } = renderHookWithQueryClient(queryClient);
    expect(result.current.content).toBe("Initial test content");
    expect(result.current.isUnsaved).toBe(false);
    expect(result.current.isSaving).toBe(false);
  });

  it("should update content when handleContentChange is called", async () => {
    const { result } = renderHookWithQueryClient(queryClient);
    act(() => {
      result.current.handleContentChange("Updated content");
    });

    expect(result.current.content).toBe("Updated content");

    expect(result.current.isUnsaved).toBe(true);

    expect(queryClient.cancelQueries).not.toHaveBeenCalled();
  });

  it("should save content after debounce timer expires", async () => {
    const { result } = renderHookWithQueryClient(queryClient);
    act(() => {
      result.current.handleContentChange("Updated content");
    });

    expect(result.current.content).toBe("Updated content");
    expect(result.current.isSaving).toBe(false);
    expect(result.current.isUnsaved).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(mocks.updateQuickNote).toHaveBeenCalledWith(
      {
        id: 123,
        content: "Updated content",
        updatedAt: expect.any(String),
      },
      {
        userId: "test-user-id",
      },
    );
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({
      queryKey: ["hub-notes", 456],
    });
    expect(queryClient.setQueryData).toHaveBeenCalled();
  });

  it("should not save if content hasn't changed from initial", async () => {
    const { result } = renderHookWithQueryClient(queryClient);

    act(() => {
      result.current.handleContentChange("Initial test content");
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(queryClient.cancelQueries).not.toHaveBeenCalled();
    expect(queryClient.setQueryData).not.toHaveBeenCalled();
  });

  it("should handle multiple content changes within debounce period", async () => {
    const { result } = renderHookWithQueryClient(queryClient);
    act(() => {
      result.current.handleContentChange("Change 1");
    });

    act(() => {
      vi.advanceTimersByTime(300);
      result.current.handleContentChange("Change 2");
    });

    act(() => {
      vi.advanceTimersByTime(300);
      result.current.handleContentChange("Final change");
    });

    expect(result.current.content).toBe("Final change");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.content).toBe("Final change");
  });
});
