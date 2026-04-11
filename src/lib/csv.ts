// Tiny CSV serializer. Adequate for small-to-medium exports; not streaming.

function escape(value: string | number | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function toCsv(
  rows: Array<Record<string, string | number | null | undefined>>,
  columns: string[],
): string {
  const header = columns.map(escape).join(",");
  const body = rows
    .map((row) => columns.map((col) => escape(row[col])).join(","))
    .join("\n");
  return body ? `${header}\n${body}\n` : `${header}\n`;
}
