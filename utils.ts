import { err, ok, Result } from "./result.ts";

/**
 * Transforms the value inside an `Ok` using a function.
 * Returns the original `Err` if the result is not `Ok`.
 *
 * @param res - The input `Result`.
 * @param fn - Function to apply to the `Ok` value.
 * @returns A new `Result` with the transformed value or the original error.
 */
export function map<T, E, U>(
  res: Result<T, E>,
  fn: (val: T) => U,
): Result<U, E> {
  return res.ok ? ok(fn(res.value)) : err(res.error);
}

/**
 * Transforms the error inside an `Err` using a function.
 * Returns the original `Ok` if the result is not `Err`.
 *
 * @param res - The input `Result`.
 * @param fn - Function to apply to the `Err` error.
 * @returns A new `Result` with the transformed error or the original value.
 */
export function mapErr<T, E, F>(
  res: Result<T, E>,
  fn: (err: E) => F,
): Result<T, F> {
  return res.ok ? ok(res.value) : err(fn(res.error));
}

/**
 * Chains a computation onto an `Ok` result.
 * Useful for composing multiple `Result`-returning operations.
 *
 * @param res - The input `Result`.
 * @param fn - Function to apply to the value if `res` is `Ok`.
 * @returns The result of `fn`, or the original `Err`.
 */
export function andThen<T, E, U, F>(
  res: Result<T, E>,
  fn: (val: T) => Result<U, F>,
): Result<U, E | F> {
  return res.ok ? fn(res.value) : err(res.error);
}

/**
 * Returns the value if `Ok`, otherwise returns a fallback value.
 *
 * @param res - The input `Result`.
 * @param fallback - Value to return if `res` is `Err`.
 * @returns The unwrapped value or the fallback.
 */
export function unwrapOr<T, E>(res: Result<T, E>, fallback: T): T {
  return res.ok ? res.value : fallback;
}

/**
 * Returns the value if `Ok`, otherwise returns the result of a fallback function.
 *
 * @param res - The input `Result`.
 * @param fallbackFn - Function to call with the error if `res` is `Err`.
 * @returns The unwrapped value or the fallback function's result.
 */
export function unwrapOrElse<T, E>(
  res: Result<T, E>,
  fallbackFn: (err: E) => T,
): T {
  return res.ok ? res.value : fallbackFn(res.error);
}

/**
 * Returns the value if `Ok`, otherwise throws an error with a custom message.
 *
 * @param res - The input `Result`.
 * @param message - Message to use in the thrown error.
 * @returns The unwrapped value or throws.
 */
export function expect<T, E>(
  res: Result<T, E>,
  message: string,
): T {
  if (!res.ok) {
    throw new Error(
      `${message}: ${
        typeof res.error === "string" ? res.error : JSON.stringify(res.error)
      }`,
    );
  }
  return res.value;
}

/**
 * Pattern-matching helper to handle both `Ok` and `Err` cases.
 *
 * @param res - The input `Result`.
 * @param cases - Handlers for both the `ok` and `err` variants.
 * @returns The result of the appropriate handler.
 */
export function match<T, E, U>(
  res: Result<T, E>,
  cases: { ok: (val: T) => U; err: (err: E) => U },
): U {
  return res.ok ? cases.ok(res.value) : cases.err(res.error);
}

/**
 * Combines multiple `Result` values into one.
 * Returns `Ok` with an array of values if all inputs are `Ok`,
 * otherwise returns the first encountered `Err`.
 *
 * @param results - Array of `Result` values.
 * @returns A single `Result` with either all values or the first error.
 */
export function combine<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const r of results) {
    if (!r.ok) return err(r.error);
    values.push(r.value);
  }
  return ok(values);
}
