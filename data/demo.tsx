import { Box, Database, Package, Plug, SlidersHorizontal, Upload } from "lucide-react";
import type { SlideData } from "@/lib/types";
import { CodeBlock } from "@/components/CodeBlock";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { ConceptCard } from "@/components/ConceptCard";
import { ComparisonTable } from "@/components/ComparisonTable";
import { StateDiagram } from "@/components/StateDiagram";
import { DependencyGraph } from "@/components/DependencyGraph";
import { FAQ } from "@/components/FAQ";
import { KeyTakeaway } from "@/components/KeyTakeaway";

// SAMPLE DATA for testing components. Delete this file (and its import in slides.ts) when real content lands.
const A = "#7B42BC";
const note = "Sample notes. Press P to open the presenter window; notes show there, never on the audience screen.";

const code = `variable "env" {
  type    = string
  default = "dev"
}

resource "example_bucket" "logs" {
  name = "app-\${var.env}"
}`;

const concepts = [
  { icon: Plug, name: "Provider", text: "Plugin that talks to a platform's API." },
  { icon: Box, name: "Resource", text: "One piece of infrastructure to manage." },
  { icon: SlidersHorizontal, name: "Variable", text: "An input that changes behavior." },
  { icon: Upload, name: "Output", text: "A value exposed after apply." },
  { icon: Database, name: "State", text: "Terraform's record of what it manages." },
  { icon: Package, name: "Module", text: "A reusable group of resources." },
];

export const demoSlides: SlideData[] = [
  { id: "demo-code", section: "demo", type: "visual", title: "CodeBlock", subtitle: "Highlighting, line numbers, labels, copy", notes: note,
    body: <CodeBlock code={code} highlight={[6, 7]} labels={{ 1: "Input", 7: "Uses the variable" }} accent={A} /> },
  { id: "demo-architecture", section: "demo", type: "side", title: "ArchitectureDiagram", subtitle: "Sequential reveal, animated connections", notes: note,
    body: <ArchitectureDiagram accent={A} nodes={[
      { id: "c", label: "Configuration", edge: "parsed by" }, { id: "t", label: "Terraform Core", edge: "calls" },
      { id: "p", label: "Provider", edge: "requests" }, { id: "a", label: "Cloud API", edge: "creates" }, { id: "i", label: "Infrastructure" }]} /> },
  { id: "demo-workflow", section: "demo", type: "visual", title: "WorkflowDiagram", subtitle: "Highlight a step with `active`", notes: note,
    body: <WorkflowDiagram accent="#FF9900" active={["plan"]} steps={[
      { id: "init", label: "init", sub: "set up" }, { id: "validate", label: "validate", sub: "check" }, { id: "plan", label: "plan", sub: "preview" },
      { id: "apply", label: "apply", sub: "change" }, { id: "state", label: "state", sub: "record" }]} /> },
  { id: "demo-concepts", section: "demo", type: "visual", title: "ConceptCard", notes: note,
    body: <div className="grid w-full grid-cols-3 gap-6">{concepts.map((c) => <ConceptCard key={c.name} {...c} accent="#2DD4BF" />)}</div> },
  { id: "demo-comparison", section: "demo", type: "visual", title: "ComparisonTable", subtitle: "Sample data", notes: note,
    body: <ComparisonTable accent={A} focus={0} columns={["Terraform", "CloudFormation", "Pulumi", "Ansible", "AWS CDK"]} rows={[
      { label: "Language", cells: ["HCL", "JSON / YAML", "General-purpose languages", "YAML", "General-purpose languages"] },
      { label: "Scope", cells: ["Many platforms", "AWS only", "Many platforms", "Config management", "AWS only"] },
      { label: "State", cells: ["State file", "Managed by AWS", "State backend", "Stateless by default", "Via CloudFormation"] }]} /> },
  { id: "demo-state", section: "demo", type: "side", title: "StateDiagram", notes: note, body: <StateDiagram accent={A} /> },
  { id: "demo-dependency", section: "demo", type: "side", title: "DependencyGraph", subtitle: "Solid: implicit. Dashed: explicit.", notes: note,
    body: <DependencyGraph accent="#60A5FA" items={[{ id: "a", label: "Resource A", via: "implicit" }, { id: "b", label: "Resource B", via: "explicit" }, { id: "c", label: "Resource C" }]} /> },
  { id: "demo-faq", section: "demo", type: "visual", title: "FAQ", notes: note,
    body: <FAQ accent={A} items={[
      { q: "Is Terraform only for AWS?", a: "No. Providers let it manage many platforms." },
      { q: "Does plan change anything?", a: "No. It only previews what apply would do." },
      { q: "What if the state file is lost?", a: "Terraform loses track of what it manages. Remote state reduces that risk." }]} /> },
  { id: "demo-takeaway", section: "demo", type: "visual", title: "KeyTakeaway", notes: note,
    body: <KeyTakeaway accent={A} text="Describe the infrastructure you want. Terraform works out how to get there." points={["Declarative", "Repeatable", "Reviewable"]} /> },
];
