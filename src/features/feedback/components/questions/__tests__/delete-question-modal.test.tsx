import { mockNextNavigation } from "@/shared/lib/testing/navigation-mocks";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDeleteQuestion } from "../../../hooks/questions/use-delete-question";
import { DeleteQuestionModal } from "../delete-question-modal";

mockNextNavigation();

vi.mock("../../../hooks/questions/use-delete-question", () => ({
  useDeleteQuestion: vi.fn(),
}));

vi.mock("../question-type-badge", () => ({
  QuestionTypeBadge: ({ type }: { type: string }) => (
    <span data-testid="question-type-badge">{type}</span>
  ),
}));

const mockQuestion = {
  id: 1,
  title: "How would you rate our service?",
  description: "Please provide your honest feedback",
  type: "rating" as const,
};

const mockOnOpenChange = vi.fn();

const defaultProps = {
  isOpen: true,
  onOpenChange: mockOnOpenChange,
  question: mockQuestion,
};

describe("DeleteQuestionModal", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDeleteQuestion).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders modal when open", () => {
    render(<DeleteQuestionModal {...defaultProps} />);

    expect(screen.getByText("Delete Question")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to delete this question? This action cannot be undone.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the expected content", () => {
    render(<DeleteQuestionModal {...defaultProps} />);

    expect(
      screen.getByText("How would you rate our service?"),
    ).toBeInTheDocument();
    const typeBadge = screen.getByTestId("question-type-badge");
    expect(typeBadge).toBeInTheDocument();

    expect(typeBadge).toHaveTextContent("rating");

    expect(screen.getByText("Important:")).toBeInTheDocument();
    expect(
      screen.getByText(/This question will also be deleted from any pending/),
    ).toBeInTheDocument();
  });

  describe("User Interactions", () => {
    it("calls onOpenChange when cancel button is clicked", () => {
      render(<DeleteQuestionModal {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("calls deleteQuestion when delete button is clicked", () => {
      render(<DeleteQuestionModal {...defaultProps} />);

      const deleteButton = screen.getByRole("button", { name: /^delete$/i });
      fireEvent.click(deleteButton);

      expect(mockMutate).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe("Loading States", () => {
    beforeEach(() => {
      vi.mocked(useDeleteQuestion).mockReturnValue({
        mutate: mockMutate,
        isPending: true,
      } as any);
    });

    it("shows loading state when deleting", () => {
      render(<DeleteQuestionModal {...defaultProps} />);
      const cancelButton = screen.getByRole("button", { name: /cancel/i });

      const deleteButton = screen.getByRole("button", { name: /deleting/i });
      expect(screen.getByText("Deleting...")).toBeInTheDocument();
      expect(screen.getByLabelText("Deleting question...")).toBeInTheDocument();
      expect(cancelButton).toBeDisabled();
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveAttribute("aria-disabled", "true");
    });

    it("shows pending state on delete button when deleting", () => {
      render(<DeleteQuestionModal {...defaultProps} />);
    });
  });

  describe("Success Handling", () => {
    it("closes modal on successful deletion", async () => {
      // Variable to capture the actual onSuccess callback passed to the hook
      let onSuccessCallback: (() => void) | undefined;

      // Mock the hook implementation to intercept the options passed to it
      vi.mocked(useDeleteQuestion).mockImplementation((options: any) => {
        // Capture the onSuccess callback from the component
        onSuccessCallback = options.onSuccess;
        return {
          // Mock mutate to immediately trigger the success callback when called
          mutate: vi.fn().mockImplementation(() => {
            onSuccessCallback?.();
          }),
          isPending: false,
        } as any;
      });

      render(<DeleteQuestionModal {...defaultProps} />);

      const deleteButton = screen.getByRole("button", { name: /^delete$/i });
      // When delete button is clicked → mutate is called → onSuccessCallback executes → modal closes
      fireEvent.click(deleteButton);

      // Verify that the component's onSuccess callback triggered modal close
      await waitFor(() => {
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });
});
