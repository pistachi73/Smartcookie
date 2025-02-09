import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pickKeysByFilter<T extends Record<string, any>>(
  original: T,
  filter: Partial<Record<keyof T, boolean>>,
): Partial<T> {
  return Object.keys(filter).reduce(
    (result, key) => {
      const typedKey = key as keyof T; // Ensure type safety for the key
      if (filter[typedKey] && typedKey in original) {
        result[typedKey] = original[typedKey];
      }
      return result;
    },
    {} as Partial<T>,
  );
}
