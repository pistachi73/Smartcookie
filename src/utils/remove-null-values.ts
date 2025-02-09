// A mapped type that removes keys whose type is exactly `null`
// and removes `null` from any union type.
type RemoveNulls<T> = {
  [K in keyof T as [T[K]] extends [null] ? never : K]: Exclude<T[K], null>;
};

export function removeNullValues<T extends object>(obj: T): RemoveNulls<T> {
  const result = {} as any;
  for (const key in obj) {
    if (obj[key] !== null) {
      // only add properties that are not null
      result[key] = obj[key];
    }
  }
  return result;
}
