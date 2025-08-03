import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";

import { noteFocusRegistry } from "../../hooks/use-add-quick-note";
import { useDeleteQuickNote } from "../../hooks/use-delete-quick-note";
import { useUpdateQuickNote } from "../../hooks/use-update-quick-note";
import { useQuickNotesStore } from "../../store/quick-notes-store-provider";
import { NoteCard } from "../note-card";

// Mock the hooks
vi.mock("../../hooks/use-update-quick-note", () => ({
  useUpdateQuickNote: vi.fn(),
}));

vi.mock("../../hooks/use-delete-quick-note", () => ({
  useDeleteQuickNote: vi.fn(),
}));

vi.mock("../../store/quick-notes-store-provider", () => ({
  useQuickNotesStore: vi.fn(),
}));

vi.mock("../../hooks/use-add-quick-note", () => ({
  noteFocusRegistry: {
    shouldFocus: vi.fn(),
  },
}));

describe("NoteCard", () => {
  const mockHandleContentChange = vi.fn();
  const mockHandleDeletePress = vi.fn();
  const mockHandleDeleteRelease = vi.fn();
  const mockSetEdittingHub = vi.fn();

  const mockNote = {
    id: 1,
    content: "Test note content",
    updatedAt: "2023-01-01T00:00:00.000Z",
    hubId: 123,
    clientId: "test-client-id",
  };

  beforeEach(() => {
    vi.resetAllMocks();

    (useUpdateQuickNote as any).mockReturnValue({
      content: mockNote.content,
      isUnsaved: false,
      isSaving: false,
      handleContentChange: mockHandleContentChange,
    });

    (useDeleteQuickNote as any).mockReturnValue({
      isDeleting: false,
      deleteProgress: 0,
      handleDeletePress: mockHandleDeletePress,
      handleDeleteRelease: mockHandleDeleteRelease,
    });

    (useQuickNotesStore as any).mockReturnValue({
      edittingHub: null,
      setEdittingHub: mockSetEdittingHub,
    });

    (noteFocusRegistry.shouldFocus as any).mockReturnValue(false);
  });

  afterEach(() => {
    cleanup(); // Clean up after each test
  });

  it("renders the note content", () => {
    render(<NoteCard note={mockNote} hubColor={"banana"} />);
    expect(screen.getByText(mockNote.content)).toBeInTheDocument();
  });

  it("shows saving state when isSaving is true", () => {
    (useUpdateQuickNote as any).mockReturnValue({
      content: mockNote.content,
      isUnsaved: false,
      isSaving: true,
      handleContentChange: mockHandleContentChange,
    });

    render(<NoteCard note={mockNote} hubColor={"banana"} />);
    expect(screen.getByText("Saving...")).toBeInTheDocument();
  });

  it("shows unsaved state when isUnsaved is true and not saving", () => {
    (useUpdateQuickNote as any).mockReturnValue({
      content: mockNote.content,
      isUnsaved: true,
      isSaving: false,
      handleContentChange: mockHandleContentChange,
    });

    render(<NoteCard note={mockNote} hubColor={"banana"} />);
    expect(screen.getByText("Unsaved")).toBeInTheDocument();
  });

  it("calls handleContentChange when content changes", () => {
    render(<NoteCard note={mockNote} hubColor={"banana"} />);

    // Use container query to get the specific textarea in this test
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "New content" } });

    expect(mockHandleContentChange).toHaveBeenCalledWith("New content");
  });

  it("calls press handlers when delete button is pressed", async () => {
    render(<NoteCard note={mockNote} hubColor={"banana"} />);

    const deleteButton = screen.getByRole("button", { name: "Delete note" });

    fireEvent.mouseDown(deleteButton);
    expect(mockHandleDeletePress).toHaveBeenCalled();

    fireEvent.mouseLeave(deleteButton);
    expect(mockHandleDeleteRelease).toHaveBeenCalled();
  });

  it("shows delete progress when isDeleting is true", () => {
    (useDeleteQuickNote as any).mockReturnValue({
      isDeleting: true,
      deleteProgress: 50,
      handleDeletePress: mockHandleDeletePress,
      handleDeleteRelease: mockHandleDeleteRelease,
    });

    render(<NoteCard note={mockNote} hubColor={"banana"} />);

    const progressCircle = screen.getByRole("progressbar");
    expect(progressCircle).toHaveAttribute("aria-valuenow", "50");
  });
});
