import { useQuery } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";

import { useHubNotes } from "../../hooks/use-hub-notes";
import { HubNotesStack } from "../hub-notes-stack";

// Mock TanStack Query
vi.mock("@tanstack/react-query", async (importOriginal) => ({
  ...((await importOriginal()) as any),
  useQuery: vi.fn(),
}));

// Mock hooks
vi.mock("../../hooks/use-hub-notes");

// Mock components
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

vi.mock("../note-card-list", () => ({
  NoteCardList: ({ hubId, hubColor }: any) => (
    <div data-testid={`note-card-list-${hubId}`} data-hub-color={hubColor}>
      Note Card List
    </div>
  ),
}));

describe("HubNotesStack", () => {
  const mockHubId = 123;
  const mockHub = {
    id: mockHubId,
    name: "Test Hub",
    color: "blue",
  };
  const mockNotes = [
    { id: 1, content: "Note 1", updatedAt: "2023-01-01", hubId: mockHubId },
    { id: 2, content: "Note 2", updatedAt: "2023-01-02", hubId: mockHubId },
  ];

  const mockUseQuery = useQuery as any;
  const mockUseHubNotes = useHubNotes as any;

  beforeEach(() => {
    vi.resetAllMocks();

    // Default mock for hubs query
    mockUseQuery.mockReturnValue({
      data: [mockHub],
      isLoading: false,
    });

    // Default mock for notes query
    mockUseHubNotes.mockReturnValue({
      data: mockNotes,
      isLoading: false,
      isPending: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("renders hub header with name and note count", () => {
    render(<HubNotesStack hubId={mockHubId} />);

    expect(screen.getByText("Test Hub")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByTestId(`add-note-${mockHubId}`)).toBeInTheDocument();
  });

  it("renders note card list with correct props", () => {
    render(<HubNotesStack hubId={mockHubId} />);

    const noteCardList = screen.getByTestId(`note-card-list-${mockHubId}`);
    expect(noteCardList).toBeInTheDocument();
    expect(noteCardList).toHaveAttribute("data-hub-color", "blue");
  });

  it("shows zero count when no notes", () => {
    mockUseHubNotes.mockReturnValue({
      data: [],
      isLoading: false,
      isPending: false,
    });

    render(<HubNotesStack hubId={mockHubId} />);

    expect(screen.getByText("Test Hub")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("shows zero count when notes data is undefined", () => {
    mockUseHubNotes.mockReturnValue({
      data: undefined,
      isLoading: false,
      isPending: false,
    });

    render(<HubNotesStack hubId={mockHubId} />);

    expect(screen.getByText("Test Hub")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("doesn't render when hub doesn't exist", () => {
    const nonExistentHubId = 999;

    const { container } = render(<HubNotesStack hubId={nonExistentHubId} />);

    expect(container.innerHTML).toBe("");
  });
});
