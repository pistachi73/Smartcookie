import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";

import { HubNotesStack } from "../hub-notes-stack";

// Mock TanStack Query
vi.mock("@tanstack/react-query", async (importOriginal) => ({
  ...((await importOriginal()) as any),
  useQuery: vi.fn(),
  useSuspenseQuery: vi.fn(),
}));

// Mock query options
vi.mock("../../lib/quick-notes-query-options", () => ({
  quickNotesHubsQueryOptions: vi.fn(() => ({
    queryKey: ["quick-notes-hubs"],
    queryFn: vi.fn(),
  })),
  quickNotesByHubIdQueryOptions: vi.fn((hubId: number) => ({
    queryKey: ["hub-notes", hubId],
    queryFn: vi.fn(),
  })),
}));

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

vi.mock("../note-card-list", () => ({
  NoteCardList: ({ hubId, hubColor }: any) => (
    <div data-testid={`note-card-list-${hubId}`} data-hub-color={hubColor}>
      Note Card List
    </div>
  ),
}));

// Mock the new-quick-note-button component
vi.mock("../new-quick-note-button", () => ({
  NewQuickNoteButton: (props: any) => <div {...props}>Add Note Button</div>,
}));

// Mock authentication and plan limits hooks
vi.mock("@/shared/hooks/use-current-user", () => ({
  useCurrentUser: vi.fn().mockReturnValue({
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
  }),
}));

vi.mock("@/shared/hooks/plan-limits/use-notes-limits", () => ({
  useNotesLimits: vi.fn(() => ({
    max: 10,
    current: 5,
    remaining: 5,
    isAtLimit: false,
    canCreate: true,
    isUnlimited: false,
    maxCharacters: 1000,
    isLoading: false,
    error: null,
  })),
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
  const mockUseSuspenseQuery = useSuspenseQuery as any;

  beforeEach(() => {
    vi.resetAllMocks();

    // Default mock for hubs query (useSuspenseQuery)
    mockUseSuspenseQuery.mockReturnValue({
      data: [mockHub],
    });

    // Default mock for notes query (useQuery)
    mockUseQuery.mockReturnValue({
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
    expect(screen.getByText("2 notes")).toBeInTheDocument();
    expect(screen.getByTestId(`add-note-${mockHubId}`)).toBeInTheDocument();
  });

  it("renders note card list with correct props", () => {
    render(<HubNotesStack hubId={mockHubId} />);

    const noteCardList = screen.getByTestId(`note-card-list-${mockHubId}`);
    expect(noteCardList).toBeInTheDocument();
    expect(noteCardList).toHaveAttribute("data-hub-color", "blue");
  });

  it("shows zero count when no notes", () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false,
      isPending: false,
    });

    render(<HubNotesStack hubId={mockHubId} />);

    expect(screen.getByText("Test Hub")).toBeInTheDocument();
    expect(screen.getByText("0 notes")).toBeInTheDocument();
  });

  it("shows zero count when notes data is undefined", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isPending: false,
    });

    render(<HubNotesStack hubId={mockHubId} />);

    expect(screen.getByText("Test Hub")).toBeInTheDocument();
    expect(screen.getByText("0 notes")).toBeInTheDocument();
  });

  it("doesn't render when hub doesn't exist", () => {
    const nonExistentHubId = 999;

    // Mock with empty hubs array
    mockUseSuspenseQuery.mockReturnValue({
      data: [],
    });

    const { container } = render(<HubNotesStack hubId={nonExistentHubId} />);

    expect(container.innerHTML).toBe("");
  });
});
