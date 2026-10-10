import { ArchitectureDiagram } from "./ArchitectureDiagram";

const nodes = [
  { id: "config", label: "Configuration", sub: "desired state", edge: "read" },
  { id: "terraform", label: "Terraform", sub: "plan + apply", edge: "records" },
  { id: "state", label: "State", sub: "what Terraform tracks", edge: "maps to" },
  { id: "infra", label: "Infrastructure", sub: "actual state" },
];

export function StateDiagram({ accent, highlight, direction = "col" }: { accent: string; highlight?: string[]; direction?: "col" | "row" }) {
  return <ArchitectureDiagram nodes={nodes} direction={direction} highlight={highlight} accent={accent} />;
}
