type Row = { label: string; cells: string[] };

export function ComparisonTable({ columns, rows, focus = 0, accent }: { columns: string[]; rows: Row[]; focus?: number; accent: string }) {
  const tint = (i: number) => (i === focus ? { background: accent + "14" } : undefined);
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line bg-panel">
      <table className="w-full border-collapse text-2xl">
        <thead>
          <tr>
            <th className="p-4" />
            {columns.map((c, i) => (
              <th key={c} className="px-5 py-4 text-left text-3xl font-semibold" style={i === focus ? { ...tint(i), color: accent } : undefined}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-t border-line">
              <td className="px-5 py-4 font-mono text-2xl text-mute">{r.label}</td>
              {r.cells.map((c, i) => <td key={i} className="px-5 py-4" style={tint(i)}>{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
