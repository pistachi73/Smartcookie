import { groupOverlappingOccurrences } from "../group-overlapping-occurrences";
import { groupedSessionOccurrences, mockSessionOccurrences } from "./__mock__";

describe("groupOverlappingOccurrences", () => {
  it("should group overlapping sessions", () => {
    const groupedOccurrences = groupOverlappingOccurrences(
      mockSessionOccurrences,
    );

    expect(groupedOccurrences).toEqual(groupedSessionOccurrences);
  });
});
