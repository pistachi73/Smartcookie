import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";

import { useQuickNotesStore } from "@/features/quick-notes/store/quick-notes-store-provider";
import type { QuickNotesStore } from "@/features/quick-notes/types/quick-notes-store.types";
import { HubStackList } from "../hub-stack-list";

// Mock empty state component
vi.mock("../empty-state", () => ({
  QuickNotesEmptyState: () => (
    <div data-testid="empty-state">No hubs to display</div>
  ),
}));

// Mock hub notes stack component
vi.mock("../hub-notes-stack", () => ({
  HubNotesStack: ({ hubId }: { hubId: number }) => (
    <div data-testid={`hub-notes-stack-${hubId}`}>Hub Notes Stack {hubId}</div>
  ),
}));

// Mock the zustand store
vi.mock("@/features/quick-notes/store/quick-notes-store-provider");

describe("HubStackList", () => {
  const mockStore = mockZustandStoreImplementation<QuickNotesStore>({
    hook: useQuickNotesStore,
    initialState: {
      visibleHubs: [1, 2, 3],
    },
  });

  beforeEach(() => {
    vi.resetAllMocks();
    mockStore.resetState();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders EmptyState when there are no visible hubs", () => {
    mockStore.setState({
      visibleHubs: [],
    });

    render(<HubStackList />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renders HubNotesStack components for each visible hub", () => {
    render(<HubStackList />);

    // Should render a HubNotesStack for each visible hub
    [1, 2, 3].forEach((hubId) => {
      expect(
        screen.getByTestId(`hub-notes-stack-${hubId}`),
      ).toBeInTheDocument();
    });
  });
});
