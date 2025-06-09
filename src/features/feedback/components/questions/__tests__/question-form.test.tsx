import { QuestionFormSchema } from "@/features/feedback/lib/questions.schema";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { z } from "zod";
import { QuestionForm, type QuestionFormProps } from "../question-form";

type TestWrapperProps = Omit<QuestionFormProps, "form"> & {
  defaultValues?: Partial<z.infer<typeof QuestionFormSchema>>;
};

const TestWrapper = ({
  onSubmit,
  isPending,
  submitButtonText,
  loadingText,
  disabledFields,
  defaultValues,
}: TestWrapperProps) => {
  const form = useForm<z.infer<typeof QuestionFormSchema>>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: {
      title: "",
      questionType: "text" as const,
      description: "",
      enableAdditionalComment: false,
      ...defaultValues,
    },
  });

  return (
    <QuestionForm
      form={form}
      onSubmit={onSubmit}
      isPending={isPending}
      submitButtonText={submitButtonText}
      loadingText={loadingText}
      disabledFields={disabledFields}
    />
  );
};

const defaultProps: TestWrapperProps = {
  onSubmit: vi.fn(),
  isPending: false,
  submitButtonText: "Create Question",
  loadingText: "Creating...",
  disabledFields: {},
};

const renderQuestionForm = (props: TestWrapperProps = defaultProps) => {
  return render(<TestWrapper {...props} />);
};

describe("QuestionForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it("renders all form fields", () => {
    renderQuestionForm({ ...defaultProps, onSubmit: mockOnSubmit });

    expect(screen.getByLabelText(/question title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/question type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/allow additional comments/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create question/i }),
    ).toBeInTheDocument();
  });

  it("renders all question type options", () => {
    renderQuestionForm({ ...defaultProps, onSubmit: mockOnSubmit });

    expect(screen.getByRole("radio", { name: /text/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /rating/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /yes\/no/i })).toBeInTheDocument();
  });

  it("has text question type selected by default", () => {
    renderQuestionForm({ ...defaultProps, onSubmit: mockOnSubmit });

    const textOption = screen.getByRole("radio", { name: /text/i });
    expect(textOption).toBeChecked();
  });

  it("allows selecting different question types", async () => {
    renderQuestionForm({ ...defaultProps, onSubmit: mockOnSubmit });

    const ratingOption = screen.getByRole("radio", { name: /rating/i });
    fireEvent.click(ratingOption);

    await waitFor(() => {
      expect(ratingOption).toBeChecked();
    });
  });

  it("validates required fields", async () => {
    renderQuestionForm({ ...defaultProps, onSubmit: mockOnSubmit });

    const submitButton = screen.getByRole("button", {
      name: /create question/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("submits form with valid data", async () => {
    renderQuestionForm({ ...defaultProps, onSubmit: mockOnSubmit });

    const titleInput = screen.getByLabelText(/question title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const ratingOption = screen.getByRole("radio", { name: /rating/i });
    const additionalCommentCheckbox = screen.getByLabelText(
      /allow additional comments/i,
    );
    const submitButton = screen.getByRole("button", {
      name: /create question/i,
    });

    fireEvent.change(titleInput, {
      target: { value: "How would you rate our service?" },
    });
    fireEvent.change(descriptionInput, {
      target: { value: "Please rate from 1-10" },
    });
    fireEvent.click(ratingOption);
    fireEvent.click(additionalCommentCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          title: "How would you rate our service?",
          questionType: "rating",
          description: "Please rate from 1-10",
          enableAdditionalComment: true,
        },
        expect.any(Object), // The form event object
      );
    });
  });

  it("shows loading state when pending", () => {
    renderQuestionForm({
      ...defaultProps,
      onSubmit: mockOnSubmit,
      isPending: true,
      loadingText: "Creating question...",
    });

    const submitButton = screen.getByRole("button", {
      name: /creating question/i,
    });
    expect(submitButton).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByLabelText(/creating question/i)).toBeInTheDocument();
  });

  it("disables fields when specified", () => {
    renderQuestionForm({
      ...defaultProps,
      onSubmit: mockOnSubmit,
      disabledFields: { questionType: true },
    });

    const textOption = screen.getByRole("radio", { name: /text/i });
    const ratingOption = screen.getByRole("radio", { name: /rating/i });
    const booleanOption = screen.getByRole("radio", { name: /yes\/no/i });

    expect(textOption).toBeDisabled();
    expect(ratingOption).toBeDisabled();
    expect(booleanOption).toBeDisabled();
  });

  it("populates form with default values", () => {
    const defaultValues = {
      title: "Existing question",
      questionType: "boolean" as const,
      description: "Existing description",
      enableAdditionalComment: true,
    };

    renderQuestionForm({
      ...defaultProps,
      onSubmit: mockOnSubmit,
      defaultValues,
    });

    expect(screen.getByDisplayValue("Existing question")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Existing description"),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /yes\/no/i })).toBeChecked();
    expect(screen.getByLabelText(/allow additional comments/i)).toBeChecked();
  });

  it("shows question type descriptions", () => {
    renderQuestionForm({ ...defaultProps, onSubmit: mockOnSubmit });
 
    expect(screen.getByText("Open-ended responses")).toBeInTheDocument();
    expect(screen.getByText("1-10 scale rating")).toBeInTheDocument();
    expect(screen.getByText("Simple yes/no choice")).toBeInTheDocument();
  });

  it("shows field descriptions and placeholders", () => {
    renderQuestionForm({ ...defaultProps, onSubmit: mockOnSubmit });

    expect(
      screen.getByText(/write a clear, specific question/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/optional context to help users/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/what improvements would you suggest/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/provide additional context/i),
    ).toBeInTheDocument();
  });
});
