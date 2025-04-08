import setMockViewport from "@/shared/components/layout/viewport-context/test-utils/setMockViewport";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";
import type { Frequency } from "rrule";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FrequencySelect } from "../../recurrence-select/components/frequency-select";

const getTrigger = () => screen.getByTestId("frequency-select-trigger");

setMockViewport("xl");

afterEach(() => {
  cleanup();
});

describe("FrequencySelect", () => {
  const defaultProps = {
    setRruleOptions: vi.fn(),
    interval: 1,
    freq: 2 as Frequency, // Default to WEEKLY (2)
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default frequency", () => {
    render(<FrequencySelect {...defaultProps} />);

    const trigger = getTrigger();
    expect(trigger).toHaveTextContent("week");
  });

  it("changes frequency when selected", async () => {
    const setRruleOptions = vi.fn();
    render(
      <FrequencySelect {...defaultProps} setRruleOptions={setRruleOptions} />,
    );

    // Open the dropdown
    const trigger = getTrigger();
    fireEvent.click(trigger);

    // Select "day" option
    const daysOption = screen.getByRole("option", { name: "day" });
    fireEvent.click(daysOption);

    // Verify the callback was called with the correct value
    expect(setRruleOptions).toHaveBeenCalled();

    // Extract and call the callback function
    const callback = setRruleOptions.mock.calls[0]![0];
    const result = callback({ someOtherProp: true });

    // DAILY freq is 3
    expect(result).toEqual({
      someOtherProp: true,
      freq: 3,
    });
  });

  it("updates label based on interval", async () => {
    render(<FrequencySelect {...defaultProps} interval={2} />);

    const trigger = getTrigger();
    expect(trigger).toHaveTextContent("weeks");
  });

  it("calls setRruleOptions with the correct frequency value", async () => {
    const setRruleOptions = vi.fn();

    render(
      <FrequencySelect {...defaultProps} setRruleOptions={setRruleOptions} />,
    );

    const freqMap = [
      { name: "year", value: 0 },
      { name: "month", value: 1 },
      { name: "week", value: 2 },
      { name: "day", value: 3 },
    ];

    for (const item of freqMap) {
      // Reset the mock for each iteration
      setRruleOptions.mockClear();

      // Open the dropdown and select an option
      const trigger = getTrigger();
      fireEvent.click(trigger);
      const option = screen.getByRole("option", { name: item.name });
      fireEvent.click(option);

      // Verify the callback was called
      expect(setRruleOptions).toHaveBeenCalled();

      // Extract and call the callback
      const callback = setRruleOptions.mock.calls[0]![0];
      const result = callback({ otherOption: true });

      // Verify the correct frequency was set
      expect(result).toEqual({
        otherOption: true,
        freq: item.value,
      });
    }
  });
});
