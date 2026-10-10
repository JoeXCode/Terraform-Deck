/** Presenter-only. Rendered by /presenter, never by the audience Deck. Lines marked FILL IN or PLACEHOLDER stand out. */
export function SpeakerNotes({ text, size = "text-2xl", className = "" }: { text?: string; size?: string; className?: string }) {
  const lines = text?.split("\n").filter(Boolean) ?? [];
  return (
    <section className={`rounded-xl border border-line bg-panel p-6 ${className}`}>
      <h2 className="mb-4 font-mono text-sm text-aws">Speaker notes</h2>
      {lines.length ? (
        <div className={`space-y-4 leading-relaxed ${size}`}>
          {lines.map((l, i) => <p key={i} className={/FILL IN|PLACEHOLDER/.test(l) ? "text-aws" : ""}>{l}</p>)}
        </div>
      ) : (
        <p className="text-xl text-mute">No notes for this slide.</p>
      )}
    </section>
  );
}
