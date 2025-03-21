import { useQuickNotesStore } from "@/features/notes/store/quick-notes-store-provider";
import type { QuickNotesStore } from "@/features/notes/types/quick-notes-store.types";
import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HubStackList } from "../hub-stack-list";

// Mock empty state component
vi.mock("../empty-state", () => ({
  EmptyState: () => <div data-testid="empty-state">No hubs to display</div>,
}));

// Mock hub notes stack component
vi.mock("../hub-notes-stack", () => ({
  HubNotesStack: ({ hubId }: { hubId: number }) => (
    <div data-testid={`hub-notes-stack-${hubId}`}>Hub Notes Stack {hubId}</div>
  ),
}));

// Mock the zustand store
vi.mock("@/features/notes/store/quick-notes-store-provider", () => ({
  useQuickNotesStore: vi.fn(),
}));

describe("HubStackList", () => {
  const mockVisibleHubs = new Set([1, 2, 3]);
  beforeEach(() => {
    vi.resetAllMocks();

    // Default implementation - return empty visibleHubs
    (useQuickNotesStore as any).mockImplementation(
      (selector: (state: QuickNotesStore) => any) =>
        selector({
          visibleHubs: mockVisibleHubs,
        } as QuickNotesStore),
    );
  });

  afterEach(() => {
    cleanup();
  });

  it("renders EmptyState when there are no visible hubs", () => {
    (useQuickNotesStore as any).mockImplementation(
      (selector: (state: QuickNotesStore) => any) =>
        selector({
          visibleHubs: new Set(),
        } as QuickNotesStore),
    );

    render(<HubStackList />);
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("renders HubNotesStack components for each visible hub", () => {
    render(<HubStackList />);

    // Should render a HubNotesStack for each visible hub
    mockVisibleHubs.forEach((hubId) => {
      expect(
        screen.getByTestId(`hub-notes-stack-${hubId}`),
      ).toBeInTheDocument();
    });
  });
});
