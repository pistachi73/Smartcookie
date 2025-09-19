import type { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@/shared/lib/testing/query-client-utils";
import { act, renderHook, waitFor } from "@/shared/lib/testing/test-utils";

import type { DataAccessError } from "@/data-access/errors";
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

vi.mock("@/shared/hooks/plan-limits/use-limit-toaster", () => ({
  useLimitToaster: vi.fn().mockReturnValue(vi.fn()),
}));

vi.mock(
  "@/shared/hooks/plan-limits/query-options/notes-count-query-options",
  () => ({
    getUserQuickNoteCountQueryOptions: {
      queryKey: ["user-quick-notes-count"],
    },
  }),
);

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
const mockUserNotesCountQueryKey = ["user-quick-notes-count"];

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
    vi.spyOn(queryClient, "getQueryData").mockImplementation((queryKey) => {
      if (JSON.stringify(queryKey) === JSON.stringify(mockQueryKey)) {
        return [
          {
            id: 1,
            content: "Existing note",
            hubId: 123,
            updatedAt: "2023-01-01",
          },
        ];
      }
      if (
        JSON.stringify(queryKey) === JSON.stringify(mockUserNotesCountQueryKey)
      ) {
        return 5;
      }
      return undefined;
    });
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
    expect(queryClient.getQueryData).toHaveBeenCalledWith(
      mockUserNotesCountQueryKey,
    );
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({
      queryKey: mockQueryKey,
    });
    expect(queryClient.setQueryData).toHaveBeenCalledTimes(3);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockQuickNoteReturn);
  });

  it("should handle DataAccessError and revert optimistic updates", async () => {
    const mockError: DataAccessError<"UNEXPECTED_ERROR"> = {
      type: "UNEXPECTED_ERROR",
      message: "Failed to create note",
    };

    vi.mocked(mocks.createQuickNote).mockResolvedValue(mockError);
    const { result } = renderHookWithQueryClient(queryClient);

    const originalHubData = queryClient.getQueryData(mockQueryKey);
    const originalCountData = queryClient.getQueryData(
      mockUserNotesCountQueryKey,
    );

    const errorNote = {
      content: "ERROR_CASE",
      hubId: 123,
      updatedAt: "2023-01-05T00:00:00Z",
    };

    await act(async () => {
      result.current.mutate(errorNote);
    });

    expect(queryClient.setQueryData).toHaveBeenCalled();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      mockQueryKey,
      originalHubData,
    );

    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      mockUserNotesCountQueryKey,
      originalCountData,
    );

    expect(toast.error).toHaveBeenCalledWith("Failed to create note");
  });

  it("should handle successful note creation with valid data", async () => {
    const { result } = renderHookWithQueryClient(queryClient);

    const validNote = {
      content: "Valid note content",
      hubId: 123,
      updatedAt: "2023-01-06T00:00:00Z",
    };

    await act(async () => {
      result.current.mutate(validNote);
    });

    expect(queryClient.setQueryData).toHaveBeenCalled();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.isError).toBe(false);
    expect(result.current.data).toEqual(mockQuickNoteReturn);
  });

  it("should handle network errors gracefully", async () => {
    vi.mocked(mocks.createQuickNote).mockRejectedValue(
      new Error("Network error"),
    );

    const { result } = renderHookWithQueryClient(queryClient);

    const errorNote = {
      content: "Network error case",
      hubId: 123,
      updatedAt: "2023-01-07T00:00:00Z",
    };

    await act(async () => {
      result.current.mutate(errorNote);
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toEqual(new Error("Network error"));
  });

  it("should handle limit exceeded error and show limit toaster", async () => {
    const mockLimitToaster = vi.fn();
    vi.mocked(vi.fn()).mockReturnValue(mockLimitToaster);

    const limitError: DataAccessError<"LIMIT_REACHED_NOTES"> = {
      type: "LIMIT_REACHED_NOTES",
      message:
        "Quick note limit exceeded. You can have up to 10 notes on your current plan.",
      meta: {
        current: 10,
        max: 10,
        limitType: "notes",
      },
    };

    vi.mocked(mocks.createQuickNote).mockResolvedValue(limitError);
    const { result } = renderHookWithQueryClient(queryClient);

    const originalHubData = queryClient.getQueryData(mockQueryKey);
    const originalCountData = queryClient.getQueryData(
      mockUserNotesCountQueryKey,
    );

    const limitNote = {
      content: "This would exceed limit",
      hubId: 123,
      updatedAt: "2023-01-08T00:00:00Z",
    };

    await act(async () => {
      result.current.mutate(limitNote);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      mockQueryKey,
      originalHubData,
    );

    expect(queryClient.setQueryData).toHaveBeenCalledWith(
      mockUserNotesCountQueryKey,
      originalCountData,
    );
  });

  it("should handle unexpected errors with generic toast", async () => {
    const unexpectedError: DataAccessError<"UNEXPECTED_ERROR"> = {
      type: "UNEXPECTED_ERROR",
      message: "Something went wrong",
    };

    vi.mocked(mocks.createQuickNote).mockResolvedValue(unexpectedError);
    const { result } = renderHookWithQueryClient(queryClient);

    const unexpectedNote = {
      content: "Unexpected error case",
      hubId: 123,
      updatedAt: "2023-01-09T00:00:00Z",
    };

    await act(async () => {
      result.current.mutate(unexpectedNote);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(toast.error).toHaveBeenCalledWith("Something went wrong");
  });
});
