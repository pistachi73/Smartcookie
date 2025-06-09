import type { getSurveyTemplateResponses } from "@/data-access/survey-response/queries";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";
import { useQuery } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SurveyTemplateResponses } from "../../survey-template-responses/index";

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock("../../survey-template-responses/survey-template-response", () => ({
  SurveyTemplateResponse: vi.fn(
    ({ response, isOpen, handleToggle, surveyTemplateId }) => (
      <div data-testid={`survey-response-${response.id}`}>
        <button
          type="button"
          onClick={() => handleToggle()}
          data-testid={`toggle-${response.id}`}
        >
          {response.student.name} - {isOpen ? "Open" : "Closed"}
        </button>
        <div>Survey Template ID: {surveyTemplateId}</div>
      </div>
    ),
  ),
}));

vi.mock("../../survey-template-responses/survey-template-no-responses", () => ({
  SurveyTemplateNoResponses: vi.fn(() => (
    <div data-testid="survey-no-responses">No responses available</div>
  )),
}));

const mockResponsesData: Awaited<
  ReturnType<typeof getSurveyTemplateResponses>
> = {
  responses: [
    {
      id: 1,
      completedAt: "2024-01-15T14:30:00Z",
      startedAt: "2024-01-15T14:00:00Z",
      createdAt: "2024-01-15T13:30:00Z",
      student: {
        id: 101,
        name: "John Doe",
        email: "john.doe@example.com",
        image: "https://example.com/avatar1.jpg",
      },
    },
    {
      id: 2,
      completedAt: "2024-01-16T10:15:00Z",
      startedAt: "2024-01-16T10:00:00Z",
      createdAt: "2024-01-16T09:30:00Z",
      student: {
        id: 102,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        image: "https://example.com/avatar2.jpg",
      },
    },
    {
      id: 3,
      completedAt: "2024-01-17T16:45:00Z",
      startedAt: "2024-01-17T16:30:00Z",
      createdAt: "2024-01-17T16:00:00Z",
      student: {
        id: 103,
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        image: null,
      },
    },
  ],
  uncompletedCount: 5,
};

const defaultProps = {
  surveyTemplateId: 1,
};

describe("SurveyResponses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe("Loading State", () => {
    it("renders loading component when query is pending", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isPending: true,
        error: null,
      } as any);

      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.getByLabelText("Loading responses...")).toBeInTheDocument();
      //Loading component and also the text component
      expect(screen.getAllByText("Loading responses...")).toHaveLength(2);
    });

    it("does not render other content while loading", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isPending: true,
        error: null,
      } as any);

      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.queryByText("Survey Responses")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("survey-no-responses"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("renders error component when query fails", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isPending: false,
        error: new Error("Network error"),
      } as any);

      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.getByText("Error loading responses")).toBeInTheDocument();
      expect(screen.getByText("Please try again later.")).toBeInTheDocument();
      expect(screen.getByText("Back to hall")).toBeInTheDocument();
    });

    it("does not render other content when error occurs", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isPending: false,
        error: new Error("Network error"),
      } as any);

      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.queryByText("Survey Responses")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("survey-no-responses"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("renders no responses component when responses array is empty", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { responses: [], uncompletedCount: 0 },
        isPending: false,
        error: null,
      } as any);

      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.getByTestId("survey-no-responses")).toBeInTheDocument();
      expect(screen.getByText("No responses available")).toBeInTheDocument();
    });

    it("renders section header even when no responses", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { responses: [], uncompletedCount: 0 },
        isPending: false,
        error: null,
      } as any);

      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.getByText("Survey Responses")).toBeInTheDocument();
    });

    it("does not render response list when no responses", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { responses: [], uncompletedCount: 0 },
        isPending: false,
        error: null,
      } as any);

      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.queryByTestId("survey-response-1")).not.toBeInTheDocument();
    });
  });

  describe("Success State with Responses", () => {
    beforeEach(() => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockResponsesData,
        isPending: false,
        error: null,
      } as any);
    });

    it("renders all survey responses", () => {
      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.getByTestId("survey-response-1")).toBeInTheDocument();
      expect(screen.getByTestId("survey-response-2")).toBeInTheDocument();
      expect(screen.getByTestId("survey-response-3")).toBeInTheDocument();
    });

    it("passes correct props to each SurveyResponse", () => {
      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.getByText("John Doe - Closed")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith - Closed")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson - Closed")).toBeInTheDocument();

      expect(screen.getAllByText("Survey Template ID: 1")).toHaveLength(3);
    });

    it("does not render no responses component when responses exist", () => {
      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(
        screen.queryByTestId("survey-no-responses"),
      ).not.toBeInTheDocument();
    });
  });

  describe("Toggle Functionality", () => {
    beforeEach(() => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockResponsesData,
        isPending: false,
        error: null,
      } as any);
    });

    it("opens response when toggle is clicked", async () => {
      render(<SurveyTemplateResponses {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-1");
      fireEvent.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText("John Doe - Open")).toBeInTheDocument();
      });
    });

    it("closes response when toggle is clicked again", async () => {
      render(<SurveyTemplateResponses {...defaultProps} />);

      const toggleButton = screen.getByTestId("toggle-1");

      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByText("John Doe - Open")).toBeInTheDocument();
      });

      fireEvent.click(toggleButton);
      await waitFor(() => {
        expect(screen.getByText("John Doe - Closed")).toBeInTheDocument();
      });
    });

    it("only allows one response to be open at a time", async () => {
      render(<SurveyTemplateResponses {...defaultProps} />);

      const toggle1 = screen.getByTestId("toggle-1");
      const toggle2 = screen.getByTestId("toggle-2");

      fireEvent.click(toggle1);
      await waitFor(() => {
        expect(screen.getByText("John Doe - Open")).toBeInTheDocument();
      });

      fireEvent.click(toggle2);
      await waitFor(() => {
        expect(screen.getByText("John Doe - Closed")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith - Open")).toBeInTheDocument();
      });
    });

    it("handles multiple toggle interactions correctly", async () => {
      render(<SurveyTemplateResponses {...defaultProps} />);

      const toggle1 = screen.getByTestId("toggle-1");
      const toggle2 = screen.getByTestId("toggle-2");
      const toggle3 = screen.getByTestId("toggle-3");

      fireEvent.click(toggle1);
      await waitFor(() => {
        expect(screen.getByText("John Doe - Open")).toBeInTheDocument();
      });

      fireEvent.click(toggle3);
      await waitFor(() => {
        expect(screen.getByText("John Doe - Closed")).toBeInTheDocument();
        expect(screen.getByText("Bob Johnson - Open")).toBeInTheDocument();
      });

      fireEvent.click(toggle2);
      await waitFor(() => {
        expect(screen.getByText("Bob Johnson - Closed")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith - Open")).toBeInTheDocument();
      });
    });
  });

  describe("Query Integration", () => {
    it("calls useQuery with correct survey template ID", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockResponsesData,
        isPending: false,
        error: null,
      } as any);

      render(<SurveyTemplateResponses surveyTemplateId={999} />);

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["survey-template-responses", 999],
        }),
      );
    });

    it("handles different survey template IDs", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockResponsesData,
        isPending: false,
        error: null,
      } as any);

      render(<SurveyTemplateResponses surveyTemplateId={456} />);

      expect(screen.getAllByText("Survey Template ID: 456")).toHaveLength(3);
    });
  });

  describe("Component Structure", () => {
    beforeEach(() => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockResponsesData,
        isPending: false,
        error: null,
      } as any);
    });

    it("renders responses in correct order", () => {
      render(<SurveyTemplateResponses {...defaultProps} />);

      const responses = screen.getAllByTestId(/survey-response-/);
      expect(responses).toHaveLength(3);
      expect(responses[0]).toHaveAttribute("data-testid", "survey-response-1");
      expect(responses[1]).toHaveAttribute("data-testid", "survey-response-2");
      expect(responses[2]).toHaveAttribute("data-testid", "survey-response-3");
    });
  });

  describe("Edge Cases", () => {
    it("handles single response correctly", () => {
      const singleResponseData = {
        responses: [mockResponsesData.responses[0]!],
        uncompletedCount: 0,
      };

      vi.mocked(useQuery).mockReturnValue({
        data: singleResponseData,
        isPending: false,
        error: null,
      } as any);

      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.getByTestId("survey-response-1")).toBeInTheDocument();
      expect(screen.queryByTestId("survey-response-2")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("survey-no-responses"),
      ).not.toBeInTheDocument();
    });

    it("handles responses with null student image", () => {
      const responseWithNullImage = {
        responses: [
          {
            ...mockResponsesData.responses[0]!,
            student: {
              ...mockResponsesData.responses[0]!.student,
              image: null,
            },
          },
        ],
        uncompletedCount: 0,
      };

      vi.mocked(useQuery).mockReturnValue({
        data: responseWithNullImage,
        isPending: false,
        error: null,
      } as any);

      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.getByTestId("survey-response-1")).toBeInTheDocument();
      expect(screen.getByText("John Doe - Closed")).toBeInTheDocument();
    });

    it("handles undefined data gracefully", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isPending: false,
        error: null,
      } as any);

      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.getByText("No responses available")).toBeInTheDocument();
    });
  });

  describe("State Management", () => {
    beforeEach(() => {
      vi.mocked(useQuery).mockReturnValue({
        data: mockResponsesData,
        isPending: false,
        error: null,
      } as any);
    });

    it("initializes with no response open", () => {
      render(<SurveyTemplateResponses {...defaultProps} />);

      expect(screen.getByText("John Doe - Closed")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith - Closed")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson - Closed")).toBeInTheDocument();
    });

    it("maintains state correctly across multiple interactions", async () => {
      render(<SurveyTemplateResponses {...defaultProps} />);

      const toggle1 = screen.getByTestId("toggle-1");
      const toggle2 = screen.getByTestId("toggle-2");

      fireEvent.click(toggle1);
      await waitFor(() => {
        expect(screen.getByText("John Doe - Open")).toBeInTheDocument();
      });

      fireEvent.click(toggle1);
      await waitFor(() => {
        expect(screen.getByText("John Doe - Closed")).toBeInTheDocument();
      });

      fireEvent.click(toggle2);
      await waitFor(() => {
        expect(screen.getByText("Jane Smith - Open")).toBeInTheDocument();
        expect(screen.getByText("John Doe - Closed")).toBeInTheDocument();
      });
    });
  });
});
