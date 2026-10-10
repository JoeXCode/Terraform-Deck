import { Compass, CircleCheck, Database, FolderTree, GitCompare, Layers, Lock, Tags, TriangleAlert } from "lucide-react";
import type { SlideData } from "@/lib/types";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { CodeBlock } from "@/components/CodeBlock";
import { ComparisonTable } from "@/components/ComparisonTable";
import { ConceptCard } from "@/components/ConceptCard";
import { DependencyGraph } from "@/components/DependencyGraph";
import { ProjectExample } from "@/components/ProjectExample";
import { highlightLine } from "@/components/highlight";

// PERSON 4: Advanced, architecture and best practices.
// "How does Terraform work at a deeper level, and how should projects be designed?"
// All code is generic, NOT from the reference project.
const B = "#60A5FA", T = "#2DD4BF", O = "#FF9900", P = "#7B42BC";
import { chip } from "@/lib/ui";

function Snippet({ name, code, text, accent }: { name: string; code: string; text: string; accent: string }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-6">
      <p className="text-3xl font-semibold" style={{ color: accent }}>{name}</p>
      <pre className="mt-3 rounded-lg bg-bg p-3 font-mono text-[26px] leading-snug">{code.split("\n").map((l, i) => <div key={i}>{highlightLine(l)}</div>)}</pre>
      <p className="mt-3 text-[26px] text-mute">{text}</p>
    </div>
  );
}

const depCode = `resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.example.id
}
resource "aws_s3_bucket_policy" "example" {
  bucket     = aws_s3_bucket.example.id
  # policy argument omitted
  depends_on = [aws_s3_bucket_public_access_block.example]
}`;

const modCode = `module "network" {
  source = "./modules/network"
  cidr   = "10.0.0.0/16"
}
# use an output: module.network.vpc_id`;

export const advancedSlides: SlideData[] = [
  {
    id: "advanced-intro", section: "advanced", type: "section", title: "Advanced & Best Practices",
    notes: "The question: how does Terraform work underneath, and how should projects be designed?\nWe go from architecture, to dependencies, modules and advanced HCL, then best practices, limits, the wider tool landscape, and when to choose Terraform.",
  },
  {
    id: "adv-architecture", section: "advanced", type: "side", title: "What's under the hood?", subtitle: "Decoupled architecture: Terraform Core and provider plugins communicating over gRPC.",
    body: (
      <div className="flex w-full items-center gap-10">
        <ArchitectureDiagram accent={B} nodes={[
          { id: "c", label: "Configuration", sub: ".tf files in project", edge: "parsed by" },
          { id: "k", label: "Terraform Core", sub: "DAG engine & planning", edge: "calls over gRPC" },
          { id: "p", label: "Provider Plugin", sub: "separate OS binary", edge: "HTTPS API requests" },
          { id: "a", label: "Cloud API", sub: "AWS / Azure / GCP", edge: "provisions" },
          { id: "i", label: "Infrastructure", sub: "live resources" }]} />
        <div className="w-[460px] shrink-0 space-y-4">
          <div className="rounded-xl border border-line bg-panel p-5 font-mono text-2xl">
            <span className="font-bold text-ink">Terraform Core (Go Engine)</span>
            <p className="mt-2 text-xl font-sans text-mute">100% platform-agnostic. Parses HCL, builds the dependency graph, reads state, and calculates execution diffs.</p>
          </div>
          <div className="rounded-xl border border-line bg-panel p-5 font-mono text-2xl">
            <span className="font-bold" style={{ color: B }}>Provider Plugins (gRPC)</span>
            <p className="mt-2 text-xl font-sans text-mute">Standalone binaries (e.g. terraform-provider-aws) that translate generic resource schemas into official cloud API requests.</p>
          </div>
          <div className="rounded-xl border border-line bg-panel p-5 font-mono text-2xl">
            <span className="font-bold" style={{ color: T }}>Why this split matters</span>
            <p className="mt-2 text-xl font-sans text-mute">Providers update independently from Terraform Core. New AWS features ship without requiring a new Terraform CLI release.</p>
          </div>
        </div>
      </div>
    ),
    notes: "Terraform Core is the engine. It reads configuration and state, builds a dependency graph, and works out a plan. It does not know how to talk to any cloud.\nProviders do that. A provider is a plugin: a separate program, downloaded from the Terraform Registry during init, that Core talks to over gRPC. The provider translates resource changes into API calls to AWS or another platform.\nState is read before planning and written after applying. The Registry is also where shared modules are published.\nThis split is why one tool can manage many platforms.",
  },
  {
    id: "adv-dependencies", section: "advanced", type: "visual", title: "The dependency graph",
    subtitle: "Terraform compiles HCL into a Directed Acyclic Graph (DAG) for parallel execution.",
    body: (
      <div className="flex w-full items-center gap-16">
        <div className="shrink-0">
          <DependencyGraph accent={B} items={[
            { id: "a", label: "Resource A", sub: "aws_vpc.main", via: "implicit" },
            { id: "b", label: "Resource B", sub: "aws_ecs_cluster.main", via: "explicit" },
            { id: "c", label: "Resource C", sub: "aws_ecs_service.web" }]} />
        </div>
        <div className="min-w-0 flex-1 space-y-6">
          <CodeBlock code={depCode} compact accent={B} highlight={[2, 7]} labels={{ 2: "Implicit", 7: "Explicit" }} />
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-line bg-panel p-5 text-[22px] text-mute">
              <span className="font-mono text-ink font-semibold">Automatic Parallelism:</span> Independent nodes in the DAG are built simultaneously in parallel (up to 10 concurrent operations by default).
            </div>
            <div className="rounded-xl border border-line bg-panel p-5 text-[22px] text-mute">
              <span className="font-mono text-ink font-semibold">Reverse Destruction:</span> During destroy, Terraform walks the DAG in exact reverse order to prevent orphaned dependencies.
            </div>
          </div>
        </div>
      </div>
    ),
    notes: "Terraform builds a graph of every resource and the order they must be handled in.\nImplicit dependency: B refers to A's attribute, so Terraform knows A must exist first. This is the normal case.\nExplicit dependency: depends_on, for when the order matters but no attribute is referenced. The classic case is a policy that must wait for another setting. Use it sparingly, because it hides intent.\nResources with no path between them can be processed in parallel. Destroy runs in reverse order. A cycle is an error.",
  },
  {
    id: "adv-modules", section: "advanced", type: "visual", title: "Modular architecture",
    subtitle: "Encapsulate complexity into reusable building blocks instead of 2,000-line monolithic files.",
    body: (
      <div className="grid w-full grid-cols-[1.1fr_1fr] gap-6 items-center">
        <div className="space-y-4">
          <ArchitectureDiagram direction="row" compact accent={B} nodes={[
            { id: "i", label: "Inputs", sub: "variables.tf", edge: "configures" },
            { id: "m", label: "Resources", sub: "main.tf in module", edge: "exports" },
            { id: "o", label: "Outputs", sub: "outputs.tf" }]} />
          <CodeBlock code={modCode} compact accent={B} highlight={[1, 2, 3]} />
        </div>
        <div>
          <ConceptCard
            compact
            icon={Layers}
            name="Module Design Pattern"
            badge="Best Practice"
            accent={T}
            items={[
              "Root Module: The working directory where you execute 'terraform apply'.",
              "Child Modules: Private or registry packages instantiated with 'module' blocks.",
              "Clean Interface: Keep internal implementation details hidden behind simple inputs and outputs.",
              "Version Pinning: Pin module sources to git tags (e.g. ref=v1.2.0) to prevent unexpected drift.",
            ]}
          />
        </div>
      </div>
    ),
    notes: "Every configuration is a root module: the directory you run Terraform in. A child module is another directory of Terraform files that the root calls with a module block.\nInputs are the child's variables; outputs are the values it exposes, used as module.<name>.<output>.\nSources can be a local path, the Terraform Registry, a Git repository, and others. Pin versions for remote modules.\nWhy: reuse, consistency, and hiding detail behind a small interface.\n[FILL IN: does the reference project use modules? Check the project files and show one real module call.]",
  },
  {
    id: "adv-hcl", section: "advanced", type: "visual", title: "Advanced HCL & safety patterns",
    subtitle: "Production HCL patterns that prevent outages and handle dynamic configurations.",
    body: (
      <div className="grid w-full grid-cols-2 gap-4">
        <ConceptCard
          compact
          name="1. count vs for_each"
          badge="Safety Guard"
          accent={T}
          code={`# PREFERRED: for_each uses stable keys
for_each = toset(["web", "worker"])
# AVOID: count uses integer index [0, 1]`}
          text="Removing element 0 from count shifts all subsequent indices, recreating them. for_each uses stable keys and touches only the changed resource."
        />
        <ConceptCard
          compact
          name="2. Lifecycle Rules in Action"
          badge="Data Protection"
          accent={O}
          code={`lifecycle {
  prevent_destroy       = true  # Protects RDS
  create_before_destroy = true  # Zero-downtime ALB
  ignore_changes        = [desired_count]
}`}
          text="Guard persistent databases against accidental deletion, enable zero-downtime updates, and prevent fighting autoscaling."
        />
        <ConceptCard
          compact
          name="3. Dynamic Blocks"
          badge="DRY Syntax"
          accent={B}
          code={`dynamic "ingress" {
  for_each = var.service_ports
  content {
    from_port = ingress.value
    to_port   = ingress.value
    protocol  = "tcp"
  }
}`}
          text="Generates repeated nested configuration blocks (like firewall rules or target groups) from a list without copy-pasting code."
        />
        <ConceptCard
          compact
          name="4. Expressions & Functions"
          badge="Logic"
          accent={P}
          code={`container_defs = jsonencode([{ name = "app", ... }])
name           = lower(var.env)
db_url         = "postgresql://\${var.user}:\${var.pass}@\${var.host}"`}
          text="Terraform includes dozens of built-in functions for JSON encoding, string transforms, collections, and conditional logic."
        />
      </div>
    ),
    notes: "Six ideas, one line each. Do not read the code aloud.\ncount makes N copies addressed by number. for_each makes one per item in a set or map, addressed by key; this is usually safer, because removing an item from the middle of a count list shifts the numbers after it.\nA for expression transforms a list or map into a new one. A conditional picks one of two values, and with count 0 or 1 it switches a resource on or off.\nA dynamic block generates repeated nested blocks, such as firewall rules, from a collection.\nFunctions are built in, for example lower, join and merge. Locals give a name to a computed value so it is written once.",
  },
  { id: "adv-evaluate", section: "advanced", type: "section", tag: "EVALUATE", title: "Evaluate", subtitle: "How should projects be designed, and when is Terraform the right tool?", notes: "Transition: we now know how Terraform works. Now the judgment calls: how to design a project well, where Terraform struggles, and how it compares with other tools." },
  {
    id: "adv-practices", section: "advanced", type: "visual", title: "Best practices",
    subtitle: "Battle-tested standards for directory layout, version constraints, and security.",
    body: (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <ConceptCard compact icon={FolderTree} name="Structure" accent={T} items={["One file per domain", "Clean naming", "Modules for reuse", "Document variables"]} />
          <ConceptCard compact icon={Tags} name="Versions" accent={B} items={["Pin CLI ~> 1.9.0", "Pin AWS ~> 5.60", "Commit lock file", "Upgrade deliberately"]} />
          <ConceptCard compact icon={Layers} name="Environments" accent={P} items={["Separate tfvars", "Separate state keys", "Dev/prod parity", "Isolated IAM roles"]} />
          <ConceptCard compact icon={Lock} name="Security" accent={O} items={["Encrypted state", "Zero secrets in Git", "Least privilege IAM", "OIDC for CI runners"]} />
        </div>

        <ProjectExample
          compact
          title="Our Project Standards: File Layout & Version Constraints"
          subtitle="Reference Architecture"
          what="How our repository organizes domain responsibilities and freezes dependencies:"
          code={`# versions.tf in our repository:
terraform {
  required_version = "~> 1.9.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.60" }
  }
}
# Directory layout: infra/network.tf • infra/security.tf • infra/ecs.tf • infra/database.tf`}
          points={[
            "Consistent domain naming: Separate files for networking, ECS, database, and security",
            "Deterministic lock file: .terraform.lock.hcl committed to prevent unexpected provider upgrades",
            "Environment parity: example.tfvars, ci.tfvars, and production vars targeting same codebase",
            "Automated tagging: AWS provider default_tags applied automatically to all resources",
          ]}
        />
      </div>
    ),
    notes: "Structure: a predictable layout and consistent naming, with modules for reuse, and descriptions on variables and outputs so the code documents itself.\nVersions: set required_version and provider version constraints, and commit .terraform.lock.hcl, which records the exact provider versions chosen. Upgrade on purpose and read the plan.\nEnvironments: the same code with different variables and separate state per environment.\nSecurity: keep state remote, encrypted and access-controlled. Never hard-code secrets or commit them. Marking a value sensitive hides it in CLI output, but it is still stored in state.\nTHE PLACEHOLDER: replace it with the reference project's real layout.",
  },
  {
    id: "adv-limits", section: "advanced", type: "visual", title: "Know the limits",
    body: (
      <div className="grid w-full grid-cols-3 gap-6">
        <ConceptCard icon={Database} name="State" accent={O} items={["Complexity grows with the estate", "Secrets can end up in state", "Protect and back it up"]} />
        <ConceptCard icon={GitCompare} name="Reality vs code" accent={B} items={["Manual changes cause drift", "Import brings existing infrastructure under management", "Imports take care and time"]} />
        <ConceptCard icon={TriangleAlert} name="Scale and safety" accent={P} items={["Large infrastructures: split into smaller states", "Provider coverage can lag new features", "Read plans for destroy and replace"]} />
      </div>
    ),
    notes: "Person 1 listed limitations briefly; here is the detail. Be honest about the trade-offs.\nState: it grows with the estate, can contain secrets, and must be protected and backed up.\nReality vs code: manual changes cause drift. Existing infrastructure can be brought under management with import, which is useful but needs careful work to match the configuration.\nScale and safety: very large infrastructures are usually split across several states and modules. Provider support depends on each provider, so new service features can arrive later than the service itself. Some changes destroy and recreate resources, so read the plan for destroy and replace before applying; the prevent_destroy lifecycle setting can guard critical resources.",
  },
  {
    id: "adv-compare", section: "advanced", type: "visual", title: "Different tools, different jobs",
    body: (
      <ComparisonTable accent={B} focus={-1} columns={["Terraform", "CloudFormation", "Pulumi", "Ansible", "AWS CDK"]} rows={[
        { label: "Language", cells: ["HCL", "JSON or YAML", "TypeScript, Python, Go, more", "YAML playbooks", "TypeScript, Python, Java, more"] },
        { label: "Scope", cells: ["Many platforms", "AWS", "Many platforms", "Servers and config, some cloud", "AWS"] },
        { label: "State", cells: ["State you store", "Managed by AWS", "State backend", "No state file by default", "Via CloudFormation"] },
        { label: "Best fit", cells: ["Multi-platform provisioning", "AWS-native templates", "Real programming languages", "Configuring software", "Code that targets AWS"] }]} />
    ),
    notes: "No tool is universally better. Each fits a different job.\nTerraform: declarative HCL, many platforms through providers, state you store.\nCloudFormation: AWS's own service. Templates in JSON or YAML, stacks managed and tracked by AWS, with no state file to run.\nPulumi: infrastructure in general-purpose languages, across many platforms, with a state backend.\nAnsible: agentless configuration management, strong for configuring servers and software, and it does not track state like Terraform.\nAWS CDK: write AWS infrastructure in a programming language; it produces CloudFormation templates that CloudFormation deploys.\nCell contents are summaries; check each tool's current documentation before quoting details.",
  },
  {
    id: "adv-when", section: "advanced", type: "visual", title: "Choosing a tool",
    body: (
      <div className="w-full space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <ConceptCard icon={CircleCheck} name="When should you use Terraform?" accent={T} items={["You provision across several platforms", "You want declarative, reviewable configuration", "Your team can manage state and pipelines"]} />
          <ConceptCard icon={Compass} name="When should you consider another approach?" accent={O} items={["AWS only, and you want native tooling: CloudFormation or CDK", "Your team prefers general-purpose languages: Pulumi or CDK", "You are configuring software on servers: Ansible"]} />
        </div>
        <div className={chip}>Terraform is a strong fit for declarative, multi-platform provisioning. It is one good tool among several, not a universal answer.</div>
      </div>
    ),
    notes: "Close with the two questions.\nUse Terraform when you provision across more than one platform, want declarative, reviewable configuration, and your team can run state and pipelines well.\nConsider another approach when you are AWS only and prefer native tooling, when your team wants general-purpose languages, or when the job is configuring software on servers.\nMany teams combine tools; for example, Terraform for provisioning and Ansible for configuration.\nHand over to the final synthesis.",
  },
];
