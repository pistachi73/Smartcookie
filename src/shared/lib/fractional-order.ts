import { generateKeyBetween, generateNKeysBetween } from "fractional-indexing";

/**
 * Generate a fractional order key between two existing keys
 */
export function generateOrderBetween(
  before: string | null,
  after: string | null,
): string {
  return generateKeyBetween(before, after);
}

/**
 * Generate multiple fractional order keys between two existing keys
 */
export function generateOrdersBetween(
  before: string | null,
  after: string | null,
  count: number,
): string[] {
  return generateNKeysBetween(before, after, count);
}

/**
 * Generate the first order key for a new list
 */
export function generateFirstOrder(): string {
  return generateKeyBetween(null, null);
}

/**
 * Generate an order key at the end of a list
 */
export function generateLastOrder(lastOrder: string): string {
  return generateKeyBetween(lastOrder, null);
}

/**
 * Generate an order key at the beginning of a list
 */
export function generateFirstOrderBefore(firstOrder: string): string {
  return generateKeyBetween(null, firstOrder);
}

/**
 * Insert an item at a specific position in an ordered list
 */
export function insertAtPosition<T extends { order: string }>(
  items: T[],
  position: number,
): string {
  const sortedItems = [...items].sort((a, b) => a.order.localeCompare(b.order));

  if (position <= 0) {
    // Insert at beginning
    return sortedItems.length > 0
      ? generateFirstOrderBefore(sortedItems[0]!.order)
      : generateFirstOrder();
  }

  if (position >= sortedItems.length) {
    // Insert at end
    return sortedItems.length > 0
      ? generateLastOrder(sortedItems[sortedItems.length - 1]!.order)
      : generateFirstOrder();
  }

  // Insert between two items
  const before = sortedItems[position - 1]?.order || null;
  const after = sortedItems[position]?.order || null;

  return generateOrderBetween(before, after);
}
