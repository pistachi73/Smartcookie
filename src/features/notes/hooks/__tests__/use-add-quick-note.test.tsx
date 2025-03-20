import {
  createQueryClientWrapper,
  createTestQueryClient,
} from "@/shared/lib/testing";
// @ts-ignore - These imports are used in JSX and for typings but linter reports them as only used as types
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { noteFocusRegistry, useAddQuickNote } from "../use-add-quick-note";

// Mock the action
vi.mock("@/features/notes/actions", () => ({
  addQuickNoteAction: vi.fn().mockImplementation(async (data) => {
    return {
      data: {
        id: 999,
        content: data.content,
        hubId: data.hubId,
        updatedAt: data.updatedAt,
      },
    };
  }),
}));

describe("useAddQuickNote", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();

    // Set up spies on the queryClient methods
    vi.spyOn(queryClient, "setQueryData");
    vi.spyOn(queryClient, "getQueryData").mockReturnValue([
      { id: 1, content: "Existing note", hubId: 123, updatedAt: "2023-01-01" },
    ]);
    vi.spyOn(queryClient, "cancelQueries").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
    noteFocusRegistry.clean();
  });

  it("should add a new note and handle optimistic updates", async () => {
    const wrapper = createQueryClientWrapper(queryClient);

    const { result } = renderHook(() => useAddQuickNote(), { wrapper });

    const newNote = {
      content: "New Test Note",
      hubId: 123,
      updatedAt: "2023-01-02T00:00:00Z",
    };

    // Execute the mutation
    await act(async () => {
      result.current.mutate(newNote);
      // Wait a bit for the optimistic update to happen
      await new Promise((r) => setTimeout(r, 0));
    });

    // Verify optimistic update occurred
    expect(queryClient.setQueryData).toHaveBeenCalled();

    // Check that cancelQueries was called
    expect(queryClient.cancelQueries).toHaveBeenCalledWith({
      queryKey: ["hub-notes", 123],
    });

    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check note was added with the correct data
    expect(result.current.data?.data).toEqual({
      id: 999,
      content: "New Test Note",
      hubId: 123,
      updatedAt: "2023-01-02T00:00:00Z",
    });
  });

  it("should register client ID for focus", async () => {
    // Clear the registry before starting
    noteFocusRegistry.clean();

    const wrapper = createQueryClientWrapper(queryClient);

    const { result } = renderHook(() => useAddQuickNote(), { wrapper });

    const newNote = {
      content: "Focus Test Note",
      hubId: 456,
      updatedAt: "2023-01-03T00:00:00Z",
    };

    // Ensure registry is empty at start
    expect(noteFocusRegistry.pendingFocus.size).toBe(0);

    // Execute the mutation
    await act(async () => {
      result.current.mutate(newNote);
      // Wait a bit for the optimistic update to happen
      await new Promise((r) => setTimeout(r, 0));
    });

    // Check that a client ID was registered
    expect(noteFocusRegistry.pendingFocus.size).toBeGreaterThan(0);

    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Since there's no easy way to get the exact clientId in a test,
    // we'll directly check the registry
    const clientId = Array.from(noteFocusRegistry.pendingFocus)[0];
    expect(clientId).toBeDefined();

    if (clientId) {
      // Check focus works correctly
      expect(noteFocusRegistry.shouldFocus(clientId)).toBe(true);
      // Second call should return false since it was consumed
      expect(noteFocusRegistry.shouldFocus(clientId)).toBe(false);
    }
  });

  it("should clean focus registry when cleanFocusRegisterOnAdd is true", async () => {
    const wrapper = createQueryClientWrapper(queryClient);

    // Add a fake pending focus
    const fakeClientId = "fake-client-id";
    noteFocusRegistry.register(fakeClientId);
    expect(noteFocusRegistry.pendingFocus.size).toBe(1);
    expect(noteFocusRegistry.pendingFocus.has(fakeClientId)).toBe(true);

    const { result } = renderHook(
      () => useAddQuickNote({ cleanFocusRegisterOnAdd: true }),
      { wrapper },
    );

    const newNote = {
      content: "Clean Test Note",
      hubId: 789,
      updatedAt: "2023-01-04T00:00:00Z",
    };

    // Execute the mutation
    await act(async () => {
      result.current.mutate(newNote);
      // Wait a bit for the optimistic update to happen
      await new Promise((r) => setTimeout(r, 0));
    });

    // The registry should have been cleaned and then have a new entry
    expect(noteFocusRegistry.pendingFocus.size).toBe(1);
    // The original ID should no longer be in the registry
    expect(noteFocusRegistry.pendingFocus.has(fakeClientId)).toBe(false);

    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
