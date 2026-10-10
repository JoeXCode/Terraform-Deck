import { Fragment } from "react";
import { Connector } from "./Connector";
import { NodeBox } from "./NodeBox";

export type DiagramNode = { id: string; label: string; sub?: string; edge?: string; dashed?: boolean };

/** Nodes revealed in sequence, joined by animated connectors. `highlight` dims everything else. */
export function ArchitectureDiagram({
  nodes,
  direction = "col",
  highlight,
  accent,
  startDelay = 0,
  compact,
}: {
  startDelay?: number;
  nodes: DiagramNode[];
  direction?: "col" | "row";
  highlight?: string[];
  accent: string;
  compact?: boolean;
}) {
  const col = direction === "col";
  const isCompact = compact ?? (direction === "row" && nodes.length >= 3);
  return (
    <div className={`flex items-center ${col ? "flex-col" : "w-full justify-between gap-1"}`}>
      {nodes.map((n, i) => {
        const next = nodes[i + 1];
        const on = (id: string) => !highlight || highlight.includes(id);
        return (
          <Fragment key={n.id}>
            <NodeBox
              label={n.label}
              sub={n.sub}
              accent={accent}
              delay={startDelay + i * 0.18}
              state={!highlight ? "normal" : on(n.id) ? "active" : "dim"}
              compact={isCompact}
            />
            {next && (
              <Connector
                vertical={col}
                label={n.edge}
                accent={accent}
                dashed={n.dashed}
                delay={startDelay + i * 0.18 + 0.12}
                dim={!(on(n.id) && on(next.id))}
                compact={isCompact}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
