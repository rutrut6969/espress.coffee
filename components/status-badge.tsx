export function StatusBadge({ value }: { value: string }) {
  return <span className="pill">{value.toLowerCase().replaceAll("_", " ")}</span>;
}
