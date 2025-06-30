import { err, ok, Result } from "./result.ts";

/**
 * Wraps a potentially throwing function in a safe `Result`.
 *
 * Converts exceptions into `Err`, preserving type safety and avoiding runtime crashes.
 *
 * @typeParam Fn - A function that may throw.
 * @typeParam E - The error type to return in `Err`.
 *
 * @param fn - A function to execute safely.
 * @param mapError - Optional function to map a caught exception into an `E` type.
 *
 * @returns A new function that returns a `Result`:
 *          - `Ok` with the result of `fn` if it succeeds.
 *          - `Err` with the mapped error if `fn` throws.
 *
 * @example
 * ```ts
 * const safeJson = fromThrowable(JSON.parse, e => new Error("Invalid JSON"));
 * const result = safeJson("{ \"x\": 1 }"); // => Ok({ x: 1 })
 * const error = safeJson("{");             // => Err(Error("Invalid JSON"))
 * ```
 */
export function fromThrowable<Fn extends (...args: any[]) => any, E = unknown>(
  fn: Fn,
  mapError?: (e: unknown) => E,
): (...args: Parameters<Fn>) => Result<ReturnType<Fn>, E> {
  return (...args: Parameters<Fn>): Result<ReturnType<Fn>, E> => {
    try {
      return ok(fn(...args));
    } catch (e) {
      return err(mapError ? mapError(e) : (e as E));
    }
  };
}
