export function fake<T>() {
  return {} as T;
}

/**
 * @example
 * ```ts
 * expectType<...>(from<...>());
 * expectAssignable<...>(from<...>());
 * ```
 */
export function from<T>() {
  return {} as T;
}
