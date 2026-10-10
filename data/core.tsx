import { Anchor, Database, Link2 } from "lucide-react";
import type { SlideData } from "@/lib/types";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCard } from "@/components/ConceptCard";
import { KeyTakeaway } from "@/components/KeyTakeaway";
import { ProjectExample } from "@/components/ProjectExample";
import { StateDiagram } from "@/components/StateDiagram";

// PERSON 2: Core concepts. "What are the building blocks of Terraform?"
// One running example (generic AWS S3), NOT taken from the reference project.
const T = "#2DD4BF", P = "#7B42BC";

const config = `provider "aws" {
  region = "us-east-1"
}
variable "env" {
  type    = string
  default = "dev"
}
locals {
  name = "app-\${var.env}"
}
data "aws_caller_identity" "current" {}
resource "aws_s3_bucket" "example" {
  bucket = local.name
}
output "bucket_arn" {
  value = aws_s3_bucket.example.arn
}`;

export const coreSlides: SlideData[] = [
  {
    id: "core-intro", section: "core", type: "section", title: "Core Concepts",
    notes: "The question for this section: what is inside a Terraform project?\nWe use ONE small example throughout: an S3 bucket. It is a generic example, not the reference project.\nBy the end you should be able to read a Terraform file and say what each block does.",
  },
  {
    id: "core-config", section: "core", type: "side", title: "What's inside a project?",
    subtitle: "Configuration is .tf files written in HCL. Each block is a fundamental building block.",
    body: (
      <div className="w-full space-y-4">
        <CodeBlock
          code={config}
          compact
          accent={T}
          highlight={[12, 13, 14]}
          labels={{
            1: "Provider: Cloud plugin",
            4: "Variable: Input argument",
            8: "Local: Reusable computation",
            11: "Data: Read-only query",
            12: "Resource: Managed cloud object",
            15: "Output: Result exposed",
          }}
        />
        <div className="rounded-xl border border-line bg-panel p-3.5 font-mono text-base text-mute">
          <span className="text-ink font-semibold">Directory semantics:</span> Terraform merges all <code className="text-ink">.tf</code> files in the current folder into a single evaluation graph regardless of file names.
        </div>
      </div>
    ),
    notes: "A Terraform configuration is a set of .tf files in a directory. Terraform reads all of them together. They are written in HCL, HashiCorp Configuration Language, which is made of blocks, arguments and expressions.\nGo down the labels: the provider block configures the plugin for a platform. A variable is an input. Locals are named values you reuse. A data source reads something that already exists, and does not create it. A resource is something Terraform creates and manages. An output exposes a value.\nThe highlighted resource is our running example.",
  },
  {
    id: "core-anatomy", section: "core", type: "visual", title: "Anatomy of a resource",
    subtitle: "How to declare cloud resources and how to reference them throughout your configuration.",
    body: (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-line bg-panel p-4 space-y-3">
            <p className="font-mono text-xl font-bold" style={{ color: T }}>1. Declaring a Resource</p>
            <ArchitectureDiagram direction="row" compact accent={T} nodes={[
              { id: "d1", label: "resource", sub: "block keyword" },
              { id: "d2", label: "aws_ecs_service", sub: "type (provider + kind)" },
              { id: "d3", label: "web", sub: "local identifier" },
            ]} />
            <p className="text-base text-mute pt-1.5 border-t border-line/60">
              The type tells Terraform which plugin to invoke. The name is for referencing within your code.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel p-4 space-y-3">
            <p className="font-mono text-xl font-bold" style={{ color: P }}>2. Referencing its Attributes</p>
            <ArchitectureDiagram direction="row" compact accent={P} nodes={[
              { id: "r1", label: "aws_ecs_service", sub: "resource type" },
              { id: "r2", label: "web", sub: "local identifier" },
              { id: "r3", label: "id / arn", sub: "exported attribute" },
            ]} />
            <p className="text-base text-mute pt-1.5 border-t border-line/60">
              Join type, name, and attribute with dots (<code className="text-ink">aws_ecs_service.web.id</code>) to pass values to other resources.
            </p>
          </div>
        </div>

        <ProjectExample
          compact
          title="From Our Internship Repo: Production ECS Fargate Service"
          subtitle="File: personal_internship/infra/ecs.tf"
          what="Notice how this real block connects to our ECS Cluster, Task Definition, and ALB Target Group via dot-notation references:"
          code={`resource "aws_ecs_service" "web" {
  name            = "\${var.group_name}-svc"
  cluster         = aws_ecs_cluster.main.id         # Reference to cluster
  task_definition = aws_ecs_task_definition.web.arn # Reference to task def
  launch_type     = "FARGATE"
  load_balancer {
    target_group_arn = aws_lb_target_group.web.arn  # Reference to ALB
    container_port   = var.container_port
  }
}`}
          points={[
            "resource keyword declares managed cloud object",
            "aws_ecs_service specifies AWS provider plugin",
            "web is our unique internal identifier",
            "cluster and task_definition create automatic dependency links",
          ]}
        />
      </div>
    ),
    notes: "Break the first line apart. 'resource' says this block declares infrastructure Terraform manages. 'aws_s3_bucket' is the resource type: the prefix tells you the provider (aws) and the rest says what kind of thing it is. 'example' is the local name, chosen by you, used to refer to this resource inside the configuration.\nTo reference it, join type, name and attribute with dots: aws_s3_bucket.example.arn.\nTHE PLACEHOLDER: replace it with a real resource from the reference project.",
  },
  {
    id: "core-connect", section: "core", type: "side", title: "How the pieces connect",
    subtitle: "References link blocks together, and links automatically decide the creation order.",
    body: (
      <div className="flex w-full items-center gap-8">
        <div className="flex-1 space-y-4">
          <ArchitectureDiagram compact accent={T} nodes={[
            { id: "v", label: "var.db_password", sub: "input variable", edge: "feeds" },
            { id: "r1", label: "aws_db_instance.tasks", sub: "RDS PostgreSQL database", edge: "exports address to" },
            { id: "r2", label: "aws_ecs_task_definition.web", sub: "Fargate container env", edge: "referenced by" },
            { id: "r3", label: "aws_ecs_service.web", sub: "running service", edge: "accessible via" },
            { id: "o", label: "output.app_url", sub: "ALB public DNS" },
          ]} />
        </div>

        <div className="w-[420px] shrink-0 space-y-4">
          <ConceptCard
            compact
            icon={Link2}
            name="Implicit Dependency"
            badge="Automatic"
            accent={T}
            code={`# Terraform sees this reference:
DATABASE_URL = aws_db_instance.tasks.address`}
            text="By referencing another resource's attribute, Terraform automatically builds the database first. 99% of dependencies work this way."
          />
          <ConceptCard
            compact
            icon={Anchor}
            name="Explicit Dependency"
            badge="Manual"
            accent={P}
            code={`# When no attribute reference exists:
depends_on = [aws_lb_listener.http]`}
            text="Used when order matters (e.g., ALB listener must exist before service registers targets), but no attribute is directly passed."
          />
        </div>
      </div>
    ),
    notes: "Follow the chain: the variable env feeds the local name, the local is used by the bucket, and the output exposes an attribute of the bucket. Each arrow is a reference: var., local., or resource type and name.\nDependencies: when one resource refers to another's attribute, Terraform sees an implicit dependency and creates the other one first. When there is no reference but order still matters, depends_on declares it explicitly.\nPerson 4 goes deeper on the dependency graph.",
  },
  {
    id: "core-state", section: "core", type: "side", title: "State: what Terraform believes exists",
    subtitle: "The bridge between your code and the real cloud. Without state, Terraform cannot manage infrastructure.",
    body: (
      <div className="flex w-full items-center gap-8">
        <div className="flex-1 space-y-4">
          <StateDiagram accent={T} />
          <div className="rounded-xl border border-line bg-panel p-4 text-base text-mute space-y-1.5">
            <p className="font-mono text-ink font-semibold text-lg">How Plan Reconciles the 3 Views:</p>
            <p>1. <b className="text-ink">Refresh:</b> Terraform queries AWS APIs to read actual live infrastructure.</p>
            <p>2. <b className="text-ink">Compare:</b> It evaluates your <code className="text-ink">.tf</code> files against the refreshed state.</p>
            <p>3. <b className="text-ink">Diff:</b> Generates execution plan: creates missing items, updates changes, deletes removed items.</p>
          </div>
        </div>

        <div className="w-[420px] shrink-0">
          <ConceptCard
            compact
            icon={Database}
            name="The Three Views"
            badge="Reconciliation"
            accent={P}
            items={[
              "Desired State: What you wrote in your .tf files in Git.",
              "Recorded State: What terraform.tfstate records from previous runs.",
              "Actual State: What actually exists in AWS right now.",
              "terraform plan: Detects discrepancies between Desired and Actual.",
            ]}
            footer="State prevents Terraform from trying to recreate existing cloud resources on every run"
          />
        </div>
      </div>
    ),
    notes: "Your configuration is the DESIRED state. The real infrastructure is the ACTUAL state. State is Terraform's own record of which real objects match which resources in your configuration, plus their attributes. By default it is stored in a file called terraform.tfstate.\nWhen you run plan, Terraform compares configuration with state, refreshes it from the real infrastructure, and shows the difference.\nState can contain sensitive values, so it needs protecting. Person 3 covers remote state, locking and drift.",
  },
  {
    id: "core-takeaway", section: "core", type: "visual", title: "Takeaway",
    body: <KeyTakeaway accent={T} text="A Terraform project is configuration that declares the state you want. State records what actually exists." points={["Providers", "Resources", "References", "State"]} />,
    notes: "So, what is inside a Terraform project? Blocks written in HCL: providers, resources, data sources, variables, locals and outputs. References connect them and set the order. State remembers what Terraform has built.\nHand off to Person 3: how do teams actually run this, day to day?",
  },
];
