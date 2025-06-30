/**
 * Represents a value that can be either a success (`Ok`) or a failure (`Err`).
 */
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Creates a successful `Result` containing the given value.
 *
 * @param value - The value to wrap in `Ok`.
 * @returns A `Result` of type `Ok<T>`.
 */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/**
 * Creates a failed `Result` containing the given error.
 *
 * @param error - The error to wrap in `Err`.
 * @returns A `Result` of type `Err<E>`.
 */
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Checks whether a `Result` is `Ok`.
 *
 * @param res - The result to check.
 * @returns `true` if the result is `Ok`, otherwise `false`.
 */
export function isOk<T, E>(res: Result<T, E>): res is { ok: true; value: T } {
  return res.ok;
}

/**
 * Checks whether a `Result` is `Err`.
 *
 * @param res - The result to check.
 * @returns `true` if the result is `Err`, otherwise `false`.
 */
export function isErr<T, E>(res: Result<T, E>): res is { ok: false; error: E } {
  return !res.ok;
}

/**
 * Extracts the value from an `Ok` result.
 * Throws if the result is `Err`.
 *
 * @param res - The result to unwrap.
 * @returns The value inside the `Ok`.
 * @throws If the result is `Err`, throws an error with the contained error value.
 */
export function unwrap<T, E>(res: Result<T, E>): T {
  if (!res.ok) {
    throw new Error(
      `Tried to unwrap Err: ${
        typeof res.error === "string" ? res.error : JSON.stringify(res.error)
      }`,
    );
  }
  return res.value;
}
