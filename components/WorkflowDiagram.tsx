import { ArchitectureDiagram, DiagramNode } from "./ArchitectureDiagram";

export function WorkflowDiagram({ steps, active, accent }: { steps: DiagramNode[]; active?: string[]; accent: string }) {
  return <ArchitectureDiagram nodes={steps} direction="row" highlight={active} accent={accent} />;
}
