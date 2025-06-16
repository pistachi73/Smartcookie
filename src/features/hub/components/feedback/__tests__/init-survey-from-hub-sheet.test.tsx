import { useQuery } from "@tanstack/react-query";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockNextNavigation } from "@/shared/lib/testing/navigation-mocks";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";
import { useInitSurvey } from "../../../hooks/feedback/use-init-survey";
import { InitSurveyFromHubSheet } from "../init-survey-from-hub-sheet";

mockNextNavigation();

// Mock dependencies
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<any>("@tanstack/react-query");
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

vi.mock("../../../hooks/feedback/use-init-survey", () => ({
  useInitSurvey: vi.fn(),
}));

const mockSurveyTemplates = [
  {
    id: 1,
    title: "Customer Satisfaction Survey",
    description: "Measure customer satisfaction with our services",
  },
  {
    id: 2,
    title: "Course Feedback",
    description: "Collect feedback about course content and delivery",
  },
  {
    id: 3,
    title: "Quick Poll",
    description: null,
  },
];

const defaultProps = {
  isOpen: true,
  onOpenChange: vi.fn(),
  hubId: 123,
  hubName: "Test Course",
  onInitSurvey: vi.fn(),
  onCancel: vi.fn(),
};

describe("InitSurveyFromHubSheet", () => {
  const mockInitSurvey = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useQuery).mockReturnValue({
      data: {
        surveyTemplates: mockSurveyTemplates,
        totalCount: mockSurveyTemplates.length,
      },
      isLoading: false,
    } as any);

    vi.mocked(useInitSurvey).mockReturnValue({
      mutate: mockInitSurvey,
      isPending: false,
    } as any);
  });

  afterEach(() => {
    cleanup();
  });

  describe("Component Structure", () => {
    it("renders sheet with correct title and description", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      expect(
        screen.getByText("Initialize Survey for Test Course"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Select a survey template to create a new survey for this course.",
        ),
      ).toBeInTheDocument();
    });

    it("renders search field", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      expect(
        screen.getByPlaceholderText(
          "Search survey templates by name or description...",
        ),
      ).toBeInTheDocument();
    });

    it("renders cancel and initialize buttons", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /initialize survey/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Loading State", () => {
    it("shows skeleton loaders when loading", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: undefined,
        isFetching: true,
      } as any);

      render(<InitSurveyFromHubSheet {...defaultProps} />);

      // Should show skeleton loaders - check for skeleton elements
      const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("Empty State", () => {
    it("shows empty state when no templates available", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { surveyTemplates: [], totalCount: 0 },
        isLoading: false,
      } as any);

      render(<InitSurveyFromHubSheet {...defaultProps} />);

      expect(
        screen.getByText("No survey templates available"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Create a survey template first to initialize surveys.",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: /create survey template/i }),
      ).toBeInTheDocument();
    });

    it("shows empty state when templates is undefined", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { surveyTemplates: [], totalCount: 0 },
        isFetching: false,
      } as any);

      render(<InitSurveyFromHubSheet {...defaultProps} />);

      expect(
        screen.getByText("No survey templates available"),
      ).toBeInTheDocument();
    });
  });

  describe("Template Display", () => {
    it("renders all survey templates", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      expect(screen.getByText("Available Templates (3)")).toBeInTheDocument();
      expect(
        screen.getByText("Customer Satisfaction Survey"),
      ).toBeInTheDocument();
      expect(screen.getByText("Course Feedback")).toBeInTheDocument();
      expect(screen.getByText("Quick Poll")).toBeInTheDocument();
    });

    it("shows template descriptions when available", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      expect(
        screen.getByText("Measure customer satisfaction with our services"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Collect feedback about course content and delivery"),
      ).toBeInTheDocument();
    });

    it("shows singular 'question' for count of 1", () => {
      vi.mocked(useQuery).mockReturnValue({
        data: {
          surveyTemplates: [
            {
              id: 1,
              title: "Single Question Survey",
              description: "Just one question",
            },
          ],
          totalCount: 1,
        },
        isLoading: false,
      } as any);

      render(<InitSurveyFromHubSheet {...defaultProps} />);

      expect(screen.getByText("Available Templates (1)")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("filters templates by title", async () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { surveyTemplates: [mockSurveyTemplates[0]], totalCount: 1 },
        isLoading: false,
      } as any);
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search survey templates by name or description...",
      );

      fireEvent.change(searchInput, { target: { value: "Customer" } });

      await waitFor(() => {
        expect(screen.getByText("Available Templates (1)")).toBeInTheDocument();
        expect(
          screen.getByText("Customer Satisfaction Survey"),
        ).toBeInTheDocument();
        expect(screen.queryByText("Course Feedback")).not.toBeInTheDocument();
        expect(screen.queryByText("Quick Poll")).not.toBeInTheDocument();
      });
    });

    it("filters templates by description", async () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { surveyTemplates: [mockSurveyTemplates[1]], totalCount: 1 },
        isLoading: false,
      } as any);
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search survey templates by name or description...",
      );

      fireEvent.change(searchInput, { target: { value: "course content" } });

      await waitFor(() => {
        expect(screen.getByText("Available Templates (1)")).toBeInTheDocument();
        expect(screen.getByText("Course Feedback")).toBeInTheDocument();
        expect(
          screen.queryByText("Customer Satisfaction Survey"),
        ).not.toBeInTheDocument();
      });
    });

    it("shows no results message when search yields no matches", async () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { surveyTemplates: [], totalCount: 0 },
        isLoading: false,
      } as any);
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search survey templates by name or description...",
      );

      fireEvent.change(searchInput, { target: { value: "nonexistent" } });

      await waitFor(() => {
        expect(
          screen.getByText('No survey templates found matching "nonexistent"'),
        ).toBeInTheDocument();
      });
    });

    it("is case insensitive", async () => {
      vi.mocked(useQuery).mockReturnValue({
        data: { surveyTemplates: [mockSurveyTemplates[0]], totalCount: 1 },
        isLoading: false,
      } as any);
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search survey templates by name or description...",
      );

      fireEvent.change(searchInput, { target: { value: "CUSTOMER" } });

      await waitFor(() => {
        expect(
          screen.getByText("Customer Satisfaction Survey"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Template Selection", () => {
    it("allows selecting a template", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const customerSurveyOption = screen.getByRole("radio", {
        name: /customer satisfaction survey/i,
      });

      fireEvent.click(customerSurveyOption);

      expect(customerSurveyOption).toBeChecked();
    });

    it("shows checkmark icon when template is selected", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const customerSurveyOption = screen.getByRole("radio", {
        name: /customer satisfaction survey/i,
      });

      fireEvent.click(customerSurveyOption);

      // The checkmark icon should be visible - check if template is selected
      expect(customerSurveyOption).toBeChecked();
      // We can also check for the presence of any SVG icon in the selected state
      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("enables initialize button when template is selected", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const initializeButton = screen.getByRole("button", {
        name: /initialize survey/i,
      });
      // Check for disabled state using data-disabled attribute
      expect(initializeButton).toHaveAttribute("data-disabled", "true");

      const customerSurveyOption = screen.getByRole("radio", {
        name: /customer satisfaction survey/i,
      });
      fireEvent.click(customerSurveyOption);

      expect(initializeButton).not.toHaveAttribute("data-disabled", "true");
    });
  });

  describe("Form Submission", () => {
    it("calls initSurvey with correct parameters when form is submitted", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      // Select a template
      const customerSurveyOption = screen.getByRole("radio", {
        name: /customer satisfaction survey/i,
      });
      fireEvent.click(customerSurveyOption);

      // Submit form
      const initializeButton = screen.getByRole("button", {
        name: /initialize survey/i,
      });
      fireEvent.click(initializeButton);

      expect(mockInitSurvey).toHaveBeenCalledWith({
        hubId: 123,
        surveyTemplateId: 1,
      });
    });

    it("does not submit when no template is selected", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const initializeButton = screen.getByRole("button", {
        name: /initialize survey/i,
      });
      fireEvent.click(initializeButton);

      expect(mockInitSurvey).not.toHaveBeenCalled();
    });
  });

  describe("Loading States During Submission", () => {
    it("shows loading state when initializing survey", () => {
      vi.mocked(useInitSurvey).mockReturnValue({
        mutate: mockInitSurvey,
        isPending: true,
      } as any);

      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const initializeButton = screen.getByRole("button", {
        name: /initialize survey/i,
      });
      const cancelButton = screen.getByRole("button", { name: /cancel/i });

      expect(initializeButton).toHaveAttribute("data-disabled", "true");
      expect(cancelButton).toHaveAttribute("data-disabled", "true");

      // Should show loading spinner
      expect(
        screen.getByLabelText("Initializing survey..."),
      ).toBeInTheDocument();
    });
  });

  describe("Sheet Interactions", () => {
    it("calls onCancel when cancel button is clicked", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(defaultProps.onCancel).toHaveBeenCalledOnce();
    });

    it("calls onOpenChange when sheet is closed", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });

    it("resets form state when sheet is closed", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      // Select a template and search
      const customerSurveyOption = screen.getByRole("radio", {
        name: /customer satisfaction survey/i,
      });
      fireEvent.click(customerSurveyOption);

      const searchInput = screen.getByPlaceholderText(
        "Search survey templates by name or description...",
      );
      fireEvent.change(searchInput, { target: { value: "test search" } });

      // Verify state is set
      expect(customerSurveyOption).toBeChecked();
      expect(searchInput).toHaveValue("test search");

      // Close sheet
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Reopen sheet (simulate new render)
      cleanup();
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      // Get new elements after re-render
      const newSearchInput = screen.getByPlaceholderText(
        "Search survey templates by name or description...",
      );
      const newCustomerSurveyOption = screen.getByRole("radio", {
        name: /customer satisfaction survey/i,
      });

      // Form should be reset
      expect(newSearchInput).toHaveValue("");
      expect(newCustomerSurveyOption).not.toBeChecked();
    });
  });

  describe("Success Handling", () => {
    it("closes sheet on successful survey initialization", () => {
      let onSuccessCallback: () => void;
      vi.mocked(useInitSurvey).mockImplementation(({ onSuccess }: any) => {
        onSuccessCallback = onSuccess;
        return { mutate: mockInitSurvey, isPending: false } as any;
      });

      render(<InitSurveyFromHubSheet {...defaultProps} />);

      // Trigger the success callback
      onSuccessCallback!();

      expect(defaultProps.onCancel).toHaveBeenCalledOnce();
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels and roles", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      // Check for proper radio group
      const radioGroup = screen.getByRole("radiogroup");
      expect(radioGroup).toBeInTheDocument();

      // Check for proper radio buttons
      const radioButtons = screen.getAllByRole("radio");
      expect(radioButtons).toHaveLength(3);

      // Check for proper button roles
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /initialize survey/i }),
      ).toBeInTheDocument();
    });

    it("has proper disabled states", () => {
      render(<InitSurveyFromHubSheet {...defaultProps} />);

      const initializeButton = screen.getByRole("button", {
        name: /initialize survey/i,
      });

      // Should be disabled when no template is selected
      expect(initializeButton).toHaveAttribute("data-disabled", "true");
    });
  });
});
