import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import setMockViewport from "@/shared/components/layout/viewport-context/test-utils/setMockViewport";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";
import { mockZustandStoreImplementation } from "@/shared/lib/testing/zustand-utils";

import type { SurveyStoreState } from "../../store/survey.store";
import { useSurveyStore } from "../../store/survey-store-provider";
import { SurveyBottomBar } from "../survey-bottom-bar";

vi.mock("../../store/survey-store-provider", () => ({
  useSurveyStore: vi.fn(),
}));

const mockGoToPrevStep = vi.fn();

const initialState = {
  step: 1,
  totalQuestions: 5,
  goToPrevStep: mockGoToPrevStep,
};

const mockStore = mockZustandStoreImplementation<SurveyStoreState>({
  hook: useSurveyStore,
  initialState,
});

describe("SurveyBottomBar", () => {
  beforeEach(() => {
    mockStore.resetState();
    setMockViewport("xl");
  });

  afterEach(() => {
    vi.resetAllMocks();
    cleanup();
  });

  it("renders back link and step counter correctly", () => {
    mockStore.setState({
      step: 3,
      totalQuestions: 7,
    });

    render(<SurveyBottomBar />);

    const backLink = screen.getByRole("link", { name: /back/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveTextContent("Back");
    expect(screen.getByText("3 of 7")).toBeInTheDocument();
  });

  it("handles interactions and responsive behavior correctly", () => {
    const { rerender } = render(<SurveyBottomBar />);

    // Test back link interaction
    const backLink = screen.getByRole("link", { name: /back/i });
    fireEvent.click(backLink);
    expect(mockGoToPrevStep).toHaveBeenCalledTimes(1);

    // Test step display updates
    expect(screen.getByText("1 of 5")).toBeInTheDocument();

    mockStore.setState({
      step: 4,
      totalQuestions: 8,
    });
    rerender(<SurveyBottomBar />);
    expect(screen.getByText("4 of 8")).toBeInTheDocument();
  });

  it("shows shortcuts tooltip only on desktop viewports", () => {
    // Desktop viewport - should show shortcuts
    setMockViewport("xl");
    const { rerender } = render(<SurveyBottomBar />);

    const shortcutsButton = screen.getByRole("button", { name: /shortcuts/i });
    expect(shortcutsButton).toBeInTheDocument();
    expect(shortcutsButton).toHaveTextContent("Shortcuts");

    // Mobile viewport - should hide shortcuts
    setMockViewport("sm");
    rerender(<SurveyBottomBar />);

    const shortcutsButtonMobile = screen.queryByRole("button", {
      name: /shortcuts/i,
    });
    expect(shortcutsButtonMobile).not.toBeInTheDocument();
  });
});
