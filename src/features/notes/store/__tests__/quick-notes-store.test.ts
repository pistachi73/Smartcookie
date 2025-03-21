import { act } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type {
  InitialQuickNotesStateData,
  QuickNotesStore,
} from "../../types/quick-notes-store.types";
import {
  createQuickNotesStore,
  initQuickNotesStore,
} from "../quick-notes-store";

const mockInitialState = {
  hubIds: [1, 2, 3],
  visibleHubs: [1, 2],
};

describe("Quick Notes Store", () => {
  let store: ReturnType<typeof createQuickNotesStore>;
  let state: QuickNotesStore;

  beforeEach(() => {
    // Initialize with some test data before each test
    const initialState = initQuickNotesStore(
      mockInitialState as InitialQuickNotesStateData,
    );
    store = createQuickNotesStore(initialState);
    state = store.getState();
  });

  describe("Initial State", () => {
    it("should initialize with the correct state", () => {
      expect(state.hubIds).toEqual(mockInitialState.hubIds);
      expect(state.visibleHubs).toEqual(new Set(mockInitialState.visibleHubs));
      expect(state.isHydrated).toBe(false);
      expect(state.edittingHub).toBe(null);
      expect(state.isFilterPanelOpen).toBe(false);
    });
  });

  describe("setHydrated", () => {
    it("should set isHydrated to true", () => {
      // Initialize state
      store.setState({
        ...store.getState(),
        isHydrated: false,
      });

      act(() => {
        store.getState().setHydrated();
      });

      expect(store.getState().isHydrated).toBe(true);
    });
  });

  describe("toggleHubVisibility", () => {
    beforeEach(() => {
      store.setState({
        ...store.getState(),
        visibleHubs: new Set(mockInitialState.visibleHubs),
      });
    });

    it("should add hub to visibleHubs if not present", () => {
      act(() => {
        state.toggleHubVisibility(3);
      });

      expect(store.getState().visibleHubs).toEqual(
        new Set([...mockInitialState.visibleHubs, 3]),
      );
    });

    it("should remove hub from visibleHubs if already present", () => {
      act(() => {
        state.toggleHubVisibility(mockInitialState.visibleHubs[0]!);
      });

      const remainingHubs = mockInitialState.visibleHubs.slice(1);

      expect(store.getState().visibleHubs).toEqual(new Set(remainingHubs));
    });
  });

  describe("toggleAllHubsVisibility", () => {
    it("should add all hubs to visibleHubs if not all present", () => {
      act(() => {
        state.toggleAllHubsVisibility();
      });

      expect(store.getState().visibleHubs).toEqual(
        new Set(mockInitialState.hubIds),
      );
    });

    it("should clear visibleHubs if all hubs are already visible", () => {
      // First, make all hubs visible
      store.setState({
        ...store.getState(),
        visibleHubs: new Set([1, 2, 3]),
      });

      // Then, toggle again to clear
      act(() => {
        store.getState().toggleAllHubsVisibility();
      });

      expect(store.getState().visibleHubs).toEqual(new Set([]));
    });
  });

  describe("setEdittingHub", () => {
    it("should set edittingHub to the provided id", () => {
      act(() => {
        state.setEdittingHub(2);
      });

      expect(store.getState().edittingHub).toBe(2);
    });

    it("should set edittingHub to null when null is provided", () => {
      store.setState({
        ...store.getState(),
        edittingHub: 2,
      });

      act(() => {
        state.setEdittingHub(null);
      });

      expect(store.getState().edittingHub).toBe(null);
    });
  });
});
