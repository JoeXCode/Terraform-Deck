// ARCHIVE of the earlier Saad draft (architecture slide, benefits/use cases/limitations). Not imported anywhere.
import { CircleCheck, Layers, TriangleAlert } from "lucide-react";
import type { SlideData } from "@/lib/types";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCard } from "@/components/ConceptCard";
import { KeyTakeaway } from "@/components/KeyTakeaway";
import { ProjectExample } from "@/components/ProjectExample";

// Saad: Fundamentals. "What is Terraform and why does it exist?"
// The HCL below is a generic AWS example, NOT taken from the reference project.
const P = "#7B42BC", O = "#FF9900", T = "#2DD4BF";

const hcl = `resource "aws_s3_bucket" "logs" {
  bucket = "example-logs-bucket"
  tags = {
    Env = "dev"
  }
}`;

export const fundamentalsSlides: SlideData[] = [
  {
    id: "fundamentals-intro", section: "fundamentals", type: "section", title: "Fundamentals",
    notes: "Start with the question: what is Terraform, and why does it exist?\nThe next four slides tell one story: a problem, a new way of working, the tool that implements it, and where it fits and where it does not.",
  },
  {
    id: "fund-problem", section: "fundamentals", type: "visual", title: "Clicking doesn't scale",
    subtitle: "Infrastructure as Code: manage infrastructure through versioned, machine-readable files.",
    body: (
      <div className="w-full space-y-10">
        <div>
          <p className="mb-8 font-mono text-2xl" style={{ color: O }}>Before IaC</p>
          <ArchitectureDiagram direction="row" accent={O} nodes={[
            { id: "b1", label: "Console clicks", sub: "manual" }, { id: "b2", label: "Environment", sub: "built by hand" },
            { id: "b3", label: "Second copy", sub: "recreated by hand" }, { id: "b4", label: "Differences", sub: "hard to spot" }]} />
        </div>
        <div>
          <p className="mb-8 font-mono text-2xl" style={{ color: P }}>With IaC</p>
          <ArchitectureDiagram direction="row" accent={P} nodes={[
            { id: "a1", label: "Code", sub: "in Git" }, { id: "a2", label: "Review", sub: "pull request" },
            { id: "a3", label: "terraform apply", sub: "same config" }, { id: "a4", label: "Environment", sub: "repeatable" }]} />
        </div>
        <ProjectExample what="One real fact from the reference project for the 'with IaC' side. Fill from project files." />
      </div>
    ),
    notes: "Ask: how would you build ten identical environments by clicking in a console? Manual work is slow, hard to repeat, and leaves no record of what changed.\nScripts help, but you handle ordering and re-runs yourself.\nInfrastructure as Code means defining infrastructure in files that live in version control, so changes can be reviewed like application code.\nTHE ORANGE PLACEHOLDER: replace it with one real fact from the reference project before presenting.",
  },
  {
    id: "fund-terraform", section: "fundamentals", type: "visual", title: "What is Terraform?",
    subtitle: "An Infrastructure as Code tool from HashiCorp. You describe the result; Terraform works out the steps.",
    body: (
      <div className="w-full">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <p className="mb-6 font-mono text-2xl" style={{ color: O }}>Imperative: you write the steps</p>
            <ArchitectureDiagram accent={O} nodes={[
              { id: "i1", label: "Create the bucket" }, { id: "i2", label: "Add the tag" }, { id: "i3", label: "Handle re-runs yourself" }]} />
          </div>
          <div>
            <p className="mb-6 font-mono text-2xl" style={{ color: P }}>Declarative: you describe the result</p>
            <CodeBlock code={hcl} accent={P} highlight={[2, 3, 4, 5]} />
          </div>
        </div>
        <p className="mt-8 text-3xl text-mute">Terraform compares what you described with what exists, then plans the difference.</p>
      </div>
    ),
    notes: "Terraform is an Infrastructure as Code tool from HashiCorp. Its configuration language is HCL.\nImperative means you spell out each step and handle the cases yourself. Declarative means you state the end result, and the tool plans the actions needed to reach it.\nThe code shown is a generic AWS S3 example for syntax, NOT from the reference project.\nIf asked about licensing: HashiCorp moved Terraform to the Business Source License in 2023, and OpenTofu is a community fork.",
  },
  {
    id: "fund-architecture", section: "fundamentals", type: "side", title: "How Terraform fits",
    subtitle: "Core also keeps state: a record of what it manages.",
    body: (
      <div className="flex w-full items-center gap-10">
        <ArchitectureDiagram accent={P} nodes={[
          { id: "c", label: "Configuration", sub: ".tf files", edge: "read" },
          { id: "t", label: "Terraform Core", sub: "plans changes", edge: "calls" },
          { id: "p", label: "Provider", sub: "plugin per platform", edge: "sends requests" },
          { id: "a", label: "Cloud API", sub: "for example, AWS", edge: "creates and changes" },
          { id: "i", label: "Infrastructure" }]} />
        <div className="w-[380px] shrink-0">
          <ProjectExample what="Name the provider and one real resource from the reference project, and show where each appears in this flow." />
        </div>
      </div>
    ),
    notes: "Walk top to bottom. You write configuration. Terraform Core reads it, compares it with state and the real infrastructure, and builds a plan.\nProviders are plugins that translate resources into calls to a platform's API, such as AWS.\nState is Terraform's record of the resources it manages.\nJoseph goes deeper on Core, providers and the dependency graph.\nTHE PLACEHOLDER: fill in the real provider and resource from the reference project.",
  },
  {
    id: "fund-fit", section: "fundamentals", type: "visual", title: "Where it fits",
    body: (
      <div className="grid w-full grid-cols-3 gap-6">
        <ConceptCard icon={CircleCheck} name="Benefits" accent={T} items={["Repeatable environments", "Changes reviewed in Git", "Preview with terraform plan", "One workflow, many platforms"]} />
        <ConceptCard icon={Layers} name="Use cases" accent={P} items={["Networks, compute, storage", "Dev, staging and prod", "Multi-cloud and SaaS via providers", "Reusable modules"]} />
        <ConceptCard icon={TriangleAlert} name="Limitations" accent={O} items={["State must be stored and protected", "Changes outside Terraform cause drift", "Provisions infrastructure; not software configuration", "Concepts and HCL take time to learn"]} />
      </div>
    ),
    notes: "Benefits: the same configuration can be applied again, changes go through review, and terraform plan previews them before anything changes.\nUse cases: provisioning cloud resources, managing several environments, and anything with a provider, including some SaaS platforms.\nLimitations, said honestly: state can contain sensitive values and must be protected; changes made outside Terraform create drift; it provisions infrastructure rather than configuring software on servers (tools like Ansible fill that gap); and there is a learning curve.\nJoseph covers state and drift in detail.",
  },
  {
    id: "fund-takeaway", section: "fundamentals", type: "visual", title: "Takeaway",
    body: <KeyTakeaway accent={P} text="Infrastructure used to be built by hand. Terraform lets you describe it in code, and keeps it repeatable." points={["Declarative", "Providers", "State"]} />,
    notes: "Recap in one breath: manual infrastructure does not scale; IaC puts it in reviewable files; Terraform is a declarative IaC tool that talks to platforms through providers and tracks what it manages in state.\nHand off to Saad: so what are the building blocks you write?",
  },
];
