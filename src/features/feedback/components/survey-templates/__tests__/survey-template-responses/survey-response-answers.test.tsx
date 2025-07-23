import { useQueries } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { cleanup, render, screen } from "@/shared/lib/testing/test-utils";

import { SurveyTemplateResponseAnswers } from "../../survey-template-responses/survey-template-response-answers";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueries: vi.fn(),
  };
});

vi.mock("../../questions/question-type-badge", () => ({
  QuestionTypeBadge: vi.fn(({ type, label }) => (
    <div data-testid={`question-badge-${label}`}>
      {type} - {label}
    </div>
  )),
}));

const mockSurveyTemplate = {
  id: 1,
  title: "Test Survey",
  description: "Test Description",
  totalResponses: 5,
  averageResponseTime: 120000,
  updatedAt: "2024-01-10T10:00:00Z",
  questions: [
    {
      id: 1,
      title: "How do you rate our service?",
      description: "Please rate from 1 to 10",
      type: "rating",
      enableAdditionalComment: false,
      required: true,
      order: 1,
      surveyTemplateQuestionId: 101,
    },
    {
      id: 2,
      title: "Would you recommend us?",
      description: "Yes or No",
      type: "boolean",
      enableAdditionalComment: false,
      required: true,
      order: 2,
      surveyTemplateQuestionId: 102,
    },
    {
      id: 3,
      title: "Any additional comments?",
      description: "Please share your thoughts",
      type: "text",
      enableAdditionalComment: false,
      required: false,
      order: 3,
      surveyTemplateQuestionId: 103,
    },
    {
      id: 4,
      title: "Question added later",
      description: "This was added after response",
      type: "text",
      enableAdditionalComment: false,
      required: false,
      order: 4,
      surveyTemplateQuestionId: 104,
    },
  ],
};

const mockSurveyResponseAnswers = {
  id: 1,
  completedAt: "2024-01-15T14:30:00Z",
  answers: [
    {
      id: 1,
      value: "8",
      additionalComment: null,
      question: { id: 1, type: "rating" },
    },
    {
      id: 2,
      value: "true",
      additionalComment: null,
      question: { id: 2, type: "boolean" },
    },
    {
      id: 3,
      value: "Great service, very satisfied!",
      additionalComment: null,
      question: { id: 3, type: "text" },
    },
  ],
};

const defaultProps = {
  surveyResponseId: 1,
  surveyTemplateId: 1,
};

describe("SurveyResponseAnswers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Loading and Error States", () => {
    it("renders no responses message when survey template is not loaded", () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: null },
        { data: mockSurveyResponseAnswers },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(screen.getByText("No responses found")).toBeInTheDocument();
    });

    it("renders no responses message when survey response answers are not loaded", () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: mockSurveyTemplate },
        { data: null },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(screen.getByText("No responses found")).toBeInTheDocument();
    });

    it("renders no responses message when both are not loaded", () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: null },
        { data: null },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(screen.getByText("No responses found")).toBeInTheDocument();
    });
  });

  describe("Question Type Rendering", () => {
    beforeEach(() => {
      vi.mocked(useQueries).mockReturnValue([
        { data: mockSurveyTemplate },
        { data: mockSurveyResponseAnswers },
      ] as any);
    });

    it("renders all question types correctly", () => {
      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(screen.getByText("8/10")).toBeInTheDocument();
      expect(screen.getByText("Yes")).toBeInTheDocument();
      expect(
        screen.getByText("Great service, very satisfied!"),
      ).toBeInTheDocument();
      expect(screen.getByText("Not answered")).toBeInTheDocument();
    });

    it("renders rating question with stars correctly", () => {
      render(<SurveyTemplateResponseAnswers {...defaultProps} />);
      expect(screen.getByText("8/10")).toBeInTheDocument();
    });

    it("renders boolean question with thumbs up", () => {
      render(<SurveyTemplateResponseAnswers {...defaultProps} />);
      expect(screen.getByText("Yes")).toBeInTheDocument();
    });

    it("renders text question response", () => {
      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(
        screen.getByText("Great service, very satisfied!"),
      ).toBeInTheDocument();
    });
  });

  describe("Rating Question Rendering", () => {
    it.each([
      ["1", "1/10"],
      ["5", "5/10"],
      ["10", "10/10"],
    ])("renders rating value %s as %s", (rating, expected) => {
      const customAnswers = {
        ...mockSurveyResponseAnswers,
        answers: [
          {
            id: 1,
            value: rating,
            additionalComment: null,
            question: { id: 1, type: "rating" },
          },
        ],
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: mockSurveyTemplate },
        { data: customAnswers },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });

  describe("Boolean Question Rendering", () => {
    it.each([
      ["true", "Yes"],
      ["false", "No"],
    ])("renders '%s' value as '%s'", (value, expected) => {
      const customAnswers = {
        ...mockSurveyResponseAnswers,
        answers: [
          {
            id: 2,
            value,
            additionalComment: null,
            question: { id: 2, type: "boolean" },
          },
        ],
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: mockSurveyTemplate },
        { data: customAnswers },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(screen.getByText(expected)).toBeInTheDocument();
    });
  });

  describe("Unanswered Questions", () => {
    it("renders 'Not answered' for missing answers", () => {
      const answersWithMissing = {
        ...mockSurveyResponseAnswers,
        answers: [
          {
            id: 1,
            value: "8",
            additionalComment: null,
            question: { id: 1, type: "rating" },
          },
        ],
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: mockSurveyTemplate },
        { data: answersWithMissing },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(screen.getAllByText("Not answered")).toHaveLength(3);
    });

    it("renders 'Question added after response completion' for questions added later", () => {
      const templateUpdatedLater = {
        ...mockSurveyTemplate,
        updatedAt: "2024-01-20T10:00:00Z",
      };

      const answersWithMissing = {
        ...mockSurveyResponseAnswers,
        completedAt: "2024-01-15T14:30:00Z",
        answers: [
          {
            id: 1,
            value: "8",
            additionalComment: null,
            question: { id: 1, type: "rating" },
          },
        ],
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: templateUpdatedLater },
        { data: answersWithMissing },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(
        screen.getAllByText("Question added after response completion"),
      ).toHaveLength(3);
    });
  });

  describe("Answer Validation", () => {
    it.each([
      ["empty text answers", 3, "text", ""],
      ["whitespace-only text answers", 3, "text", "   "],
      ["invalid rating values", 1, "rating", "invalid"],
      ["invalid boolean values", 2, "boolean", "maybe"],
    ])(
      "treats %s as not answered",
      (_description, questionId, questionType, value) => {
        const answersWithInvalidValue = {
          ...mockSurveyResponseAnswers,
          answers: [
            {
              id: questionId,
              value,
              additionalComment: null,
              question: { id: questionId, type: questionType },
            },
          ],
        };

        vi.mocked(useQueries).mockReturnValue([
          { data: mockSurveyTemplate },
          { data: answersWithInvalidValue },
        ] as any);

        render(<SurveyTemplateResponseAnswers {...defaultProps} />);

        expect(screen.getAllByText("Not answered")).toHaveLength(4);
      },
    );

    it.each([["0"], ["11"], ["-1"]])(
      "treats out-of-range rating value %s as not answered",
      (invalidRating) => {
        const answersWithInvalidRating = {
          ...mockSurveyResponseAnswers,
          answers: [
            {
              id: 1,
              value: invalidRating,
              additionalComment: null,
              question: { id: 1, type: "rating" },
            },
          ],
        };

        vi.mocked(useQueries).mockReturnValue([
          { data: mockSurveyTemplate },
          { data: answersWithInvalidRating },
        ] as any);

        render(<SurveyTemplateResponseAnswers {...defaultProps} />);

        expect(screen.getAllByText("Not answered")).toHaveLength(4);
      },
    );
  });

  describe("Edge Cases", () => {
    it("handles null completedAt gracefully", () => {
      const answersWithNullCompletedAt = {
        ...mockSurveyResponseAnswers,
        completedAt: null,
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: mockSurveyTemplate },
        { data: answersWithNullCompletedAt },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(screen.getByText("8/10")).toBeInTheDocument();
    });

    it("handles answers with null question reference", () => {
      const answersWithNullQuestion = {
        ...mockSurveyResponseAnswers,
        answers: [
          {
            id: 1,
            value: "8",
            additionalComment: null,
            question: null,
          },
        ],
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: mockSurveyTemplate },
        { data: answersWithNullQuestion },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(screen.getAllByText("Not answered")).toHaveLength(4);
    });

    it("handles survey template with no questions", () => {
      const templateWithNoQuestions = {
        ...mockSurveyTemplate,
        questions: [],
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: templateWithNoQuestions },
        { data: mockSurveyResponseAnswers },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      expect(screen.queryByTestId(/question-badge-/)).not.toBeInTheDocument();
    });
  });

  describe("Question Ordering", () => {
    it("displays answers in survey template question order, not answer order", () => {
      const reorderedSurveyTemplate = {
        ...mockSurveyTemplate,
        questions: [
          {
            id: 3,
            title: "Any additional comments?",
            description: "Please share your thoughts",
            type: "text",
            enableAdditionalComment: false,
            required: false,
            order: 1,
            surveyTemplateQuestionId: 103,
          },
          {
            id: 1,
            title: "How do you rate our service?",
            description: "Please rate from 1 to 10",
            type: "rating",
            enableAdditionalComment: false,
            required: true,
            order: 2,
            surveyTemplateQuestionId: 101,
          },
          {
            id: 2,
            title: "Would you recommend us?",
            description: "Yes or No",
            type: "boolean",
            enableAdditionalComment: false,
            required: true,
            order: 3,
            surveyTemplateQuestionId: 102,
          },
          {
            id: 4,
            title: "Question added later",
            description: "This was added after response",
            type: "text",
            enableAdditionalComment: false,
            required: false,
            order: 4,
            surveyTemplateQuestionId: 104,
          },
        ],
      };

      const answersInDifferentOrder = {
        ...mockSurveyResponseAnswers,
        answers: [
          {
            id: 2,
            value: "true",
            additionalComment: null,
            question: { id: 2, type: "boolean" },
          },
          {
            id: 1,
            value: "8",
            additionalComment: null,
            question: { id: 1, type: "rating" },
          },
          {
            id: 3,
            value: "Great service, very satisfied!",
            additionalComment: null,
            question: { id: 3, type: "text" },
          },
        ],
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: reorderedSurveyTemplate },
        { data: answersInDifferentOrder },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      const container = document.querySelector(".p-4.space-y-4");
      const questionContainers = container?.querySelectorAll(
        ".flex.items-start.gap-4",
      );

      expect(questionContainers).toHaveLength(4);

      expect(questionContainers?.[0]).toHaveTextContent(
        "Great service, very satisfied!",
      );
      expect(questionContainers?.[1]).toHaveTextContent("8/10");
      expect(questionContainers?.[2]).toHaveTextContent("Yes");
      expect(questionContainers?.[3]).toHaveTextContent("Not answered");
    });

    it("maintains question order even when some answers are missing", () => {
      const reorderedSurveyTemplate = {
        ...mockSurveyTemplate,
        questions: [
          {
            id: 2,
            title: "Would you recommend us?",
            description: "Yes or No",
            type: "boolean",
            enableAdditionalComment: false,
            required: true,
            order: 1,
            surveyTemplateQuestionId: 102,
          },
          {
            id: 3,
            title: "Any additional comments?",
            description: "Please share your thoughts",
            type: "text",
            enableAdditionalComment: false,
            required: false,
            order: 2,
            surveyTemplateQuestionId: 103,
          },
          {
            id: 1,
            title: "How do you rate our service?",
            description: "Please rate from 1 to 10",
            type: "rating",
            enableAdditionalComment: false,
            required: true,
            order: 3,
            surveyTemplateQuestionId: 101,
          },
        ],
      };

      const partialAnswers = {
        ...mockSurveyResponseAnswers,
        answers: [
          {
            id: 1,
            value: "7",
            additionalComment: null,
            question: { id: 1, type: "rating" },
          },
          {
            id: 2,
            value: "false",
            additionalComment: null,
            question: { id: 2, type: "boolean" },
          },
        ],
      };

      vi.mocked(useQueries).mockReturnValue([
        { data: reorderedSurveyTemplate },
        { data: partialAnswers },
      ] as any);

      render(<SurveyTemplateResponseAnswers {...defaultProps} />);

      const container = document.querySelector(".p-4.space-y-4");
      const questionContainers = container?.querySelectorAll(
        ".flex.items-start.gap-4",
      );

      expect(questionContainers).toHaveLength(3);

      expect(questionContainers?.[0]).toHaveTextContent("No");
      expect(questionContainers?.[1]).toHaveTextContent("Not answered");
      expect(questionContainers?.[2]).toHaveTextContent("7/10");
    });
  });

  describe("Query Integration", () => {
    it("calls useQueries with correct parameters", () => {
      vi.mocked(useQueries).mockReturnValue([
        { data: mockSurveyTemplate },
        { data: mockSurveyResponseAnswers },
      ] as any);

      render(
        <SurveyTemplateResponseAnswers
          surveyResponseId={123}
          surveyTemplateId={456}
        />,
      );

      expect(useQueries).toHaveBeenCalledWith({
        queries: [
          expect.objectContaining({
            queryKey: ["survey-template", 456],
          }),
          expect.objectContaining({
            queryKey: ["survey-response-answers", 123],
          }),
        ],
      });
    });
  });
});
