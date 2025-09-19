import { act, renderHook } from "@testing-library/react";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@/shared/lib/testing/query-client-utils";

import type { DataAccessError } from "@/data-access/errors";
import type { NoteSummary } from "../../types/quick-notes.types";
import { useUpdateQuickNote } from "../use-update-quick-note";

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

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@/shared/hooks/plan-limits/use-limit-toaster", () => ({
  useLimitToaster: vi.fn().mockReturnValue(vi.fn()),
}));

vi.mock("@/shared/hooks/plan-limits/use-notes-limits", () => ({
  useNotesLimits: vi.fn().mockReturnValue({
    maxCharacters: 1000,
  }),
}));

const mockUpdateQuickNoteReturn = {
  id: 123,
  content: "Updated content",
  updatedAt: "2023-01-02T00:00:00Z",
};

const mockHubId = 456;
const mockQueryKey = ["hub-notes", mockHubId];

describe("useUpdateQuickNote", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  const renderHookWithQueryClient = (props: any) =>
    renderHook(() => useUpdateQuickNote(props), {
      wrapper: createQueryClientWrapper(queryClient),
    });

  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(mocks.updateQuickNote).mockResolvedValue(
      mockUpdateQuickNoteReturn,
    );
    queryClient = createTestQueryClient();
    vi.spyOn(queryClient, "setQueryData");
    vi.spyOn(queryClient, "getQueryData");
    vi.spyOn(queryClient, "cancelQueries").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe("basic functionality", () => {
    it("should update content and trigger debounced save for positive note IDs", async () => {
      const initialProps = {
        noteId: 123,
        initialContent: "Initial content",
        hubId: mockHubId,
      };

      const { result } = renderHookWithQueryClient(initialProps);

      act(() => {
        result.current.handleContentChange("New content");
      });

      expect(result.current.content).toBe("New content");
      expect(result.current.isUnsaved).toBe(true);

      // Fast-forward the debounce timeout
      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Flush any pending async operations
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      // Check if the mutation was called with both data and auth context
      expect(mocks.updateQuickNote).toHaveBeenCalledWith(
        {
          id: 123,
          content: "New content",
          updatedAt: expect.any(String),
        },
        { userId: "test-user-id" },
      );
    });

    it("should not trigger save when content hasn't changed", async () => {
      const initialProps = {
        noteId: 123,
        initialContent: "Initial content",
        hubId: mockHubId,
      };

      const { result } = renderHookWithQueryClient(initialProps);

      act(() => {
        result.current.handleContentChange("Initial content");
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(mocks.updateQuickNote).not.toHaveBeenCalled();
    });
  });

  describe("optimistic note retry mechanism", () => {
    it("should start retry polling for negative note IDs", async () => {
      const initialProps = {
        noteId: -Date.now(),
        initialContent: "",
        hubId: mockHubId,
        clientId: "client-123",
      };

      const { result } = renderHookWithQueryClient(initialProps);

      act(() => {
        result.current.handleContentChange("New content");
      });

      // Fast-forward the debounce timeout
      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Should not call mutation directly for negative IDs
      expect(mocks.updateQuickNote).not.toHaveBeenCalled();

      // Fast-forward the retry polling interval
      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(queryClient.getQueryData).toHaveBeenCalledWith(mockQueryKey);
    });

    it("should retry and save when real note is found by clientId", async () => {
      const optimisticId = -Date.now();
      const clientId = "client-123";

      const initialProps = {
        noteId: optimisticId,
        initialContent: "",
        hubId: mockHubId,
        clientId: clientId,
      };

      // Set up initial notes data
      const mockNotes: NoteSummary[] = [
        {
          id: optimisticId,
          content: "",
          updatedAt: "2023-01-01T00:00:00Z",
          hubId: mockHubId,
          clientId: clientId,
        },
      ];

      queryClient.setQueryData(mockQueryKey, mockNotes);
      vi.mocked(queryClient.getQueryData).mockReturnValue(mockNotes);

      const { result } = renderHookWithQueryClient(initialProps);

      act(() => {
        result.current.handleContentChange("New content");
      });

      // Fast-forward the debounce timeout
      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Simulate the note getting a real ID from the server
      const updatedNotes: NoteSummary[] = [
        {
          id: 999, // Real ID from server
          content: "New content",
          updatedAt: "2023-01-01T00:00:00Z",
          hubId: mockHubId,
          clientId: clientId, // Same clientId
        },
      ];

      // Update the query data to simulate server response
      queryClient.setQueryData(mockQueryKey, updatedNotes);
      vi.mocked(queryClient.getQueryData).mockReturnValue(updatedNotes);

      // Fast-forward the retry polling interval
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Flush any pending async operations
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(mocks.updateQuickNote).toHaveBeenCalledWith(
        {
          id: 999,
          content: "New content",
          updatedAt: expect.any(String),
        },
        { userId: "test-user-id" },
      );
    });

    it("should retry and save when real note is found by clientId (no content fallback)", async () => {
      const optimisticId = -Date.now();
      const testClientId = "client-456";

      const initialProps = {
        noteId: optimisticId,
        initialContent: "",
        hubId: mockHubId,
        clientId: testClientId,
      };

      const mockNotes: NoteSummary[] = [
        {
          id: optimisticId,
          content: "",
          updatedAt: "2023-01-01T00:00:00Z",
          hubId: mockHubId,
          clientId: testClientId,
        },
      ];

      queryClient.setQueryData(mockQueryKey, mockNotes);
      vi.mocked(queryClient.getQueryData).mockReturnValue(mockNotes);

      const { result } = renderHookWithQueryClient(initialProps);

      act(() => {
        result.current.handleContentChange("Unique content");
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Simulate the note getting a real ID but keeping the same clientId
      const updatedNotes: NoteSummary[] = [
        {
          id: 888,
          content: "Unique content",
          updatedAt: "2023-01-01T00:00:00Z",
          hubId: mockHubId,
          clientId: testClientId, // Same clientId to match
        },
      ];

      queryClient.setQueryData(mockQueryKey, updatedNotes);
      vi.mocked(queryClient.getQueryData).mockReturnValue(updatedNotes);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Flush any pending async operations
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(mocks.updateQuickNote).toHaveBeenCalledWith(
        {
          id: 888,
          content: "Unique content",
          updatedAt: expect.any(String),
        },
        { userId: "test-user-id" },
      );
    });

    it("should timeout and show error after 10 seconds", async () => {
      const initialProps = {
        noteId: -Date.now(),
        initialContent: "",
        hubId: mockHubId,
        clientId: "client-123",
      };

      const { result } = renderHookWithQueryClient(initialProps);

      act(() => {
        result.current.handleContentChange("New content");
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Fast-forward past the timeout
      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Note creation timed out. Please try editing the note again.",
      );
    });

    it("should clear retry polling on successful save", async () => {
      const initialProps = {
        noteId: 123,
        initialContent: "Initial content",
        hubId: mockHubId,
      };

      const { result } = renderHookWithQueryClient(initialProps);

      act(() => {
        result.current.handleContentChange("New content");
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Flush any pending async operations
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(result.current.isSaving).toBe(false);
      expect(result.current.isUnsaved).toBe(false);
    });
  });

  describe("error handling", () => {
    it("should revert optimistic updates on DataAccessError", async () => {
      const mockError: DataAccessError<"UNEXPECTED_ERROR"> = {
        type: "UNEXPECTED_ERROR",
        message: "Something went wrong! Please try again.",
      };

      vi.mocked(mocks.updateQuickNote).mockResolvedValue(mockError);

      const previousData: NoteSummary[] = [
        {
          id: 123,
          content: "Original content",
          updatedAt: "2023-01-01T00:00:00Z",
          hubId: mockHubId,
        },
      ];

      queryClient.setQueryData(mockQueryKey, previousData);
      vi.mocked(queryClient.getQueryData).mockReturnValue(previousData);

      const initialProps = {
        noteId: 123,
        initialContent: "Original content",
        hubId: mockHubId,
      };

      const { result } = renderHookWithQueryClient(initialProps);

      act(() => {
        result.current.handleContentChange("New content");
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Flush any pending async operations
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Something went wrong! Please try again.",
      );

      expect(queryClient.setQueryData).toHaveBeenCalledWith(
        mockQueryKey,
        previousData,
      );
    });

    it("should handle network errors gracefully", async () => {
      vi.mocked(mocks.updateQuickNote).mockRejectedValue(
        new Error("Network error"),
      );

      const previousData: NoteSummary[] = [
        {
          id: 123,
          content: "Original content",
          updatedAt: "2023-01-01T00:00:00Z",
          hubId: mockHubId,
        },
      ];

      queryClient.setQueryData(mockQueryKey, previousData);
      vi.mocked(queryClient.getQueryData).mockReturnValue(previousData);

      const initialProps = {
        noteId: 123,
        initialContent: "Original content",
        hubId: mockHubId,
      };

      const { result } = renderHookWithQueryClient(initialProps);

      act(() => {
        result.current.handleContentChange("New content");
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Flush any pending async operations
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(queryClient.setQueryData).toHaveBeenCalledWith(
        mockQueryKey,
        previousData,
      );
    });

    it("should handle content limit exceeded error", async () => {
      const limitError: DataAccessError<"CONTENT_LIMIT_REACHED_NOTES"> = {
        type: "CONTENT_LIMIT_REACHED_NOTES",
        message:
          "Quick note content limit exceeded. You can have up to 1000 characters per note on your current plan.",
      };

      vi.mocked(mocks.updateQuickNote).mockResolvedValue(limitError);

      const previousData: NoteSummary[] = [
        {
          id: 123,
          content: "Original content",
          updatedAt: "2023-01-01T00:00:00Z",
          hubId: mockHubId,
        },
      ];

      queryClient.setQueryData(mockQueryKey, previousData);
      vi.mocked(queryClient.getQueryData).mockReturnValue(previousData);

      const initialProps = {
        noteId: 123,
        initialContent: "Original content",
        hubId: mockHubId,
      };

      const { result } = renderHookWithQueryClient(initialProps);

      act(() => {
        result.current.handleContentChange(
          "Very long content that exceeds limit",
        );
      });

      act(() => {
        vi.advanceTimersByTime(800);
      });

      // Flush any pending async operations
      await act(async () => {
        await vi.runAllTimersAsync();
      });

      expect(queryClient.setQueryData).toHaveBeenCalledWith(
        mockQueryKey,
        previousData,
      );
    });
  });
});
