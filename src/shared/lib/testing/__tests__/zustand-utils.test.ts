import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockZustandStoreImplementation } from "../zustand-utils";

// Define a fake store type for testing
interface TestStore {
  count: number;
  user: { id: number; name: string } | null;
  isLoading: boolean;
  increment: () => void;
  decrement: () => void;
}

// Mock the test hook
const mockTestHook = vi.fn();

describe("mockZustandStoreImplementation", () => {
  const initialState: Partial<TestStore> = {
    count: 0,
    user: null,
    isLoading: false,
  };

  const mockStore = mockZustandStoreImplementation<TestStore>({
    hook: mockTestHook,
    initialState,
  });

  beforeEach(() => {
    vi.resetAllMocks();
    mockStore.resetState();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("returns the initial state", () => {
    // Call with a selector that returns the count
    const result = mockTestHook((state: TestStore) => state.count);
    expect(result).toBe(0);
  });

  it("allows setting a new state", () => {
    mockStore.setState({ count: 10 });

    // Call with a selector that returns the count
    const result = mockTestHook((state: TestStore) => state.count);
    expect(result).toBe(10);
  });

  it("merges the new state with the existing state", () => {
    mockStore.setState({ count: 5 });
    mockStore.setState({ user: { id: 1, name: "Test User" } });

    // Call with a selector that returns the user
    const user = mockTestHook((state: TestStore) => state.user);
    expect(user).toEqual({ id: 1, name: "Test User" });

    // Call with a selector that returns the count
    const count = mockTestHook((state: TestStore) => state.count);
    expect(count).toBe(5);
  });

  it("can be reset to the initial state", () => {
    mockStore.setState({ count: 100, isLoading: true });
    mockStore.resetState();

    // Call with a selector that returns the full state
    const state = mockTestHook((state: TestStore) => state);
    expect(state).toEqual(initialState);
  });

  it("selects only the requested properties", () => {
    mockStore.setState({
      count: 42,
      user: { id: 123, name: "Alice" },
      isLoading: true,
    });

    // Call with a selector that returns just the user's name
    const userName = mockTestHook((state: TestStore) => state.user?.name);
    expect(userName).toBe("Alice");

    // Call with a selector that returns a derived value
    const countPlusOne = mockTestHook((state: TestStore) => state.count + 1);
    expect(countPlusOne).toBe(43);
  });
});
