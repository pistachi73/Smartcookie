import type { Mock } from "vitest";

/**
 * Type for the store mock controller
 */
export interface ZustandStoreMockController<TState> {
  /**
   * Sets up the mock implementation with the provided state
   * @param state - Partial state to merge with the initial state
   */
  setState: (state?: Partial<TState>) => Mock;

  /**
   * Resets the mock implementation to use the initial state
   */
  resetState: () => Mock;

  /**
   * Clears all mock implementations
   */
  clear: () => Mock;
}

/**
 * Creates a mock controller for a Zustand store hook.
 *
 * IMPORTANT: This function expects that you've already mocked the module with vi.mock.
 *
 * @example
 * ```
 * // At the top of your test file (important for hoisting)
 * vi.mock("@/features/notes/store/quick-notes-store-provider");
 *
 * import { useQuickNotesStore } from "@/features/notes/store/quick-notes-store-provider";
 *
 * // In your test setup
 * const mockStore = mockZustandStoreImplementation({
 *   useQuickNotesStore,
 *   initialState: { visibleHubs: new Set([1, 2, 3]) }
 * });
 * ```
 *
 * @param options - Configuration options
 * @param options.hook - The mocked hook function
 * @param options.initialState - Initial state to use for the mock
 * @returns A controller object for manipulating the mock
 */
export function mockZustandStoreImplementation<TState extends object>({
  hook,
  initialState = {} as Partial<TState>,
}: {
  hook: (selector: (store: TState) => any) => any;
  initialState?: Partial<TState>;
}): ZustandStoreMockController<TState> {
  // Use type assertion to treat the hook as a mock
  const mockedHook = hook as unknown as Mock;

  // Keep track of the current state
  let currentState = { ...initialState } as Partial<TState>;

  // Set up initial state
  const resetState = () => {
    currentState = { ...initialState };
    mockedHook.mockImplementation((selector: (state: TState) => any) =>
      selector(currentState as TState),
    );
    return mockedHook;
  };

  // Initialize with initial state
  resetState();

  return {
    /**
     * Updates the mock implementation with new state values
     */
    setState: (state: Partial<TState> = {}) => {
      // Update the current state by merging
      currentState = { ...currentState, ...state };

      mockedHook.mockImplementation((selector: (state: TState) => any) =>
        selector(currentState as TState),
      );
      return mockedHook;
    },

    /**
     * Resets to the initial state provided during creation
     */
    resetState,

    /**
     * Clears all mock implementations
     */
    clear: () => {
      mockedHook.mockReset();
      currentState = { ...initialState };
      return mockedHook;
    },
  };
}

/**
 * Example usage:
 *
 * ```ts
 * // At the top of your test file (important for hoisting)
 * vi.mock("@/features/notes/store/quick-notes-store-provider");
 *
 * import { mockZustandStoreImplementation } from "@/shared/lib/testing";
 * import { useQuickNotesStore } from "@/features/notes/store/quick-notes-store-provider";
 * import type { QuickNotesStore } from "@/features/notes/types/quick-notes-store.types";
 *
 * describe("Component using QuickNotesStore", () => {
 *   const mockStore = mockZustandStoreImplementation<QuickNotesStore>({
 *     hook: useQuickNotesStore,
 *     initialState: {
 *       visibleHubs: new Set([1, 2, 3])
 *     }
 *   });
 *
 *   beforeEach(() => {
 *     vi.resetAllMocks();
 *     mockStore.resetState();
 *   });
 *
 *   it("test with different state", () => {
 *     mockStore.setState({
 *       visibleHubs: new Set([4, 5])
 *     });
 *
 *     render(<YourComponent />);
 *     // assertions...
 *   });
 * });
 * ```
 */

/**
 * Advanced Usage - Creating Typed Mock Factories:
 *
 * You can create a dedicated module for your store mocks:
 *
 * src/features/notes/testing/notes-store-mocks.ts:
 * ```ts
 * import { mockZustandStoreImplementation } from "@/shared/lib/testing";
 * import { useQuickNotesStore } from "@/features/notes/store/quick-notes-store-provider";
 * import type { QuickNotesStore } from "@/features/notes/types/quick-notes-store.types";
 *
 * export function mockQuickNotesStore(initialState: Partial<QuickNotesStore> = {}) {
 *   return mockZustandStoreImplementation<QuickNotesStore>({
 *     hook: useQuickNotesStore,
 *     initialState: {
 *       visibleHubs: new Set(),
 *       hubIds: [],
 *       isHydrated: true,
 *       ...initialState
 *     }
 *   });
 * }
 * ```
 *
 * Then in your tests:
 * ```ts
 * // Top of file - IMPORTANT for hoisting
 * vi.mock("@/features/notes/store/quick-notes-store-provider");
 *
 * import { mockQuickNotesStore } from "@/features/notes/testing/notes-store-mocks";
 *
 * describe("YourComponent", () => {
 *   const quickNotesMock = mockQuickNotesStore({
 *     visibleHubs: new Set([1, 2, 3])
 *   });
 *
 *   beforeEach(() => {
 *     vi.resetAllMocks();
 *     quickNotesMock.resetState();
 *   });
 *
 *   // Tests...
 * });
 */
