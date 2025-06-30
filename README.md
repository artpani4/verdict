# verdict

[![JSR Score](https://jsr.io/badges/@artpani/verdict/score)](https://jsr.io/@artpani/verdict)

A minimal `Result<T, E>` implementation for TypeScript. No exceptions — just
safe, functional error handling.

## Installation

```sh
deno add jsr:@artpani/verdict
```

## Usage

```ts
import * as verdict from "jsr:@artpani/verdict";

const { ok, err, andThen, match, map, unwrapOr } = verdict;

function parseIntSafe(input: string): verdict.Result<number, string> {
  const n = Number(input);
  return Number.isNaN(n) ? err("not a number") : ok(n);
}

const result = parseIntSafe("123");
console.log(
  match(result, {
    ok: (n) => `Parsed: ${n}`,
    err: (e) => `Failed: ${e}`,
  }),
);
```

## API

### Core types

- `Result<T, E>` — union type:
  `{ ok: true, value: T } | { ok: false, error: E }`

### Constructors

- `ok(value)` — creates a successful result
- `err(error)` — creates a failed result

### Guards

- `isOk(res)` — true if `res.ok === true`
- `isErr(res)` — true if `res.ok === false`

### Combinators

- `map(res, fn)` — maps the `value` if `ok`
- `mapErr(res, fn)` — maps the `error` if `err`
- `andThen(res, fn)` — chains `Result<T, E>` → `Result<U, F>`

### Match & Extraction

- `match(res, { ok, err })` — pattern match on result
- `unwrap(res)` — returns value or throws if `err`
- `expect(res, msg)` — like `unwrap`, but with custom error message
- `unwrapOr(res, fallback)` — returns value or fallback
- `unwrapOrElse(res, fn)` — returns value or calls fallback function with error

### Utils

- `combine(results[])` — converts `Result<T, E>[]` to `Result<T[], E>`
- `fromThrowable(fn, mapErr?)` — wraps a throwing function into `Result`
