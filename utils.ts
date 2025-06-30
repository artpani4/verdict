import { err, ok, Result } from "./result.ts";

export function map<T, E, U>(
  res: Result<T, E>,
  fn: (val: T) => U,
): Result<U, E> {
  return res.ok ? ok(fn(res.value)) : err(res.error);
}

export function mapErr<T, E, F>(
  res: Result<T, E>,
  fn: (err: E) => F,
): Result<T, F> {
  return res.ok ? ok(res.value) : err(fn(res.error));
}

export function andThen<T, E, U, F>(
  res: Result<T, E>,
  fn: (val: T) => Result<U, F>,
): Result<U, E | F> {
  return res.ok ? fn(res.value) : err(res.error);
}

export function unwrapOr<T, E>(res: Result<T, E>, fallback: T): T {
  return res.ok ? res.value : fallback;
}

export function unwrapOrElse<T, E>(
  res: Result<T, E>,
  fallbackFn: (err: E) => T,
): T {
  return res.ok ? res.value : fallbackFn(res.error);
}

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

export function match<T, E, U>(
  res: Result<T, E>,
  cases: { ok: (val: T) => U; err: (err: E) => U },
): U {
  return res.ok ? cases.ok(res.value) : cases.err(res.error);
}

export function combine<T, E>(results: Result<T, E>[]): Result<T[], E> {
  const values: T[] = [];
  for (const r of results) {
    if (!r.ok) return err(r.error);
    values.push(r.value);
  }
  return ok(values);
}
