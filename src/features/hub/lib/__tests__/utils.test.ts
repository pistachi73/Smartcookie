import { describe, expect, it } from "vitest";
import { getHubDuration } from "../utils";

describe("getHubDuration", () => {
  it("should return duration in weeks rounded to nearest integer", () => {
    const weeks1 = getHubDuration("2023-01-01", "2023-01-08");
    expect(weeks1).toBe(1);

    const weeks2 = getHubDuration("2023-01-01", "2023-01-15");
    expect(weeks2).toBe(2);

    const weeks3 = getHubDuration("2023-01-01", "2023-01-04");
    expect(weeks3).toBe(0);

    const weeks4 = getHubDuration("2023-01-01", "2023-02-12");
    expect(weeks4).toBe(6);

    const weeks5 = getHubDuration("2023-01-01", "2023-01-05");
    expect(weeks5).toBe(1);
  });
});
