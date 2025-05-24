import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSubmitSurvey } from "../../hooks/use-submit-survey";
import { useSurveyStore } from "../../store/survey-store-provider";
import type { SurveyStoreState } from "../../store/survey.store";
import { SurveyQuestion } from "../survey-question";

// Test data
const textQuestion = {
  id: 1,
  title: "What is your feedback?",
  description: "Please provide your thoughts on the service",
  type: "text" as const,
  required: true,
  enableAdditionalComment: false,
  order: 1,
};

vi.mock("../../store/survey-store-provider", () => ({
  useSurveyStore: vi.fn(),
}));

vi.mock("../../hooks/use-submit-survey", () => ({
  useSubmitSurvey: vi.fn(),
}));

const mockSetResponse = vi.fn();
const mockGoToNextStep = vi.fn();

const initialState = {
  responses: {},
  setResponse: mockSetResponse,
  goToNextStep: mockGoToNextStep,
  totalQuestions: 3,
};

const mockStore = mockZustandStoreImplementation<SurveyStoreState>({
  hook: useSurveyStore,
  initialState,
});

describe("Question Text", () => {
  const mockMutateSubmit = vi.fn();

  beforeEach(() => {
    vi.mocked(useSubmitSurvey as any).mockReturnValue({
      mutate: mockMutateSubmit,
      isPending: false,
    });
    mockStore.resetState();
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it("should render a text input", () => {
    render(<SurveyQuestion question={textQuestion} step={1} />);
    const textInput = screen.getByRole("textbox");
    expect(textInput).toBeInTheDocument();
    expect(textInput).toHaveValue("");
  });

  it("should render a text input with the correct value when the response is set", () => {
    mockStore.setState({
      responses: { 1: "test" },
    });
    render(<SurveyQuestion question={textQuestion} step={1} />);
    const textInput = screen.getByRole("textbox");
    expect(textInput).toHaveValue("test");
  });

  it("should call setResponse when the text input is changed", () => {
    render(<SurveyQuestion question={textQuestion} step={1} />);
    const textInput = screen.getByRole("textbox");
    fireEvent.change(textInput, { target: { value: "test" } });
    expect(mockSetResponse).toHaveBeenCalledWith(textQuestion.id, "test");
  });

  it("should show an error message when the text input is empty and the question is required", async () => {
    render(
      <SurveyQuestion
        question={{ ...textQuestion, required: true }}
        step={1}
      />,
    );
    const textInput = screen.getByRole("textbox");
    const submitButton = screen.getByRole("button");

    fireEvent.change(textInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    waitFor(() => {
      expect(screen.getByText("This field is required")).toBeInTheDocument();
    });
  });

  it("should submit the form when Enter key is pressed on textarea", async () => {
    render(<SurveyQuestion question={textQuestion} step={1} />);
    const textInput = screen.getByRole("textbox");

    fireEvent.change(textInput, { target: { value: "test response" } });
    fireEvent.focus(textInput);
    fireEvent.keyDown(textInput, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(mockGoToNextStep).toHaveBeenCalled();
    });
  });

  it("should not submit the form when Shift+Enter is pressed on textarea", async () => {
    render(<SurveyQuestion question={textQuestion} step={1} />);
    const textInput = screen.getByRole("textbox");

    fireEvent.change(textInput, { target: { value: "test response" } });
    fireEvent.focus(textInput);
    fireEvent.keyDown(textInput, {
      key: "Enter",
      code: "Enter",
      shiftKey: true,
    });

    // Wait a bit to ensure no submission happens
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockGoToNextStep).not.toHaveBeenCalled();
  });

  it("should allow new line creation with Shift+Enter in textarea", () => {
    render(<SurveyQuestion question={textQuestion} step={1} />);
    const textInput = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textInput, { target: { value: "line 1" } });
    fireEvent.focus(textInput);

    // Simulate Shift+Enter creating a new line
    fireEvent.keyDown(textInput, {
      key: "Enter",
      code: "Enter",
      shiftKey: true,
    });

    // Simulate the textarea behavior of adding a new line
    fireEvent.change(textInput, { target: { value: "line 1\nline 2" } });

    expect(textInput.value).toBe("line 1\nline 2");
    expect(mockSetResponse).toHaveBeenLastCalledWith(1, "line 1\nline 2");
  });
});
