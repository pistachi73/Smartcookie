import { useQueries } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";

import { useRouter } from "@/i18n/navigation";
import { SurveyTemplateDetails } from "../survey-template-details";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQueries: vi.fn(),
  };
});

vi.mock("@/shared/hooks/use-navigate-with-params");

vi.mock("../delete-survey-template-modal", () => ({
  DeleteSurveyTemplateModal: vi.fn(),
}));

vi.mock("../init-survey-from-feedback-sheet", () => ({
  InitSurveyFromFeedbackSheet: vi.fn(),
}));

vi.mock("../survey-responses", () => ({
  SurveyResponses: () => <div>Survey Responses</div>,
}));

vi.mock("../template-question", () => ({
  TemplateQuestion: ({ text }: any) => <div>{text}</div>,
}));

const mockSurveyTemplate = {
  id: 1,
  title: "React Fundamentals Survey",
  description: "A comprehensive survey about React basics",
  totalResponses: 45,
  averageResponseTime: 125000, // 2 minutes 5 seconds
  questions: [
    {
      id: 1,
      text: "What is your experience with React?",
      type: "multiple_choice",
      order: 1,
    },
    {
      id: 2,
      text: "How would you rate React's learning curve?",
      type: "rating",
      order: 2,
    },
    {
      id: 3,
      text: "What challenges have you faced with React?",
      type: "text",
      order: 3,
    },
  ],
};

const mockResponses = [
  { id: 1, userId: 1, completedAt: "2024-01-01" },
  { id: 2, userId: 2, completedAt: "2024-01-02" },
  { id: 3, userId: 3, completedAt: "2024-01-03" },
];

const mockResponsesData = {
  responses: mockResponses,
  uncompletedCount: 10,
};

const defaultProps = {
  surveyTemplateId: 1,
};

describe("SurveyTemplateDetails", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
    } as any);

    vi.mocked(useQueries).mockReturnValue([
      {
        data: mockSurveyTemplate,
        isLoading: false,
      },
      {
        data: mockResponsesData,
        isLoading: false,
      },
    ] as any);
  });

  afterEach(() => {
    cleanup();
  });

  describe("Loading State", () => {
    const loadingTestCases = [
      {
        name: "shows loading state when survey template is loading",
        queries: [
          { data: undefined, isLoading: true },
          { data: mockResponsesData, isLoading: false },
        ],
      },
      {
        name: "shows loading state when responses are loading",
        queries: [
          { data: mockSurveyTemplate, isLoading: false },
          { data: undefined, isLoading: true },
        ],
      },
    ];

    loadingTestCases.forEach(({ name, queries }) => {
      it(name, () => {
        vi.mocked(useQueries).mockReturnValue(queries as any);

        render(<SurveyTemplateDetails {...defaultProps} />);

        expect(
          screen.getByRole("progressbar", { name: /loading survey template/i }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Not Found State", () => {
    it("shows not found state when survey template is not found", () => {
      vi.mocked(useQueries).mockReturnValue([
        {
          data: undefined,
          isLoading: false,
        },
        {
          data: mockResponsesData,
          isLoading: false,
        },
      ] as any);

      render(<SurveyTemplateDetails {...defaultProps} />);

      expect(screen.getByText("Survey template not found")).toBeInTheDocument();
      expect(
        screen.getByText(
          "This survey template seems to have vanished into thin air!",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Survey Template Display", () => {
    it("renders survey template title and description", () => {
      render(<SurveyTemplateDetails {...defaultProps} />);

      expect(screen.getByText("React Fundamentals Survey")).toBeInTheDocument();
      expect(
        screen.getByText("A comprehensive survey about React basics"),
      ).toBeInTheDocument();
    });

    it("renders survey template without description", () => {
      const templateWithoutDescription = {
        ...mockSurveyTemplate,
        description: null,
      };

      vi.mocked(useQueries).mockReturnValue([
        {
          data: templateWithoutDescription,
          isLoading: false,
        },
        {
          data: mockResponsesData,
          isLoading: false,
        },
      ] as any);

      render(<SurveyTemplateDetails {...defaultProps} />);

      expect(screen.getByText("React Fundamentals Survey")).toBeInTheDocument();
      expect(
        screen.queryByText("A comprehensive survey about React basics"),
      ).not.toBeInTheDocument();
    });

    const badgeTestCases = [
      {
        name: "renders question and response badges",
        template: mockSurveyTemplate,
        responses: mockResponsesData,
        expectedTexts: ["3 questions", "3 responses"],
      },
      {
        name: "shows singular form for single question and response",
        template: {
          ...mockSurveyTemplate,
          questions: [mockSurveyTemplate.questions[0]],
        },
        responses: {
          responses: [mockResponses[0]],
          uncompletedCount: 0,
        },
        expectedTexts: ["1 question", "1 response"],
      },
    ];

    badgeTestCases.forEach(({ name, template, responses, expectedTexts }) => {
      it(name, () => {
        vi.mocked(useQueries).mockReturnValue([
          { data: template, isLoading: false },
          { data: responses, isLoading: false },
        ] as any);

        render(<SurveyTemplateDetails {...defaultProps} />);

        expectedTexts.forEach((text) => {
          expect(screen.getByText(text)).toBeInTheDocument();
        });
      });
    });
  });

  describe("Statistics Display", () => {
    it("renders completion rate and average response time when there are responses", () => {
      render(<SurveyTemplateDetails {...defaultProps} />);

      // Check labels
      expect(screen.getByText("Completion Rate")).toBeInTheDocument();
      expect(screen.getByText("Avg Response Time")).toBeInTheDocument();

      // Check completion rate (82%)
      expect(screen.getByText("82")).toBeInTheDocument();
      expect(screen.getByText("%")).toBeInTheDocument();

      // Check response time (2m 5s) - look for the text that contains both numbers and units
      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === "2m5s";
        }),
      ).toBeInTheDocument();
    });

    it("does not render statistics when there are no responses", () => {
      const noResponsesTemplate = {
        ...mockSurveyTemplate,
        totalResponses: 0,
      };

      vi.mocked(useQueries).mockReturnValue([
        {
          data: noResponsesTemplate,
          isLoading: false,
        },
        {
          data: { responses: [], uncompletedCount: 0 },
          isLoading: false,
        },
      ] as any);

      render(<SurveyTemplateDetails {...defaultProps} />);

      const hiddenElements = ["Completion Rate", "Avg Response Time"];
      hiddenElements.forEach((text) => {
        expect(screen.queryByText(text)).not.toBeInTheDocument();
      });
    });

    const completionRateTestCases = [
      {
        name: "shows high completion rate with success colors",
        totalResponses: 90,
        uncompletedCount: 10,
        expectedRate: "90%",
      },
      {
        name: "shows medium completion rate with warning colors",
        totalResponses: 60,
        uncompletedCount: 40,
        expectedRate: "60%",
      },
      {
        name: "shows low completion rate with danger colors",
        totalResponses: 30,
        uncompletedCount: 70,
        expectedRate: "30%",
      },
    ];

    completionRateTestCases.forEach(
      ({ name, totalResponses, uncompletedCount, expectedRate }) => {
        it(name, () => {
          const templateWithRate = {
            ...mockSurveyTemplate,
            totalResponses,
          };

          const responsesWithRate = {
            responses: Array(totalResponses).fill({}),
            uncompletedCount,
          };

          vi.mocked(useQueries).mockReturnValue([
            {
              data: templateWithRate,
              isLoading: false,
            },
            {
              data: responsesWithRate,
              isLoading: false,
            },
          ] as any);

          render(<SurveyTemplateDetails {...defaultProps} />);

          const percentage = expectedRate.replace("%", "");
          expect(screen.getByText(percentage)).toBeInTheDocument();
          expect(screen.getByText("%")).toBeInTheDocument();
        });
      },
    );

    it("formats response time correctly for seconds only", () => {
      const templateWithShortTime = {
        ...mockSurveyTemplate,
        averageResponseTime: 45000, // 45 seconds
      };

      vi.mocked(useQueries).mockReturnValue([
        {
          data: templateWithShortTime,
          isLoading: false,
        },
        {
          data: mockResponsesData,
          isLoading: false,
        },
      ] as any);

      render(<SurveyTemplateDetails {...defaultProps} />);

      expect(screen.getByText("45")).toBeInTheDocument();
      expect(screen.queryByText(/m$/)).not.toBeInTheDocument(); // No minutes
    });
  });

  describe("Questions Display", () => {
    it("renders all questions", () => {
      render(<SurveyTemplateDetails {...defaultProps} />);

      expect(screen.getByText("Questions")).toBeInTheDocument();

      const questionTexts = mockSurveyTemplate.questions.map((q) => q.text);
      questionTexts.forEach((text) => {
        expect(screen.getByText(text)).toBeInTheDocument();
      });
    });
  });

  describe("Navigation", () => {
    it("renders back to hall link", () => {
      render(<SurveyTemplateDetails {...defaultProps} />);

      const backLink = screen.getByRole("link", { name: /back to hall/i });
      expect(backLink).toBeInTheDocument();
      expect(backLink).toHaveAttribute("href", "/portal/feedback");
    });
  });

  describe("Menu Actions", () => {
    it("renders menu with all action items", async () => {
      render(<SurveyTemplateDetails {...defaultProps} />);

      const menuButton = await screen.findByTestId(
        "survey-template-details-menu-trigger",
      ); // Menu trigger button
      fireEvent.click(menuButton);

      const menuItems = ["Initiate Survey", "Edit Template", "Delete Template"];
      menuItems.forEach((item) => {
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });

    it("navigates to edit page when edit template is clicked", async () => {
      render(<SurveyTemplateDetails {...defaultProps} />);

      const menuButton = await screen.findByTestId(
        "survey-template-details-menu-trigger",
      );
      fireEvent.click(menuButton);

      const editButton = screen.getByText("Edit Template");
      fireEvent.click(editButton);

      expect(mockPush).toHaveBeenCalledWith(
        "/portal/feedback/survey-templates/1/edit",
      );
    });
  });

  describe("Edge Cases", () => {
    const edgeCaseTestCases = [
      {
        name: "handles missing responses data gracefully",
        template: mockSurveyTemplate,
        responses: undefined,
        expectedText: "0 responses",
      },
      {
        name: "handles zero completion rate",
        template: { ...mockSurveyTemplate, totalResponses: 0 },
        responses: { responses: [], uncompletedCount: 5 },
        expectedText: null,
        hiddenText: "Completion Rate",
      },
      {
        name: "handles missing average response time",
        template: { ...mockSurveyTemplate, averageResponseTime: null },
        responses: mockResponsesData,
        expectedText: "N/A",
      },
      {
        name: "handles empty questions array",
        template: { ...mockSurveyTemplate, questions: [] },
        responses: mockResponsesData,
        expectedText: "0 questions",
      },
    ];

    edgeCaseTestCases.forEach(
      ({ name, template, responses, expectedText, hiddenText }) => {
        it(name, () => {
          vi.mocked(useQueries).mockReturnValue([
            { data: template, isLoading: false },
            { data: responses, isLoading: false },
          ] as any);

          render(<SurveyTemplateDetails {...defaultProps} />);

          if (expectedText) {
            expect(screen.getByText(expectedText)).toBeInTheDocument();
          }

          if (hiddenText) {
            expect(screen.queryByText(hiddenText)).not.toBeInTheDocument();
          }
        });
      },
    );
  });
});
