import {
  andThen,
  combine,
  err,
  fromThrowable,
  map,
  mapErr,
  match,
  ok,
  Result,
  unwrapOr,
} from "./mod.ts";

const r1: Result<number, string> = ok(42);
const r2: Result<number, string> = err("oops");

const r3 = map(ok(1), (x) => x * 10);
const r4 = map(err("fail"), (x) => x * 10);

const r5 = mapErr(err("fail"), (msg) => `error: ${msg}`);

const r6 = andThen(ok(5), (x) => ok(x + 1));
const r7 = andThen(err("fail"), (x) => ok(x + 1));

const v1: number = unwrapOr(ok(10), 0);
const v2: number = unwrapOr(err("oops"), 0);

const m1 = match(ok("yes"), {
  ok: (v) => `value: ${v}`,
  err: (e) => `error: ${e}`,
});
const m2 = match(err("no"), {
  ok: (v) => `value: ${v}`,
  err: (e) => `error: ${e}`,
});

const rc1 = combine([ok(1), ok(2), ok(3)]);
const rc2 = combine([ok(1), err("bad"), ok(3)]);

const safe = fromThrowable((x: number): number => JSON.parse('{"x":1}'));
const fail = fromThrowable(
  () => JSON.parse("{...}"),
  (e) => `parse fail: ${e}`,
);
