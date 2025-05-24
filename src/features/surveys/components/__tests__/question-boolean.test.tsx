import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSubmitSurvey } from "../../hooks/use-submit-survey";
import { useSurveyStore } from "../../store/survey-store-provider";
import type { SurveyStoreState } from "../../store/survey.store";
import { SurveyQuestion } from "../survey-question";

const booleanQuestion = {
  id: 3,
  title: "Do you recommend our service?",
  description: "Please select Yes or No",
  type: "boolean" as const,
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

describe("Question Boolean", () => {
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

  it("should render both Yes and No options", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={booleanQuestion} step={1} />);

    const options = screen.getAllByRole("radio");
    expect(options).toHaveLength(2);

    // Check that Yes and No options are rendered
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();

    // Check abbreviations are shown
    expect(screen.getByText("Y")).toBeInTheDocument();
    expect(screen.getByText("N")).toBeInTheDocument();

    // Check that no option is initially selected
    options.forEach((option) => {
      expect(option).not.toBeChecked();
    });
  });

  it("should select Yes when clicked", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={booleanQuestion} step={1} />);

    // Click on "Yes" option
    const yesOption = screen.getByRole("radio", { name: /yes/i });
    fireEvent.click(yesOption);

    // Check that Yes is selected
    expect(yesOption).toBeChecked();

    // Check that setResponse was called with "true"
    expect(mockSetResponse).toHaveBeenCalledWith(booleanQuestion.id, "true");

    // Verify No is not selected
    const noOption = screen.getByRole("radio", { name: /no/i });
    expect(noOption).not.toBeChecked();
  });

  it("should select No when clicked", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={booleanQuestion} step={1} />);

    // Click on "No" option
    const noOption = screen.getByRole("radio", { name: /no/i });
    fireEvent.click(noOption);

    // Check that No is selected
    expect(noOption).toBeChecked();

    // Check that setResponse was called with "false"
    expect(mockSetResponse).toHaveBeenCalledWith(booleanQuestion.id, "false");

    // Verify Yes is not selected
    const yesOption = screen.getByRole("radio", { name: /yes/i });
    expect(yesOption).not.toBeChecked();
  });

  it("should reflect pre-selected Yes value from store", () => {
    mockStore.setState({
      totalQuestions: 200,
      responses: { [booleanQuestion.id]: "true" },
    });
    render(<SurveyQuestion question={booleanQuestion} step={1} />);

    // Check that Yes is pre-selected
    const yesOption = screen.getByRole("radio", { name: /yes/i });
    expect(yesOption).toBeChecked();

    // Check that No is not selected
    const noOption = screen.getByRole("radio", { name: /no/i });
    expect(noOption).not.toBeChecked();
  });

  it("should handle keyboard input 'y' to select Yes", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={booleanQuestion} step={1} />);

    // Simulate pressing "y" key (lowercase)
    fireEvent.keyDown(window, { key: "y" });

    // Check that Yes is selected
    const yesOption = screen.getByRole("radio", { name: /yes/i });
    expect(yesOption).toBeChecked();
    expect(mockSetResponse).toHaveBeenCalledWith(booleanQuestion.id, "true");
  });

  it("should handle keyboard input 'n' to select No", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={booleanQuestion} step={1} />);

    // Simulate pressing "n" key (lowercase)
    fireEvent.keyDown(window, { key: "n" });

    // Check that No is selected
    const noOption = screen.getByRole("radio", { name: /no/i });
    expect(noOption).toBeChecked();
    expect(mockSetResponse).toHaveBeenCalledWith(booleanQuestion.id, "false");
  });

  it("should switch selection from Yes to No when clicked", () => {
    mockStore.setState({
      totalQuestions: 200,
    });
    render(<SurveyQuestion question={booleanQuestion} step={1} />);

    const yesOption = screen.getByRole("radio", { name: /yes/i });
    const noOption = screen.getByRole("radio", { name: /no/i });

    // First select Yes
    fireEvent.click(yesOption);
    expect(yesOption).toBeChecked();
    expect(noOption).not.toBeChecked();

    // Then select No
    fireEvent.click(noOption);
    expect(noOption).toBeChecked();
    expect(yesOption).not.toBeChecked();

    // Verify the final call was for "false"
    expect(mockSetResponse).toHaveBeenLastCalledWith(
      booleanQuestion.id,
      "false",
    );
  });
});
