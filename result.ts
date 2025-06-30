export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isOk<T, E>(res: Result<T, E>): res is { ok: true; value: T } {
  return res.ok;
}

export function isErr<T, E>(res: Result<T, E>): res is { ok: false; error: E } {
  return !res.ok;
}

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
