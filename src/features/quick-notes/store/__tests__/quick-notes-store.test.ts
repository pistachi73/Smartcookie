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
      expect(state.visibleHubs).toEqual(mockInitialState.visibleHubs);
      expect(state.edittingHub).toBe(null);
      expect(state.isFilterPanelOpen).toBe(false);
    });
  });

  describe("toggleHubVisibility", () => {
    beforeEach(() => {
      store.setState({
        ...store.getState(),
        visibleHubs: mockInitialState.visibleHubs,
      });
    });

    it("should add hub to visibleHubs if not present", () => {
      act(() => {
        state.toggleHubVisibility(3);
      });

      expect(store.getState().visibleHubs).toEqual([
        ...mockInitialState.visibleHubs,
        3,
      ]);
    });

    it("should remove hub from visibleHubs if already present", () => {
      act(() => {
        state.toggleHubVisibility(mockInitialState.visibleHubs[0]!);
      });

      const remainingHubs = mockInitialState.visibleHubs.slice(1);

      expect(store.getState().visibleHubs).toEqual(remainingHubs);
    });
  });

  describe("toggleAllHubsVisibility", () => {
    beforeEach(() => {
      store.setState({
        ...store.getState(),
        visibleHubs: [1, 2],
      });
    });

    it("should add all provided hubs to visibleHubs if not all are present", () => {
      act(() => {
        state.toggleAllHubsVisibility([1, 2, 3, 4]);
      });

      // Since 1 and 2 are already visible but 3 and 4 are not, all should be added
      expect(store.getState().visibleHubs).toEqual([1, 2, 3, 4]);
    });

    it("should remove all provided hubs from visibleHubs if all are present", () => {
      // Set up state where all target hubs are visible
      store.setState({
        ...store.getState(),
        visibleHubs: [1, 2, 3],
      });

      act(() => {
        state.toggleAllHubsVisibility([1, 2, 3]);
      });

      expect(store.getState().visibleHubs).toEqual([]);
    });

    it("should add missing hubs when only some are visible", () => {
      // 1 and 2 are visible, but we want to toggle [1, 2, 3]
      act(() => {
        state.toggleAllHubsVisibility([1, 2, 3]);
      });

      // Since not all (1, 2, 3) were visible, all should be made visible
      expect(store.getState().visibleHubs).toEqual([1, 2, 3]);
    });

    it("should handle empty array gracefully", () => {
      const initialVisible = [1, 2];
      store.setState({
        ...store.getState(),
        visibleHubs: initialVisible,
      });

      act(() => {
        state.toggleAllHubsVisibility([]);
      });

      // Should not change anything
      expect(store.getState().visibleHubs).toEqual(initialVisible);
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
