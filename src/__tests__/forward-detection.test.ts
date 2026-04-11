import { expect, test } from "vitest";
import { detectForwards, countForwards } from "@/lib/forward-detection";
import type { Event } from "@/db/schema";

function makeEvent(
  ip: string | null,
  secondsAgo: number,
  overrides: Partial<Event> = {},
): Event {
  return {
    id: `evt-${ip}-${secondsAgo}`,
    imageId: "img-1",
    ip,
    userAgent: "test",
    referer: null,
    createdAt: new Date(Date.now() - secondsAgo * 1000),
    ...overrides,
  };
}

test("returns empty for no events", () => {
  expect(detectForwards([])).toEqual([]);
});

test("single IP is the original recipient with no forwards", () => {
  const events = [makeEvent("1.1.1.1", 10), makeEvent("1.1.1.1", 5)];
  const result = detectForwards(events);
  expect(result.length).toBe(1);
  expect(result[0].isOriginal).toBe(true);
  expect(result[0].opens).toBe(2);
  expect(countForwards(result)).toBe(0);
});

test("second IP is detected as a forward", () => {
  const events = [
    makeEvent("1.1.1.1", 100), // original
    makeEvent("2.2.2.2", 50), // forward
  ];
  const result = detectForwards(events);
  expect(result.length).toBe(2);
  expect(result[0].ip).toBe("1.1.1.1");
  expect(result[0].isOriginal).toBe(true);
  expect(result[1].ip).toBe("2.2.2.2");
  expect(result[1].isOriginal).toBe(false);
  expect(countForwards(result)).toBe(1);
});

test("sorts by first-seen so earliest IP is original", () => {
  // Events arrive out of order; we should still pick the earliest-seen as original
  const events = [
    makeEvent("2.2.2.2", 30),
    makeEvent("1.1.1.1", 100),
    makeEvent("2.2.2.2", 20),
  ];
  const result = detectForwards(events);
  expect(result[0].ip).toBe("1.1.1.1");
  expect(result[0].isOriginal).toBe(true);
});

test("ignores events with null IP", () => {
  const events = [makeEvent(null, 50), makeEvent("1.1.1.1", 30)];
  const result = detectForwards(events);
  expect(result.length).toBe(1);
  expect(result[0].ip).toBe("1.1.1.1");
});

test("tracks opens correctly per IP", () => {
  const events = [
    makeEvent("1.1.1.1", 100),
    makeEvent("1.1.1.1", 80),
    makeEvent("1.1.1.1", 60),
    makeEvent("2.2.2.2", 40),
  ];
  const result = detectForwards(events);
  expect(result[0].opens).toBe(3);
  expect(result[1].opens).toBe(1);
});
