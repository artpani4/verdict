import { err, ok, Result } from "./result.ts";

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
