import type { Section, SectionId } from "@/lib/types";

/** Top bar: section indicator (current section highlighted) and slide counter. */
export function SlideHeader({ sections, current, index, total }: { sections: Section[]; current: SectionId; index: number; total: number }) {
  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-between px-28 pt-8 font-mono text-xl">
      <div className="flex gap-10">
        {sections.filter((s) => s.num).map((s) => (
          <span key={s.id} style={s.id === current ? { color: s.accent } : undefined} className={s.id === current ? "border-b-2 pb-1" : "text-mute/70"}>
            <span className="mr-2 opacity-60">{s.num}</span>{s.label}
          </span>
        ))}
      </div>
      <span className="text-mute">{index + 1} / {total}</span>
    </div>
  );
}
