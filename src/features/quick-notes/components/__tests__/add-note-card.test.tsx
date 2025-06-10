import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAddQuickNote } from "../../hooks/use-add-quick-note";
import { AddNoteCard, COOLDOWN_DURATION } from "../add-note-card";
// Mock the hooks
vi.mock("../../hooks/use-add-quick-note", () => ({
  useAddQuickNote: vi.fn(),
}));

vi.useFakeTimers();

describe("AddNoteCard", () => {
  const mockMutate = vi.fn();
  const hubId = 123;

  beforeEach(() => {
    vi.resetAllMocks();

    (useAddQuickNote as any).mockReturnValue({
      mutate: mockMutate,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders an add note button", () => {
    render(<AddNoteCard hubId={hubId} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("calls addNote mutation when button is clicked", () => {
    render(<AddNoteCard hubId={hubId} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockMutate).toHaveBeenCalledWith({
      hubId,
      content: "",
      updatedAt: expect.any(String),
    });
  });

  it("prevents multiple rapid clicks", () => {
    render(<AddNoteCard hubId={hubId} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);
    expect(mockMutate).toHaveBeenCalledTimes(1);

    mockMutate.mockClear();

    fireEvent.click(button);

    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("disables the button after clicking and enables after cooldown", async () => {
    render(<AddNoteCard hubId={hubId} />);

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(button).toBeDisabled();

    await act(async () => {
      vi.advanceTimersByTime(COOLDOWN_DURATION);
    });

    expect(button).toBeEnabled();
  });
});
