export interface CsvRow {
  [key: string]: string;
}

export interface ParsedCsv {
  headers: string[];
  rows: CsvRow[];
}

export function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}

export function parseCsvWithHeaders(text: string): ParsedCsv {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const headers = lines[0] ? parseCsvLine(lines[0]).map((header) => header.trim()) : [];
  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce<CsvRow>((row, header, index) => {
      row[header] = values[index] ?? '';
      return row;
    }, {});
  });

  return { headers, rows };
}

export function parseCsv(text: string): CsvRow[] {
  return parseCsvWithHeaders(text).rows;
}
