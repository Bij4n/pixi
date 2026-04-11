import { expect, test, beforeEach } from "vitest";
import { rateLimit, _resetBuckets } from "@/lib/rate-limit";

beforeEach(() => {
  _resetBuckets();
});

test("allows requests up to capacity", () => {
  for (let i = 0; i < 5; i++) {
    const r = rateLimit("a", { capacity: 5, refillRate: 1 });
    expect(r.allowed).toBe(true);
  }
});

test("blocks the 6th burst request when capacity is 5", () => {
  for (let i = 0; i < 5; i++) rateLimit("b", { capacity: 5, refillRate: 1 });
  const sixth = rateLimit("b", { capacity: 5, refillRate: 1 });
  expect(sixth.allowed).toBe(false);
});

test("different keys have independent buckets", () => {
  for (let i = 0; i < 5; i++) rateLimit("x", { capacity: 5, refillRate: 1 });
  const otherKey = rateLimit("y", { capacity: 5, refillRate: 1 });
  expect(otherKey.allowed).toBe(true);
});

test("refills tokens over time", async () => {
  for (let i = 0; i < 5; i++) rateLimit("c", { capacity: 5, refillRate: 100 });
  // With refillRate 100/sec, 10ms should give us 1 token back
  await new Promise((r) => setTimeout(r, 20));
  const after = rateLimit("c", { capacity: 5, refillRate: 100 });
  expect(after.allowed).toBe(true);
});
