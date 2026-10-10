export function KeyTakeaway({ text, points, accent, title = "Key takeaway" }: { text: string; points?: string[]; accent: string; title?: string }) {
  return (
    <div className="w-full rounded-xl border border-line bg-panel p-16" style={{ boxShadow: `inset 8px 0 0 ${accent}` }}>
      <p className="font-mono text-2xl" style={{ color: accent }}>{title}</p>
      <p className="mt-6 text-6xl font-bold leading-tight">{text}</p>
      {points && (
        <div className="mt-10 flex flex-wrap gap-4">
          {points.map((p) => <span key={p} className="rounded-lg border px-5 py-3 text-3xl" style={{ borderColor: accent }}>{p}</span>)}
        </div>
      )}
    </div>
  );
}
