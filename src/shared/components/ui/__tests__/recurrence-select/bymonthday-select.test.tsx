import { afterEach, describe, expect, it, vi } from "vitest";

import setMockViewport from "@/shared/components/layout/viewport-context/test-utils/setMockViewport";
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from "@/shared/lib/testing/test-utils";

import { BymonthdaySelect } from "../../recurrence-select/components/bymonthday-select";

setMockViewport("xl");

afterEach(() => {
  cleanup();
});

describe("BymonthdaySelect", () => {
  const defaultProps = {
    setRruleOptions: vi.fn(),
    bymonthday: [15], // 15th day of month
  };

  it("renders the select component with correct day", () => {
    render(<BymonthdaySelect {...defaultProps} />);

    const trigger = screen.getByTestId("bymonthday-select-trigger");
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveTextContent("15");
  });

  it("displays 'day' text next to the select", () => {
    render(<BymonthdaySelect {...defaultProps} />);

    const dayText = screen.getByText("day");
    expect(dayText).toBeInTheDocument();
    expect(dayText).toHaveClass("text-sm");
    expect(dayText).toHaveClass("text-muted-fg");
  });

  it("calls setRruleOptions with correct value when selection changes", () => {
    const setRruleOptions = vi.fn();
    render(
      <BymonthdaySelect setRruleOptions={setRruleOptions} bymonthday={[15]} />,
    );

    // Open the select dropdown
    const trigger = screen.getByTestId("bymonthday-select-trigger");
    fireEvent.click(trigger);

    // Find and click a different day option (e.g., 20)
    const option20 = screen.getByRole("option", { name: "20" });
    fireEvent.click(option20);

    // Verify setRruleOptions was called
    expect(setRruleOptions).toHaveBeenCalledOnce();

    // Extract and call the callback function passed to setRruleOptions
    const callback = setRruleOptions.mock.calls[0]?.[0];
    expect(callback).toBeDefined();
    if (!callback) return;

    const prevState = { freq: 3, interval: 1, bymonthday: [15] };
    const result = callback(prevState);

    // Verify the callback returns the expected object with updated bymonthday
    expect(result).toEqual({
      freq: 3,
      interval: 1,
      bymonthday: [20],
    });
  });

  it("should convert the selected value to a number", () => {
    const setRruleOptions = vi.fn();
    render(
      <BymonthdaySelect setRruleOptions={setRruleOptions} bymonthday={[15]} />,
    );

    // Open the select dropdown
    const trigger = screen.getByTestId("bymonthday-select-trigger");
    fireEvent.click(trigger);

    // Find and click a different day option
    const option5 = screen.getByRole("option", { name: "5" });
    fireEvent.click(option5);

    // Verify setRruleOptions was called once
    expect(setRruleOptions).toHaveBeenCalledOnce();

    // Extract the callback and test that it correctly processes the argument as a number
    const callback = setRruleOptions.mock.calls[0]?.[0];
    expect(callback).toBeDefined();
    if (!callback) return;

    const prevState = { someOtherProp: true, bymonthday: [15] };
    const result = callback(prevState);

    // Verify the bymonthday contains a number (not a string)
    expect(result.bymonthday[0]).toBe(5);
    expect(typeof result.bymonthday[0]).toBe("number");
  });
});
