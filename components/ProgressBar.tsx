export function ProgressBar({ index, total, accent }: { index: number; total: number; accent: string }) {
  const pct = total > 1 ? (index / (total - 1)) * 100 : 100;
  return (
    <div className="absolute inset-x-0 bottom-0 h-2 bg-line">
      <div className="h-full transition-all duration-200" style={{ width: `${pct}%`, background: accent }} />
    </div>
  );
}
