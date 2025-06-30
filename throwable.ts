import { err, ok, Result } from "./result.ts";

export function fromThrowable<Args extends unknown[], T, E = unknown>(
  fn: (...args: Args) => T,
  mapError?: (e: unknown) => E,
): (...args: Args) => Result<T, E> {
  return (...args: Args): Result<T, E> => {
    try {
      return ok(fn(...args));
    } catch (e) {
      return err(mapError ? mapError(e) : (e as E));
    }
  };
}
