import { ArchitectureDiagram } from "./ArchitectureDiagram";

type Item = { id: string; label: string; sub?: string; via?: "implicit" | "explicit" }; // via: how the NEXT item depends on this one

/** Solid = implicit (a reference). Dashed = explicit (depends_on). Arrows point in creation order. */
export function DependencyGraph({ items, accent }: { items: Item[]; accent: string }) {
  const nodes = items.map((i) => ({ id: i.id, label: i.label, sub: i.sub, edge: i.via === "explicit" ? "depends_on" : i.via ? "reference" : undefined, dashed: i.via === "explicit" }));
  return <ArchitectureDiagram nodes={nodes} accent={accent} />;
}
