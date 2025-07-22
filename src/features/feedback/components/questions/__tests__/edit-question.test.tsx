import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";

import { useUpdateQuestion } from "../../../hooks/questions/use-update-question";
import { EditQuestion } from "../edit-question";

vi.mock("@/shared/hooks/use-navigate-with-params");

vi.mock("../../../hooks/questions/use-update-question", () => ({
  useUpdateQuestion: vi.fn(),
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

const mockQuestion = {
  id: 1,
  title: "How would you rate our service?",
  description: "Please provide your honest feedback",
  type: "rating" as const,
  enableAdditionalComment: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("EditQuestion", () => {
  const mockPush = vi.fn();
  const mockMutate = vi.fn();
  const questionId = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);

    vi.mocked(useUpdateQuestion).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  it("renders loading state when question is loading", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as any);

    render(<EditQuestion questionId={questionId} />);

    expect(
      screen.getByText("Loading question...", { selector: "p" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders not found state when question doesn't exist", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: null,
      isLoading: false,
    } as any);

    render(<EditQuestion questionId={questionId} />);

    expect(screen.getByText("Question not found")).toBeInTheDocument();
    expect(
      screen.getByText("This question seems to have vanished into thin air!"),
    ).toBeInTheDocument();
  });

  it("renders edit question form when question is loaded", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockQuestion,
      isLoading: false,
    } as any);

    render(<EditQuestion questionId={questionId} />);

    expect(
      screen.getByRole("heading", { name: /edit question/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Update your question details. Note that the question type cannot be changed.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back/i })).toBeInTheDocument();

    // Check for form elements
    expect(screen.getByLabelText(/question title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/question type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/allow additional comments/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /update question/i }),
    ).toBeInTheDocument();
  });

  it("pre-fills form with existing question data", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockQuestion,
      isLoading: false,
    } as any);

    render(<EditQuestion questionId={questionId} />);

    // Check that form is pre-filled with existing data
    const titleInput = screen.getByLabelText(
      /question title/i,
    ) as HTMLInputElement;
    expect(titleInput.value).toBe(mockQuestion.title);

    const descriptionInput = screen.getByLabelText(
      /description/i,
    ) as HTMLTextAreaElement;
    expect(descriptionInput.value).toBe(mockQuestion.description);

    // Check that the rating option is selected (matching mockQuestion.type)
    const ratingOption = screen.getByRole("radio", { name: /rating/i });
    expect(ratingOption).toBeChecked();

    // Check that additional comments checkbox is checked
    const additionalCommentsCheckbox = screen.getByLabelText(
      /allow additional comments/i,
    );
    expect(additionalCommentsCheckbox).toBeChecked();
  });

  it("disables question type field", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockQuestion,
      isLoading: false,
    } as any);

    render(<EditQuestion questionId={questionId} />);

    // All question type radio buttons should be disabled
    const textOption = screen.getByRole("radio", { name: /text/i });
    const ratingOption = screen.getByRole("radio", { name: /rating/i });
    const booleanOption = screen.getByRole("radio", { name: /yes\/no/i });

    expect(textOption).toBeDisabled();
    expect(ratingOption).toBeDisabled();
    expect(booleanOption).toBeDisabled();
  });

  it("handles form submission with updated data", async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockQuestion,
      isLoading: false,
    } as any);

    render(<EditQuestion questionId={questionId} />);

    // Update the form fields
    const titleInput = screen.getByLabelText(/question title/i);
    fireEvent.change(titleInput, {
      target: { value: "Updated Question Title" },
    });

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, {
      target: { value: "Updated description text" },
    });

    // Toggle additional comments off
    const additionalCommentsCheckbox = screen.getByLabelText(
      /allow additional comments/i,
    );
    fireEvent.click(additionalCommentsCheckbox);

    // Submit the form
    const submitButton = screen.getByRole("button", {
      name: /update question/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        id: questionId,
        title: "Updated Question Title",
        questionType: "rating", // Should maintain original type
        description: "Updated description text",
        enableAdditionalComment: false,
      });
    });
  });

  it("shows loading state when updating question", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockQuestion,
      isLoading: false,
    } as any);

    vi.mocked(useUpdateQuestion).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    render(<EditQuestion questionId={questionId} />);

    const submitButton = screen.getByRole("button", { name: /updating/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("aria-disabled", "true");
  });

  it("navigates to question details on successful update", async () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockQuestion,
      isLoading: false,
    } as any);

    // Variable to capture the actual onSuccess callback passed to the hook
    let onSuccessCallback: (() => void) | undefined;

    // Mock the hook implementation to intercept the options passed to it
    vi.mocked(useUpdateQuestion).mockImplementation((options: any) => {
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

    render(<EditQuestion questionId={questionId} />);

    const titleInput = screen.getByLabelText(/question title/i);
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });

    const submitButton = screen.getByRole("button", {
      name: /update question/i,
    });
    // When form is submitted → mutate is called → onSuccessCallback executes → router.push is called
    fireEvent.click(submitButton);

    // Verify that the component's onSuccess callback triggered navigation
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining(`/portal/feedback/questions/${questionId}`),
      );
    });
  });

  it("uses correct query options for fetching question", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockQuestion,
      isLoading: false,
    } as any);

    render(<EditQuestion questionId={questionId} />);

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ["question", questionId],
      }),
    );
  });

  it("handles questions without description", () => {
    const questionWithoutDescription = {
      ...mockQuestion,
      description: null,
    };

    vi.mocked(useQuery).mockReturnValue({
      data: questionWithoutDescription,
      isLoading: false,
    } as any);

    render(<EditQuestion questionId={questionId} />);

    const descriptionInput = screen.getByLabelText(
      /description/i,
    ) as HTMLTextAreaElement;
    expect(descriptionInput.value).toBe("");
  });

  it("uses correct mutation hook configuration", () => {
    vi.mocked(useQuery).mockReturnValue({
      data: mockQuestion,
      isLoading: false,
    } as any);

    render(<EditQuestion questionId={questionId} />);

    expect(useUpdateQuestion).toHaveBeenCalledWith({
      onSuccess: expect.any(Function),
    });
  });
});
