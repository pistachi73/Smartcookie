import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import setMockViewport from "@/shared/components/layout/viewport-context/test-utils/setMockViewport";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";

import { useAddQuickNote } from "../../hooks/use-add-quick-note";
import { QuickNotesMenu } from "../quick-notes-menu";

// Mock browser APIs
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Other mocks
vi.mock("sonner", async (importOriginal) => ({
  ...(await importOriginal()),
  toast: {
    promise: vi.fn().mockImplementation((promise) => promise),
  },
}));

vi.mock("@/shared/hooks/use-media-query", () => ({
  useMediaQuery: vi.fn().mockReturnValue(false),
}));

vi.mock("react-aria-components", async (importOriginal) => ({
  ...((await importOriginal()) as any),
  useSlottedContext: vi.fn(),
}));

vi.mock("../../hooks/use-add-quick-note", () => ({
  useAddQuickNote: vi.fn(),
}));

vi.mock("@tanstack/react-query", async (importOriginal) => ({
  ...((await importOriginal()) as any),
  useQuery: vi.fn(),
}));

vi.mock("../../lib/quick-notes-query-options", () => ({
  quickNotesHubsQueryOptions: {},
}));

// Mock next navigation
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}));

const openPopover = () => {
  const toggleButton = screen.getByRole("button");
  fireEvent.click(toggleButton);
};

const selectHub = (hubName: string) => {
  const hubButton = screen.getByRole("button", { name: hubName });
  fireEvent.click(hubButton);
};

const typeNote = (note: string) => {
  const textarea = screen.getByRole("textbox");
  fireEvent.change(textarea, { target: { value: note } });
};

const saveNote = () => {
  const saveButton = screen.getByRole("button", { name: "Save note" });
  fireEvent.click(saveButton);
};

describe("QuickNotesMenu", () => {
  const mockMutateAsync = vi.fn();
  const mockHubs = [
    { id: 1, name: "Personal", color: "blue" },
    { id: 2, name: "Work", color: "green" },
  ] as const;

  beforeEach(() => {
    setMockViewport("xl");

    // Mock the useQuery hook for hubs data
    (useQuery as any).mockReturnValue({
      data: mockHubs,
      isLoading: false,
    });

    (useAddQuickNote as any).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("shows a popover when button is clicked", () => {
    render(<QuickNotesMenu />);

    openPopover();

    expect(
      screen.getByRole("heading", { name: "Add Quick Notes" }),
    ).toBeInTheDocument();
  });

  it("should render view all notes button", () => {
    render(<QuickNotesMenu />);

    openPopover();

    const viewAllNotesLink = screen.getByRole("link", {
      name: "View all notes",
    });

    expect(viewAllNotesLink).toBeInTheDocument();
    expect(viewAllNotesLink).toHaveAttribute("href", "/portal/quick-notes");
  });

  it("displays hub options when popover is open", () => {
    render(<QuickNotesMenu />);

    openPopover();

    mockHubs.forEach((hub) => {
      expect(screen.getByText(hub.name)).toBeInTheDocument();
    });
  });

  it("shows loading state when hubs are loading", () => {
    // Change the mock to return loading state
    (useQuery as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    render(<QuickNotesMenu />);

    openPopover();

    const skeletons = screen.getAllByTestId("hub-skeleton");
    expect(skeletons.length).toEqual(5);
  });

  it("allows selecting a hub and moving to note creation state", () => {
    render(<QuickNotesMenu />);

    openPopover();

    const hubButton = screen.getByRole("button", { name: mockHubs[0].name });
    fireEvent.click(hubButton);
    // Now we're in note creation mode, check for textarea
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: `Add note to ${mockHubs[0].name}`,
      }),
    ).toBeInTheDocument();
  });

  it("should go back to hub selection when back button is clicked", () => {
    render(<QuickNotesMenu />);

    openPopover();

    const hubButton = screen.getByRole("button", { name: mockHubs[0].name });
    fireEvent.click(hubButton);

    const backButton = screen.getByLabelText("Back to hub selection");
    fireEvent.click(backButton);

    expect(
      screen.getByRole("heading", { name: "Add Quick Notes" }),
    ).toBeInTheDocument();
  });

  it("should save note when save button is clicked", async () => {
    // Setup successful response
    mockMutateAsync.mockResolvedValueOnce({ id: "note1" });

    render(<QuickNotesMenu />);

    openPopover();
    selectHub(mockHubs[0].name);
    typeNote("Test note");
    saveNote();

    expect(mockMutateAsync).toHaveBeenCalledWith({
      content: "Test note",
      hubId: mockHubs[0].id,
      updatedAt: expect.any(String),
    });

    expect(toast.promise).toHaveBeenCalledWith(
      expect.any(Promise),
      expect.objectContaining({
        loading: "Adding note...",
        success: expect.any(Function),
        error: "Failed to add note",
        duration: 3000,
      }),
    );
  });

  it("should not save note when content is empty", () => {
    // Clear any previous mock calls
    mockMutateAsync.mockClear();

    render(<QuickNotesMenu />);

    openPopover();
    selectHub(mockHubs[0].name);
    saveNote();

    expect(mockMutateAsync).not.toHaveBeenCalled();

    // The form should still be in note entry state since saving didn't occur
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: `Add note to ${mockHubs[0].name}`,
      }),
    ).toBeInTheDocument();
  });

  it("should reset form state after saving a note", () => {
    mockMutateAsync.mockResolvedValueOnce({ id: "note1" });
    render(<QuickNotesMenu />);

    openPopover();
    selectHub(mockHubs[0].name);
    typeNote("Test note");
    saveNote();

    // After saving, we should be back at the hub selection screen
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: `Add note to ${mockHubs[0].name}`,
      }),
    ).not.toBeInTheDocument();
  });
});
