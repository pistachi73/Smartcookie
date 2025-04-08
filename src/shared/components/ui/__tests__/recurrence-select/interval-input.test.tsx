import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { IntervalInput } from "../../recurrence-select/components/interval-input";

afterEach(() => {
  cleanup();
});

vi.mock("@/shared/hooks/use-media-query", () => ({
  useMediaQuery: vi.fn().mockReturnValue(false),
}));

describe("IntervalInput", () => {
  const defaultProps = {
    setRruleOptions: vi.fn(),
    interval: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default interval value of 1", () => {
    render(<IntervalInput {...defaultProps} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("1");
  });

  it("updates interval value on user input", () => {
    render(<IntervalInput {...defaultProps} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "3" } });

    expect(input).toHaveValue("3");
  });

  it("renders with custom interval", () => {
    render(<IntervalInput {...defaultProps} interval={2} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("2");
  });

  it("calls setRruleOptions with the new interval value", () => {
    const setRruleOptions = vi.fn();

    render(
      <IntervalInput {...defaultProps} setRruleOptions={setRruleOptions} />,
    );

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "3" } });
    fireEvent.blur(input);

    // Verify the callback was called
    expect(setRruleOptions).toHaveBeenCalled();

    // Extract and test the callback function
    const callback = setRruleOptions.mock.calls[0]![0];
    const prevState = { freq: 2, someOtherProp: true };
    const result = callback(prevState);

    // Verify the callback transforms the data correctly
    expect(result).toEqual({
      freq: 2,
      someOtherProp: true,
      interval: 3,
    });
  });
});
