import { describe, expect, it } from "vitest";

import {
  findOverlappingIntervals,
  hasOverlappingIntervals,
} from "../find-overlapping-sessions";

describe("findOverlappingIntervals", () => {
  it("should return empty array for empty input", () => {
    const intervals: [number, number][] = [];
    expect(findOverlappingIntervals(intervals)).toEqual([]);
  });

  it("should return empty array for single interval", () => {
    const intervals: [number, number][] = [[1, 5]];
    expect(findOverlappingIntervals(intervals)).toEqual([]);
  });

  it("should return empty array when no overlaps exist", () => {
    const intervals: [number, number][] = [
      [1, 3],
      [4, 6],
      [7, 9],
    ];
    expect(findOverlappingIntervals(intervals)).toEqual([]);
  });

  it("should detect basic overlapping intervals", () => {
    const intervals: [number, number][] = [
      [1, 5],
      [3, 7],
    ];
    expect(findOverlappingIntervals(intervals)).toEqual([[0, 1]]);
  });

  it("should detect multiple overlaps", () => {
    const intervals: [number, number][] = [
      [1, 5],
      [2, 6],
      [4, 8],
    ];
    // First overlaps with second, first overlaps with third, second overlaps with third
    expect(findOverlappingIntervals(intervals).sort()).toEqual(
      [
        [0, 1],
        [0, 2],
        [1, 2],
      ].sort(),
    );
  });

  it("should handle complete overlaps where one interval contains another", () => {
    const intervals: [number, number][] = [
      [1, 10],
      [3, 7],
    ];
    expect(findOverlappingIntervals(intervals)).toEqual([[0, 1]]);
  });

  it("should handle intervals that touch exactly at endpoints", () => {
    const intervals: [number, number][] = [
      [1, 3],
      [3, 5],
      [5, 7],
    ];
    // Intervals that just touch should not be considered overlapping
    expect(findOverlappingIntervals(intervals)).toEqual([]);
  });

  it("should handle negative time values", () => {
    const intervals: [number, number][] = [
      [-5, -1],
      [-3, 2],
    ];
    expect(findOverlappingIntervals(intervals)).toEqual([[0, 1]]);
  });

  it("should handle multiple overlapping intervals correctly", () => {
    const intervals: [number, number][] = [
      [1, 3],
      [2, 4],
      [5, 7],
      [6, 8],
      [9, 11],
      [10, 12],
      [12, 14],
    ];

    // Expected overlaps: [0,1], [2,3], [4,5]
    expect(findOverlappingIntervals(intervals).sort()).toEqual(
      [
        [0, 1],
        [2, 3],
        [4, 5],
      ].sort(),
    );
  });
});

describe("hasOverlappingIntervals", () => {
  it("should return false for empty input", () => {
    const intervals: [number, number][] = [];
    expect(hasOverlappingIntervals(intervals)).toBe(false);
  });

  it("should return false for single interval", () => {
    const intervals: [number, number][] = [[1, 5]];
    expect(hasOverlappingIntervals(intervals)).toBe(false);
  });

  it("should return false when no overlaps exist", () => {
    const intervals: [number, number][] = [
      [1, 3],
      [4, 6],
      [7, 9],
    ];
    expect(hasOverlappingIntervals(intervals)).toBe(false);
  });

  it("should return true for basic overlapping intervals", () => {
    const intervals: [number, number][] = [
      [1, 5],
      [3, 7],
    ];
    expect(hasOverlappingIntervals(intervals)).toBe(true);
  });

  it("should return true when one interval contains another", () => {
    const intervals: [number, number][] = [
      [1, 10],
      [3, 7],
    ];
    expect(hasOverlappingIntervals(intervals)).toBe(true);
  });

  it("should return false for intervals that touch exactly at endpoints", () => {
    const intervals: [number, number][] = [
      [1, 3],
      [3, 5],
    ];
    expect(hasOverlappingIntervals(intervals)).toBe(false);
  });

  it("should return true for multiple overlapping intervals", () => {
    const intervals: [number, number][] = [
      [1, 5],
      [8, 12],
      [4, 9],
    ];
    expect(hasOverlappingIntervals(intervals)).toBe(true);
  });

  it("should handle negative time values", () => {
    const intervals: [number, number][] = [
      [-5, -1],
      [-3, 2],
    ];
    expect(hasOverlappingIntervals(intervals)).toBe(true);
  });
});
