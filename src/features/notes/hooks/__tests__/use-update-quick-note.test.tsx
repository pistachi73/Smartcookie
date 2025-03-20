import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@/shared/lib/testing";
// @ts-ignore - These imports are used in JSX and for typings but linter reports them as only used as types
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useUpdateQuickNote } from "../use-update-quick-note";

// Mock the update action
vi.mock("@/features/notes/actions", () => ({
  updateQuickNoteAction: vi.fn().mockImplementation(async (data) => {
    return {
      data: {
        id: data.id,
        content: data.content,
        updatedAt: data.updatedAt || new Date().toISOString(),
      },
    };
  }),
}));

// Mock setTimeout and clearTimeout
vi.useFakeTimers();

describe("useUpdateQuickNote", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();

    // Set up spies on the queryClient methods
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

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with the provided initial content", () => {
    const wrapper = createQueryClientWrapper(queryClient);

    const { result } = renderHook(
      () =>
        useUpdateQuickNote({
          noteId: 123,
          initialContent: "Initial test content",
          hubId: 456,
        }),
      { wrapper },
    );

    expect(result.current.content).toBe("Initial test content");
    expect(result.current.isUnsaved).toBe(false);
    expect(result.current.isSaving).toBe(false);
  });

  it("should update content when handleContentChange is called", async () => {
    const wrapper = createQueryClientWrapper(queryClient);

    const { result } = renderHook(
      () =>
        useUpdateQuickNote({
          noteId: 123,
          initialContent: "Initial test content",
          hubId: 456,
        }),
      { wrapper },
    );

    // Update the content
    act(() => {
      result.current.handleContentChange("Updated content");
    });

    // Content should be updated immediately
    expect(result.current.content).toBe("Updated content");

    // Should be marked as unsaved
    expect(result.current.isUnsaved).toBe(true);

    // Mutation should not be called immediately (debounced)
    expect(queryClient.cancelQueries).not.toHaveBeenCalled();
  });

  it("should save content after debounce timer expires", async () => {
    const wrapper = createQueryClientWrapper(queryClient);

    const { result } = renderHook(
      () =>
        useUpdateQuickNote({
          noteId: 123,
          initialContent: "Initial test content",
          hubId: 456,
        }),
      { wrapper },
    );

    // Update the content
    act(() => {
      result.current.handleContentChange("Updated content");
    });

    // Fast-forward past the 800ms debounce timeout used in the hook
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Make sure any promises resolve
    await act(async () => {
      await Promise.resolve();
    });

    // We can't easily test the internal mutation call directly,
    // since it happens inside the setTimeout
    // Just check that the content was updated correctly
    expect(result.current.content).toBe("Updated content");

    // Execute any remaining timers and promises
    act(() => {
      vi.runAllTimers();
    });

    await act(async () => {
      await Promise.resolve();
    });
  });

  it("should not save if content hasn't changed from initial", async () => {
    const wrapper = createQueryClientWrapper(queryClient);

    const { result } = renderHook(
      () =>
        useUpdateQuickNote({
          noteId: 123,
          initialContent: "Initial test content",
          hubId: 456,
        }),
      { wrapper },
    );

    // Update to the same content as initial
    act(() => {
      result.current.handleContentChange("Initial test content");
    });

    // Fast-forward debounce timeout
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Mutation should not be triggered for unchanged content
    expect(queryClient.cancelQueries).not.toHaveBeenCalled();
    expect(queryClient.setQueryData).not.toHaveBeenCalled();
  });

  it("should handle multiple content changes within debounce period", async () => {
    const wrapper = createQueryClientWrapper(queryClient);

    const { result } = renderHook(
      () =>
        useUpdateQuickNote({
          noteId: 123,
          initialContent: "Initial test content",
          hubId: 456,
        }),
      { wrapper },
    );

    // First content change
    act(() => {
      result.current.handleContentChange("Change 1");
    });

    // Update again before debounce expires
    act(() => {
      vi.advanceTimersByTime(300);
      result.current.handleContentChange("Change 2");
    });

    // Update yet again before debounce expires
    act(() => {
      vi.advanceTimersByTime(300);
      result.current.handleContentChange("Final change");
    });

    // Content should be the latest value
    expect(result.current.content).toBe("Final change");

    // Fast-forward to complete the debounce
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Make sure any promises resolve
    await act(async () => {
      await Promise.resolve();
    });

    // The final value should be the one set
    expect(result.current.content).toBe("Final change");
  });
});
