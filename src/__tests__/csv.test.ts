import { expect, test } from "vitest";
import { toCsv } from "@/lib/csv";

test("emits header for empty row set", () => {
  const out = toCsv([], ["a", "b", "c"]);
  expect(out).toBe("a,b,c\n");
});

test("emits rows in column order", () => {
  const out = toCsv(
    [
      { a: 1, b: "two", c: 3 },
      { a: 4, b: "five", c: 6 },
    ],
    ["a", "b", "c"],
  );
  expect(out).toBe("a,b,c\n1,two,3\n4,five,6\n");
});

test("escapes commas by quoting", () => {
  const out = toCsv([{ name: "Smith, John" }], ["name"]);
  expect(out).toBe('name\n"Smith, John"\n');
});

test("escapes quotes by doubling them", () => {
  const out = toCsv([{ comment: 'She said "hi"' }], ["comment"]);
  expect(out).toBe('comment\n"She said ""hi"""\n');
});

test("escapes newlines", () => {
  const out = toCsv([{ note: "line 1\nline 2" }], ["note"]);
  expect(out).toBe('note\n"line 1\nline 2"\n');
});

test("omits missing values as empty strings", () => {
  const out = toCsv([{ a: 1 }], ["a", "b"]);
  expect(out).toBe("a,b\n1,\n");
});
