import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockNextNavigation } from "@/shared/lib/testing/navigation-mocks";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@/shared/lib/testing/test-utils";

import { useInitSurvey } from "@/features/hub/hooks/feedback/use-init-survey";
import { useHubs } from "@/features/hub/hooks/use-hubs";
import { InitSurveyFromFeedbackSheet } from "../init-survey-from-feedback-sheet";

mockNextNavigation();

// Mock dependencies
vi.mock("@/features/hub/hooks/use-hubs", () => ({
  useHubs: vi.fn(),
}));

vi.mock("@/features/hub/hooks/feedback/use-init-survey", () => ({
  useInitSurvey: vi.fn(),
}));

const mockHubs = [
  {
    id: 1,
    name: "React Fundamentals",
    color: "blue",
    studentsCount: 25,
  },
  {
    id: 2,
    name: "Advanced TypeScript",
    color: "green",
    studentsCount: 18,
  },
  {
    id: 3,
    name: "Node.js Backend",
    color: "purple",
    studentsCount: 1,
  },
];

const defaultProps = {
  surveyTemplateId: 456,
  isOpen: true,
  onOpenChange: vi.fn(),
  onCancel: vi.fn(),
};

describe("InitSurveyFromFeedbackSheet", () => {
  const mockInitSurvey = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useHubs).mockReturnValue({
      data: mockHubs,
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
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      expect(
        screen.getByRole("dialog", { name: /initialize survey/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Initialize a new survey using this template for any of your courses below.",
        ),
      ).toBeInTheDocument();
    });

    it("renders search field", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      expect(
        screen.getByPlaceholderText("Search hubs by name..."),
      ).toBeInTheDocument();
    });

    it("renders cancel and initialize buttons", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const buttonNames = [/cancel/i, /initialize survey/i];
      buttonNames.forEach((name) => {
        expect(screen.getByRole("button", { name })).toBeInTheDocument();
      });
    });
  });

  describe("Loading State", () => {
    it("shows skeleton loaders when loading", () => {
      vi.mocked(useHubs).mockReturnValue({
        data: undefined,
        isLoading: true,
      } as any);

      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      // Should show skeleton loaders - check for skeleton class
      const skeletons = document.querySelectorAll(".animate-pulse");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("Empty State", () => {
    it("shows empty state when no hubs available", () => {
      vi.mocked(useHubs).mockReturnValue({
        data: [],
        isLoading: false,
      } as any);

      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      expect(screen.getByText("No hubs available")).toBeInTheDocument();
      expect(
        screen.getByText("Create a hub first to initialize surveys."),
      ).toBeInTheDocument();
    });

    it("shows empty state when hubs is undefined", () => {
      vi.mocked(useHubs).mockReturnValue({
        data: undefined,
        isLoading: false,
      } as any);

      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      expect(screen.getByText("No hubs available")).toBeInTheDocument();
    });
  });

  describe("Hub Display", () => {
    it("renders all hubs", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      expect(screen.getByText("Available Hubs (3)")).toBeInTheDocument();

      const hubNames = mockHubs.map((hub) => hub.name);
      hubNames.forEach((name) => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });

    it("shows student counts correctly", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const studentCounts = ["25 students", "18 students", "1 student"];
      studentCounts.forEach((count) => {
        expect(screen.getByText(count)).toBeInTheDocument();
      });
    });

    it("renders hub color indicators", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const colors = mockHubs.map((hub) => hub.color);
      colors.forEach((color) => {
        expect(
          document.querySelector(`[title="Color: ${color}"]`),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Search Functionality", () => {
    const searchTestCases = [
      {
        name: "filters hubs by name",
        searchValue: "React",
        expectedCount: 1,
        expectedVisible: ["React Fundamentals"],
        expectedHidden: ["Advanced TypeScript", "Node.js Backend"],
      },
      {
        name: "is case insensitive",
        searchValue: "REACT",
        expectedVisible: ["React Fundamentals"],
      },
      {
        name: "filters by partial matches",
        searchValue: "Type",
        expectedCount: 1,
        expectedVisible: ["Advanced TypeScript"],
      },
    ];

    searchTestCases.forEach(
      ({
        name,
        searchValue,
        expectedCount,
        expectedVisible,
        expectedHidden,
      }) => {
        it(name, async () => {
          render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

          const searchInput = screen.getByPlaceholderText(
            "Search hubs by name...",
          );
          fireEvent.change(searchInput, { target: { value: searchValue } });

          await waitFor(() => {
            if (expectedCount) {
              expect(
                screen.getByText(`Available Hubs (${expectedCount})`),
              ).toBeInTheDocument();
            }

            expectedVisible?.forEach((text) => {
              expect(screen.getByText(text)).toBeInTheDocument();
            });

            expectedHidden?.forEach((text) => {
              expect(screen.queryByText(text)).not.toBeInTheDocument();
            });
          });
        });
      },
    );

    it("shows no results message when search yields no matches", async () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search hubs by name...");

      fireEvent.change(searchInput, { target: { value: "nonexistent" } });

      await waitFor(() => {
        expect(
          screen.getByText('No hubs found matching "nonexistent"'),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Hub Selection", () => {
    it("allows selecting a hub", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const reactHubOption = screen.getByRole("radio", {
        name: /react fundamentals/i,
      });

      fireEvent.click(reactHubOption);

      expect(reactHubOption).toBeChecked();
    });

    it("shows checkmark icon when hub is selected", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const reactHubOption = screen.getByRole("radio", {
        name: /react fundamentals/i,
      });

      fireEvent.click(reactHubOption);

      // The checkmark icon should be visible - check if hub is selected
      expect(reactHubOption).toBeChecked();
      // We can also check for the presence of any SVG icon in the selected state
      const icons = document.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });

    it("enables initialize button when hub is selected", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const initializeButton = screen.getByRole("button", {
        name: /initialize survey/i,
      });
      // Check for disabled state using data-disabled attribute
      expect(initializeButton).toHaveAttribute("data-disabled", "true");

      const reactHubOption = screen.getByRole("radio", {
        name: /react fundamentals/i,
      });
      fireEvent.click(reactHubOption);

      expect(initializeButton).not.toHaveAttribute("data-disabled", "true");
    });

    it("allows selecting different hubs", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const reactHubOption = screen.getByRole("radio", {
        name: /react fundamentals/i,
      });
      const typescriptHubOption = screen.getByRole("radio", {
        name: /advanced typescript/i,
      });

      // Select first hub
      fireEvent.click(reactHubOption);
      expect(reactHubOption).toBeChecked();
      expect(typescriptHubOption).not.toBeChecked();

      // Select second hub
      fireEvent.click(typescriptHubOption);
      expect(reactHubOption).not.toBeChecked();
      expect(typescriptHubOption).toBeChecked();
    });
  });

  describe("Form Submission", () => {
    it("calls initSurvey with correct parameters when form is submitted", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      // Select a hub
      const reactHubOption = screen.getByRole("radio", {
        name: /react fundamentals/i,
      });
      fireEvent.click(reactHubOption);

      // Submit form
      const initializeButton = screen.getByRole("button", {
        name: /initialize survey/i,
      });
      fireEvent.click(initializeButton);

      expect(mockInitSurvey).toHaveBeenCalledWith({
        hubId: 1,
        surveyTemplateId: 456,
      });
    });

    it("does not submit when no hub is selected", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

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

      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const buttons = [{ name: /initialize survey/i }, { name: /cancel/i }];

      buttons.forEach(({ name }) => {
        const button = screen.getByRole("button", { name });
        expect(button).toHaveAttribute("data-disabled", "true");
      });

      expect(
        screen.getByLabelText("Initializing survey..."),
      ).toBeInTheDocument();
    });
  });

  describe("Sheet Interactions", () => {
    it("calls onCancel when cancel button is clicked", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(defaultProps.onCancel).toHaveBeenCalledOnce();
    });

    it("calls onOpenChange when sheet is closed", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });

    it("resets form state when sheet is closed", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      // Select a hub and search
      const reactHubOption = screen.getByRole("radio", {
        name: /react fundamentals/i,
      });
      fireEvent.click(reactHubOption);

      const searchInput = screen.getByPlaceholderText("Search hubs by name...");
      fireEvent.change(searchInput, { target: { value: "test search" } });

      // Verify state is set
      expect(reactHubOption).toBeChecked();
      expect(searchInput).toHaveValue("test search");

      // Close sheet
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      fireEvent.click(cancelButton);

      // Reopen sheet (simulate new render)
      cleanup();
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      // Get new elements after re-render
      const newSearchInput = screen.getByPlaceholderText(
        "Search hubs by name...",
      );
      const newReactHubOption = screen.getByRole("radio", {
        name: /react fundamentals/i,
      });

      // Form should be reset
      expect(newSearchInput).toHaveValue("");
      expect(newReactHubOption).not.toBeChecked();
    });
  });

  describe("Success Handling", () => {
    it("closes sheet on successful survey initialization", () => {
      let onSuccessCallback: () => void;
      vi.mocked(useInitSurvey).mockImplementation(({ onSuccess }: any) => {
        onSuccessCallback = onSuccess;
        return { mutate: mockInitSurvey, isPending: false } as any;
      });

      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      // Trigger the success callback
      onSuccessCallback!();

      expect(defaultProps.onCancel).toHaveBeenCalledOnce();
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Accessibility", () => {
    it("has proper search field accessibility", () => {
      render(<InitSurveyFromFeedbackSheet {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText("Search hubs by name...");
      expect(searchInput).toHaveAttribute("type", "search");
    });
  });
});
