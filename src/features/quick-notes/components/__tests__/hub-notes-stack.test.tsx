import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";
import { useQuery } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useHubNotes } from "../../hooks/use-hub-notes";

vi.mock("../../lib/quick-notes-query-options", () => ({
  quickNotesHubsQueryOptions: {},
}));

// Mocks
vi.mock("@tanstack/react-query", async (importOriginal) => ({
  ...((await importOriginal()) as any),
  useQuery: vi.fn(),
}));

vi.mock("../../hooks/use-hub-notes", () => ({
  useHubNotes: vi.fn(),
}));

vi.mock("../note-card", () => ({
  NoteCard: ({ note, hubColor }: any) => (
    <div
      data-testid={`note-card-${note.id}`}
      data-hub-color={hubColor || "default"}
    >
      {note.content}
    </div>
  ),
}));

vi.mock("../note-card/skeleton-note-card", () => ({
  SkeletonNoteCard: () => (
    <div data-testid="skeleton-note-card">Loading...</div>
  ),
}));

vi.mock("../add-note-card", () => ({
  AddNoteCard: ({ hubId }: any) => (
    <button type="button" data-testid={`add-note-${hubId}`}>
      Add Note
    </button>
  ),
}));

// Import the component after all mocks are set up
import { HubNotesStack } from "../hub-notes-stack";

describe("HubNotesStack", () => {
  const mockHubId = 123;

  // Mock hub data
  const mockHub = {
    id: mockHubId,
    name: "Test Hub",
    color: "blue",
  };

  // Mock notes
  const mockNotes = [
    { id: 1, content: "Note 1", updatedAt: "2023-01-01", hubId: mockHubId },
    { id: 2, content: "Note 2", updatedAt: "2023-01-02", hubId: mockHubId },
  ];

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock the useQuery hook for hubs data
    (useQuery as any).mockReturnValue({
      data: [mockHub],
      isLoading: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders loading skeleton cards when loading", () => {
    // Mock loading state for notes
    (useHubNotes as any).mockReturnValue({
      data: undefined,
      isLoading: true,
      isPending: true,
    });

    render(<HubNotesStack hubId={mockHubId} />);

    // Should show skeleton cards when loading
    expect(screen.getAllByTestId("skeleton-note-card")).toHaveLength(4);

    // Should show the hub name
    expect(screen.getByText("Test Hub")).toBeInTheDocument();

    // Should show the AddNoteCard
    expect(screen.getByTestId(`add-note-${mockHubId}`)).toBeInTheDocument();
  });

  it("renders notes when data is available", () => {
    // Mock notes data
    (useHubNotes as any).mockReturnValue({
      data: mockNotes,
      isLoading: false,
      isPending: false,
    });

    render(<HubNotesStack hubId={mockHubId} />);

    // Should show the correct number of notes
    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText("Note 2")).toBeInTheDocument();

    // Should show the hub name and note count
    expect(screen.getByText("Test Hub")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument(); // The count badge
  });

  it("renders empty state when there are no notes", () => {
    // Mock empty notes array
    (useHubNotes as any).mockReturnValue({
      data: [],
      isLoading: false,
      isPending: false,
    });

    render(<HubNotesStack hubId={mockHubId} />);

    // Should show empty state
    expect(screen.getByText("No notes in this hub")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first note to get started"),
    ).toBeInTheDocument();
  });

  it("doesn't render if the hub doesn't exist", () => {
    // Mock different hub ID than what's available
    const nonExistentHubId = 999;

    // Mock notes data
    (useHubNotes as any).mockReturnValue({
      data: mockNotes,
      isLoading: false,
      isPending: false,
    });

    const { container } = render(<HubNotesStack hubId={nonExistentHubId} />);

    // Component should not render anything substantial
    expect(container.innerHTML).toBe("");
  });
});
