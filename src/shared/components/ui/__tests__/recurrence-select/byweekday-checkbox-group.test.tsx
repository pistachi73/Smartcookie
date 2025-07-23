import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ByweekdayCheckboxGroup } from "../../recurrence-select/components/byweekday-checkbox-group";

afterEach(() => {
  cleanup();
});

describe("ByweekdayCheckboxGroup", () => {
  const defaultProps = {
    setRruleOptions: vi.fn(),
    byweekday: [0], // Monday
  };

  it("renders all weekday checkboxes", () => {
    render(<ByweekdayCheckboxGroup {...defaultProps} />);

    // Check if all 7 weekday checkboxes are rendered
    const checkboxes = screen.getAllByRole("button");
    expect(checkboxes).toHaveLength(7);

    // Check if Monday is checked by default (since byweekday contains 0)
    expect(checkboxes[0]).toHaveAttribute("data-selected", "true");
  });

  it("toggles weekday selection when clicked", () => {
    const setRruleOptions = vi.fn();
    render(
      <ByweekdayCheckboxGroup
        setRruleOptions={setRruleOptions}
        byweekday={[0]}
      />,
    );

    // Initially Monday (index 0) should be checked
    const checkboxes = screen.getAllByRole("button");
    expect(checkboxes[0]).toHaveAttribute("data-selected", "true");

    // Click on Wednesday (index 2) to select it
    fireEvent.click(checkboxes[2]!);

    // Verify that setRruleOptions was called with a function
    expect(setRruleOptions).toHaveBeenCalledOnce();

    // Extract and call the callback function that was passed to setRruleOptions
    const callback = setRruleOptions.mock.calls[0]![0] as (prev: any) => any;
    const result = callback({ otherOption: "test" });

    // Verify the callback returns the expected object with sorted byweekday values
    expect(result).toEqual({
      otherOption: "test",
      byweekday: [0, 2],
    });
  });

  it("handles multiple weekday selections", () => {
    const props = {
      setRruleOptions: vi.fn(),
      byweekday: [0, 2, 4], // Monday, Wednesday, Friday
    };

    render(<ByweekdayCheckboxGroup {...props} />);

    const checkboxes = screen.getAllByRole("button");

    // Check if Monday (0), Wednesday (2), and Friday (4) are checked
    expect(checkboxes[0]).toHaveAttribute("data-selected", "true");
    expect(checkboxes[2]).toHaveAttribute("data-selected", "true");
    expect(checkboxes[4]).toHaveAttribute("data-selected", "true");

    // Check if other days are not checked
    expect(checkboxes[1]).not.toHaveAttribute("data-selected", "true"); // Tuesday
    expect(checkboxes[3]).not.toHaveAttribute("data-selected", "true"); // Thursday
    expect(checkboxes[5]).not.toHaveAttribute("data-selected", "true"); // Saturday
    expect(checkboxes[6]).not.toHaveAttribute("data-selected", "true"); // Sunday
  });

  it("should not call setRruleOptions when diselecting all checkboxes", () => {
    const setRruleOptions = vi.fn();
    render(
      <ByweekdayCheckboxGroup
        setRruleOptions={setRruleOptions}
        byweekday={[0]}
      />,
    );

    const checkboxes = screen.getAllByRole("button");

    // Try to deselect the only checked item (which should be prevented by the component)
    fireEvent.click(checkboxes[0]!);
    expect(setRruleOptions).not.toHaveBeenCalled();
  });

  it("should call setRruleOptions when selecting additional checkboxes sorted by day of week", () => {
    // Create a mock function
    const setRruleOptions = vi.fn();

    render(
      <ByweekdayCheckboxGroup
        setRruleOptions={setRruleOptions}
        byweekday={[0, 1, 5]}
      />,
    );

    const checkboxes = screen.getAllByRole("button");
    fireEvent.click(checkboxes[2]!);

    // Verify setRruleOptions was called once
    expect(setRruleOptions).toHaveBeenCalledOnce();

    // Extract and call the callback function that was passed to setRruleOptions
    const callback = setRruleOptions.mock.calls[0]![0] as (prev: any) => any;
    const prevState = { someOtherProp: true, byweekday: [0, 1, 5] };
    const result = callback(prevState);

    // Verify the callback returns the correct sorted array of days
    expect(result).toEqual({
      someOtherProp: true,
      byweekday: [0, 1, 2, 5],
    });
  });
});
