import {
  andThen,
  combine,
  err,
  expect,
  fromThrowable,
  isOk,
  map,
  mapErr,
  match,
  ok,
  Result,
  unwrap,
  unwrapOr,
  unwrapOrElse,
} from "./mod.ts";

function getRawAgeField(): Result<string, string> {
  return ok("21");
}

function parseAge(raw: string): Result<number, string> {
  const n = Number(raw);
  return Number.isNaN(n) ? err("not a number") : ok(n);
}

function validateAdult(age: number): Result<number, string> {
  return age >= 18 ? ok(age) : err("too young");
}

const ageResult: Result<number, string> = andThen(
  andThen(getRawAgeField(), parseAge),
  validateAdult,
);

const ageMessage = match(ageResult, {
  ok: (age) => `Access granted to user age ${age}`,
  err: (error) => `Access denied: ${error}`,
});
console.log("Age validation:", ageMessage);

if (isOk(ageResult)) {
  const confirmedAge: number = unwrap(ageResult);
  console.log("Confirmed age (unwrap):", confirmedAge);

  const doubledResult = map(ageResult, (age) => age * 2);
  console.log(
    "Double age (via map):",
    match(doubledResult, {
      ok: (val) => val,
      err: (e) => e,
    }),
  );
}

console.log("Age or fallback (unwrapOr):", unwrapOr(ageResult, 0));

const ageWithFallback = unwrapOrElse(ageResult, (error) => {
  console.warn("Error encountered:", error);
  return 18;
});
console.log("Age or fallback (unwrapOrElse):", ageWithFallback);

try {
  const expectedAge = expect(ageResult, "User age not valid");
  console.log("Expect returned:", expectedAge);
} catch (e) {
  console.error("Error from expect:", e);
}

const safeParse = fromThrowable(
  (input: string) => JSON.parse(input),
  (e): string => `Parse error: ${e}`,
);

const parsed = safeParse('{"a": 1}');
console.log(
  "Parsed JSON (ok):",
  match(parsed, {
    ok: (val) => val,
    err: (err) => `Error: ${err}`,
  }),
);

const faultyParsed = safeParse("invalid json");
console.log(
  "Parsed JSON (error):",
  match(faultyParsed, {
    ok: (val) => val,
    err: (err) => `Error: ${err}`,
  }),
);

const list1 = [ok(1), ok(2), ok(3)];
const combined1 = combine(list1);
console.log(
  "Combined Ok list:",
  match(combined1, {
    ok: (values) => `Values: ${values.join(", ")}`,
    err: (err) => `Error: ${err}`,
  }),
);

const list2 = [ok(1), err("error in second"), ok(3)];
const combined2 = combine(list2);
console.log(
  "Combined list with error:",
  match(combined2, {
    ok: (values) => `Values: ${values.join(", ")}`,
    err: (err) => `Error: ${err}`,
  }),
);
