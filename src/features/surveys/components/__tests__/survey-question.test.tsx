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

// Final question in the survey
const finalTextQuestion = {
  ...textQuestion,
  id: 3,
  order: 3,
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

describe("SurveyQuestion", () => {
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

  it("should render with the correct question title and description", () => {
    render(<SurveyQuestion question={textQuestion} step={1} />);
    expect(screen.getByText(textQuestion.title)).toBeInTheDocument();
    expect(screen.getByText(textQuestion.description)).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("should call goToNextStep when the text input is valid and the question is not the last one", async () => {
    render(<SurveyQuestion question={textQuestion} step={1} />);
    const textInput = screen.getByRole("textbox");
    fireEvent.change(textInput, { target: { value: "test" } });
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockGoToNextStep).toHaveBeenCalled();
    });
  });

  it("should call submit survey when the text input is valid and it's the final question", async () => {
    mockStore.setState({
      responses: {},
      surveyResponseData: {
        id: 123,
        surveyTemplateId: 1,
        startedAt: new Date().toISOString(),
      },
      totalQuestions: 3,
    });

    render(<SurveyQuestion question={finalTextQuestion} step={3} />);
    const textInput = screen.getByRole("textbox");
    fireEvent.change(textInput, { target: { value: "test" } });
    const submitButton = screen.getByRole("button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateSubmit).toHaveBeenCalledWith({
        surveyResponseId: 123,
        responses: {},
        surveyTemplateId: 1,
        startedAt: expect.any(String),
      });
    });
  });

  it("should submit survey when Enter key is pressed on final question", async () => {
    const mockResponses = {
      [textQuestion.id]: "test",
    };
    const mockResponseData = {
      id: 123,
      surveyTemplateId: 1,
      startedAt: new Date().toISOString(),
    };
    mockStore.setState({
      responses: mockResponses,
      surveyResponseData: mockResponseData,
      totalQuestions: 1,
    });

    render(<SurveyQuestion question={textQuestion} step={1} />);
    fireEvent.keyDown(document.body, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(mockMutateSubmit).toHaveBeenCalledWith({
        surveyResponseId: mockResponseData.id,
        responses: mockResponses,
        surveyTemplateId: mockResponseData.surveyTemplateId,
        startedAt: mockResponseData.startedAt,
      });
    });
  });

  it.each([
    {
      field: "surveyResponseId",
      mockResponseData: {
        surveyTemplateId: 1,
        startedAt: new Date().toISOString(),
      },
    },
    {
      field: "startedAt",
      mockResponseData: {
        id: 123,
        surveyTemplateId: 1,
      },
    },
    {
      field: "surveyTemplateId",
      mockResponseData: {
        id: 123,
        startedAt: new Date().toISOString(),
      },
    },
  ])(
    "should not call onSubmit if $field is missing",
    async ({ mockResponseData }) => {
      const mockResponses = {
        [textQuestion.id]: "test",
      };
      mockStore.setState({
        responses: mockResponses,
        surveyResponseData: mockResponseData,
        totalQuestions: 1,
      });

      render(<SurveyQuestion question={textQuestion} step={1} />);
      const submitButton = screen.getByRole("button");
      fireEvent.click(submitButton);

      expect(mockMutateSubmit).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(
          screen.getByText("Unexpected error, please try again"),
        ).toBeInTheDocument();
      });
    },
  );
});
