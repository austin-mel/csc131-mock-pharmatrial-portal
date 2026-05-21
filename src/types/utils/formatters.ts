export function pct(value: number | null): string {
  return value === null ? 'N/A' : `${value}%`;
}

export function joinList(values: string[]): string {
  return values.length ? values.join(', ') : 'None';
}
