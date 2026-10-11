import { Compass, CircleCheck, Database, FolderTree, Layers, Lock, Tags, TriangleAlert } from "lucide-react";
import type { SlideData } from "@/lib/types";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCard } from "@/components/ConceptCard";
import { DependencyGraph } from "@/components/DependencyGraph";
import { ProjectExample } from "@/components/ProjectExample";

// Joseph: Advanced, architecture and best practices.
// "How does Terraform work at a deeper level, and how should projects be designed?"
// All code is generic, NOT from the reference project.
const B = "#60A5FA", T = "#2DD4BF", O = "#FF9900", P = "#7B42BC";
import { chip } from "@/lib/ui";

const depCode = `resource "aws_s3_bucket_public_access_block" "example" {
  bucket = aws_s3_bucket.example.id
}
resource "aws_s3_bucket_policy" "example" {
  bucket     = aws_s3_bucket.example.id
  # policy argument omitted
  depends_on = [aws_s3_bucket_public_access_block.example]
}`;

export const advancedSlides: SlideData[] = [
  {
    id: "advanced-intro", section: "advanced", type: "section", title: "Advanced & Best Practices",
    notes: "The question: how does Terraform work underneath, and how should projects be designed?\nWe cover dependency graphs and parallelism, then best practices, limits, and when to choose Terraform.",
  },
  {
    id: "adv-dependencies", section: "advanced", type: "visual", title: "The dependency graph",
    subtitle: "Terraform maps out which resources need each other, then builds independent ones simultaneously.",
    body: (
      <div className="flex w-full items-center gap-16">
        <div className="shrink-0">
          <DependencyGraph accent={B} items={[
            { id: "a", label: "Resource A", sub: "aws_vpc.main", via: "implicit" },
            { id: "b", label: "Resource B", sub: "aws_ecs_cluster.main", via: "explicit" },
            { id: "c", label: "Resource C", sub: "aws_ecs_service.web" }]} />
        </div>
        <div className="min-w-0 flex-1 space-y-6">
          <CodeBlock code={depCode} compact accent={B} highlight={[2, 7]} labels={{ 2: "Implicit: Resource references another", 7: "Explicit: depends_on declared manually" }} />
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-xl border border-line bg-panel p-6 text-xl text-mute flex flex-col justify-between">
              <div>
                <p className="font-mono text-ink font-bold text-2xl mb-2" style={{ color: B }}>Automatic Parallelism</p>
                <p>Resources that do not depend on each other (like an S3 bucket and an unrelated database) are created <b>simultaneously side-by-side</b>.</p>
              </div>
              <p className="mt-3 font-mono text-base text-ink/80 pt-2 border-t border-line/60">Builds up to 10 independent resources at once to make deployments fast.</p>
            </div>
            <div className="rounded-xl border border-line bg-panel p-6 text-xl text-mute flex flex-col justify-between">
              <div>
                <p className="font-mono text-ink font-bold text-2xl mb-2" style={{ color: T }}>Reverse Destruction</p>
                <p>When you run destroy, Terraform tears down resources in <b>exact reverse order</b> (e.g. stops the service before deleting the network).</p>
              </div>
              <p className="mt-3 font-mono text-base text-ink/80 pt-2 border-t border-line/60">Ensures no resource is left stuck or orphaned without its dependencies.</p>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: "How Terraform plans and builds in order:\n1. Dependencies: When resource B references resource A, Terraform knows A must be created first.\n2. Automatic Parallelism: What if resources don't depend on each other? Terraform doesn't wait! It builds them at the exact same time side-by-side (up to 10 concurrently by default), making builds as fast as possible.\n3. Reverse Destruction: When tearing down with 'terraform destroy', it deletes backwards so nothing gets blocked or orphaned.",
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
    subtitle: "Being honest about the trade-offs: managing state security and scaling safely.",
    body: (
      <div className="grid w-full grid-cols-2 gap-8">
        <div className="rounded-2xl border border-line bg-panel p-8 flex flex-col justify-between" style={{ boxShadow: `inset 4px 0 0 ${O}` }}>
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div className="flex items-center gap-3">
                <Database size={36} color={O} />
                <span className="font-mono text-3xl font-bold text-ink">State & Sensitive Data</span>
              </div>
              <span className="rounded px-3 py-1 font-mono text-base font-semibold uppercase tracking-wider" style={{ background: O + "22", color: O, border: `1px solid ${O}44` }}>Critical Asset</span>
            </div>
            <ul className="mt-6 space-y-4 text-xl text-mute">
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: O }} />
                <span><b className="text-ink">Single point of truth:</b> As infrastructure expands, state files grow large; any corruption halts team deployments.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: O }} />
                <span><b className="text-ink">Plaintext secrets:</b> Passwords, API tokens, and private keys generated in code are stored unencrypted in state files.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: O }} />
                <span><b className="text-ink">Remote encryption:</b> State must always be encrypted at rest in remote S3, with strict IAM read restrictions.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: O }} />
                <span><b className="text-ink">Enable versioning:</b> Always keep S3 bucket versioning turned on so you can restore prior state if an accident occurs.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-panel p-8 flex flex-col justify-between" style={{ boxShadow: `inset 4px 0 0 ${P}` }}>
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <div className="flex items-center gap-3">
                <TriangleAlert size={36} color={P} />
                <span className="font-mono text-3xl font-bold text-ink">Scale & Production Safety</span>
              </div>
              <span className="rounded px-3 py-1 font-mono text-base font-semibold uppercase tracking-wider" style={{ background: P + "22", color: P, border: `1px solid ${P}44` }}>Safe Operations</span>
            </div>
            <ul className="mt-6 space-y-4 text-xl text-mute">
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: P }} />
                <span><b className="text-ink">Split large projects:</b> Never put your entire cloud into one state. Split networks, databases, and compute into separate folders.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: P }} />
                <span><b className="text-ink">Provider feature lag:</b> Brand-new AWS features may take weeks or months to become supported in the Terraform provider.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: P }} />
                <span><b className="text-ink">Destroy & replace hazards:</b> Changing certain properties (like a DB subnet or VPC ID) forces Terraform to delete and rebuild the resource.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: P }} />
                <span><b className="text-ink">Always inspect the plan:</b> Look for red destructive indicators before confirming, and use <code className="text-ink">prevent_destroy</code> on critical databases.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    ),
    notes: "Honest trade-offs and limits of Terraform:\n1. State & Secrets: State is your single source of truth, and sensitive values (like DB passwords) live in plaintext inside it. Keep state remote, encrypted in S3, backed up with versioning, and locked down with IAM.\n2. Scale & Production Safety: Break monolithic code into smaller state files so changes are isolated. Watch out for 'destroy and replace' on changes to immutable resource properties—always read the plan preview before typing yes.",
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
