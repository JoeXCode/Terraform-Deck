import { Hand, KeyRound, Database, Package, Search, SlidersHorizontal, Upload, Wallet } from "lucide-react";
import type { SlideData } from "@/lib/types";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCard } from "@/components/ConceptCard";
import { KeyTakeaway } from "@/components/KeyTakeaway";
import { StateDiagram } from "@/components/StateDiagram";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { chip } from "@/lib/ui";

// PERSON 1: Fundamentals. "What is Terraform and why does it exist?"
// Built from the research document "Terraform Explained from Scratch" (Terraform_Fundamentals.docx).
// The bucket example comes from that document; it is not taken from the reference project.
const P = "#7B42BC", O = "#FF9900", T = "#2DD4BF", R = "#F87171";

const hcl = `provider "aws" {
  region = "us-east-1"
}
resource "aws_s3_bucket" "logs" {
  bucket = "my-logs-bucket-98765"
}`;

const symbols: [string, string, string][] = [["+", T, "will be created"], ["~", O, "will be changed"], ["-", R, "will be destroyed"]];

export const fundamentalsSlides: SlideData[] = [
  {
    id: "fundamentals-intro", section: "fundamentals", type: "section", title: "Fundamentals",
    notes: "Open with the question: what is Terraform, and why does it exist?\nThe story: a problem, a new way of working, the four commands you use every day, state, and the habits that keep you out of trouble.\nThis section is for someone who has never used Terraform.",
  },
  {
    id: "fund-problem", section: "fundamentals", type: "visual", title: "Clicking doesn't scale",
    subtitle: "Infrastructure as Code: describe your infrastructure in text files instead of clicking through menus.",
    body: (
      <div className="w-full space-y-5">
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-line bg-panel p-6">
            <div className="flex items-center justify-between pb-3.5 border-b border-line">
              <span className="font-mono text-2xl font-bold" style={{ color: O }}>By hand (ClickOps)</span>
              <span className="rounded px-2.5 py-0.5 font-mono text-base text-mute bg-bg border border-line">Manual & Fragile</span>
            </div>
            <div className="mt-4">
              <ArchitectureDiagram direction="row" compact accent={O} nodes={[
                { id: "b1", label: "Console clicks", sub: "no written record" },
                { id: "b2", label: "Built once", sub: "it works on day 1" },
                { id: "b3", label: "Repeat it", sub: "from human memory" },
                { id: "b4", label: "Something breaks", sub: "what changed?" },
              ]} />
            </div>
            <ul className="mt-5 space-y-2 text-lg text-mute border-t border-line/60 pt-4">
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: O }} />Zero audit trail: no one knows who changed what setting or when.</li>
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: O }} />Configuration drift: dev, staging, and prod silently diverge over time.</li>
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: O }} />Slow recovery: recreating a wiped environment takes hours or days.</li>
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-panel p-6">
            <div className="flex items-center justify-between pb-3.5 border-b border-line">
              <span className="font-mono text-2xl font-bold" style={{ color: P }}>As code (IaC)</span>
              <span className="rounded px-2.5 py-0.5 font-mono text-base text-ink font-semibold" style={{ background: P + "22", border: `1px solid ${P}55` }}>Automated & Repeatable</span>
            </div>
            <div className="mt-4">
              <ArchitectureDiagram direction="row" compact accent={P} startDelay={0.5} nodes={[
                { id: "a1", label: "Write it down", sub: "declarative .tf file" },
                { id: "a2", label: "Review", sub: "teammates, in Git" },
                { id: "a3", label: "terraform apply", sub: "automated build" },
                { id: "a4", label: "Rebuild", sub: "identical anytime" },
              ]} />
            </div>
            <ul className="mt-5 space-y-2 text-lg text-mute border-t border-line/60 pt-4">
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: P }} />Version controlled: every change is tracked, reviewed, and reversible in Git.</li>
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: P }} />Deterministic: spin up 10 identical environments with the same configuration.</li>
              <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: P }} />Self-documenting: code is the exact source of truth for all cloud architecture.</li>
            </ul>
          </div>
        </div>

        <div className={chip}>
          <b>The Core Shift:</b> From clicking buttons in AWS Console to treating infrastructure like software: versioned, tested, peer-reviewed, and automated.
        </div>
      </div>
    ),
    notes: "Imagine setting up servers, a database and a network by clicking through the AWS or Azure console.\nIt works once. Next time you must remember every click, and if something breaks you cannot easily see what changed.\nIaC: write down what you want in a text file and let a tool build it.\nBecause it is text, it can live in Git, teammates can review it, and an environment can be rebuilt from the same files.",
  },
  {
    id: "fund-terraform", section: "fundamentals", type: "visual", title: "What is Terraform?",
    subtitle: "A declarative tool: you describe the end result, Terraform works out the steps.",
    body: (
      <div className="grid w-full grid-cols-[1.1fr_1fr] items-center gap-10">
        <div className="space-y-5">
          <CodeBlock code={hcl} accent={P} highlight={[4, 5, 6]} labels={{ 1: "Provider: the AWS plugin", 4: "Resource: what to build" }} />
          <div className="rounded-xl border border-line bg-panel p-5 text-lg text-mute leading-snug">
            <p className="font-semibold text-ink text-xl mb-1.5 font-mono" style={{ color: P }}>Declarative vs Imperative:</p>
            <p>• <b className="text-ink">Imperative (Scripts):</b> You write the step-by-step commands (create bucket, add tag). If it fails midway, re-running can break or create duplicate resources.</p>
            <p className="mt-1.5">• <b className="text-ink">Declarative (Terraform):</b> You specify the <i>target end state</i>. Terraform inspects what exists, calculates the diff, and takes only the exact actions needed.</p>
          </div>
        </div>

        <div className="space-y-5">
          <ArchitectureDiagram accent={P} nodes={[
            { id: "d", label: "What you describe", sub: "one S3 bucket in us-east-1", edge: "compared with" },
            { id: "e", label: "What exists", sub: "tracked in state + live AWS query", edge: "generates" },
            { id: "p", label: "Execution plan", sub: "precise list of creates, changes, deletes" }
          ]} />
          <div className="rounded-xl border border-line bg-panel p-5 text-lg leading-snug text-mute">
            <span className="font-mono text-ink font-semibold">The Reconciliation Engine:</span> Terraform is a reconciliation loop. It continuously compares your desired code against real cloud infrastructure, keeping them in sync.
          </div>
        </div>
      </div>
    ),
    notes: "Terraform is declarative: you say 'I want one storage bucket in this region', not the steps to get there.\nTerraform compares your description with what it already manages, and works out what to create, change or remove.\nRead the file aloud. The provider is a plugin that lets Terraform talk to a platform like AWS. The resource is the thing to build; 'logs' is its name inside the code.\nPrecisely: it compares your configuration with its state, refreshed from the real infrastructure. State comes up shortly.\nThe bucket name must be globally unique, so yours will differ.\nIf asked: HashiCorp moved Terraform to the Business Source License in 2023; OpenTofu is a community fork.",
  },
  {
    id: "fund-commands", section: "fundamentals", type: "visual", title: "The everyday commands",
    subtitle: "Day to day, you work with four core commands. Always read the plan before confirming.",
    body: (
      <div className="w-full space-y-6">
        <div className="grid grid-cols-4 gap-5">
          <ConceptCard
            compact
            name="1. init"
            badge="Setup"
            accent={T}
            items={[
              "Downloads required provider plugins (e.g. hashicorp/aws)",
              "Initializes module packages",
              "Connects to remote state backend",
            ]}
            footer="Run first, and whenever plugins or backend change"
          />
          <ConceptCard
            compact
            name="2. plan"
            badge="Preview"
            accent={O}
            items={[
              "Queries real cloud state via APIs",
              "Compares live resources to your .tf files",
              "Outputs exact proposed changes with 0 risk",
            ]}
            footer="Dry-run safety net: modifies nothing in cloud"
          />
          <ConceptCard
            compact
            name="3. apply"
            badge="Execute"
            accent={P}
            items={[
              "Prompts for human confirmation (type 'yes')",
              "Calls cloud APIs in dependency order",
              "Updates terraform.tfstate upon completion",
            ]}
            footer="Creates, updates, or deletes real infrastructure"
          />
          <ConceptCard
            compact
            name="4. destroy"
            badge="Teardown"
            accent={R}
            items={[
              "Calculates reverse dependency graph",
              "Deletes all resources managed by this project",
              "Leaves untracked cloud resources untouched",
            ]}
            footer="Used for ephemeral testing & cleanup"
          />
        </div>

        <div>
          <p className="mb-2.5 font-mono text-lg text-mute">Symbols you see in the plan output:</p>
          <div className="grid grid-cols-3 gap-5">
            {symbols.map(([s, c, t]) => (
              <div key={s} className="rounded-xl border border-line bg-panel p-4 flex items-center gap-5">
                <span className="font-mono text-4xl font-bold" style={{ color: c }}>{s}</span>
                <div>
                  <div className="font-mono text-lg font-bold" style={{ color: c }}>{s === "+" ? "Create" : s === "~" ? "Update" : "Destroy"}</div>
                  <div className="text-base text-mute">{t}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    notes: "Four commands in daily use.\ninit downloads the provider plugins; run it first. (It also installs modules and sets up where state is stored.)\nplan shows a preview and touches nothing. + will be created, ~ changed, - destroyed. A replacement shows as -/+.\napply makes the changes real, after you confirm.\ndestroy tears down what this configuration manages when you are done experimenting.\nHabit to teach: read the plan, every time. To apply exactly what you reviewed, save it: terraform plan -out=tfplan, then terraform apply tfplan.",
  },
  {
    id: "fund-state", section: "fundamentals", type: "side", title: "State",
    subtitle: "terraform.tfstate records what Terraform manages. That is how it maps code to real cloud IDs.",
    body: (
      <div className="flex w-full items-center gap-10">
        <div className="flex-1 space-y-6">
          <StateDiagram accent={P} />
          <div className="rounded-xl border border-line bg-panel p-4 font-mono text-lg text-mute">
            <span className="text-ink font-semibold">Under the hood in terraform.tfstate:</span>
            <pre className="mt-2 text-ink/90 overflow-x-auto text-base bg-bg p-2.5 rounded-lg border border-line/60">
{`"resources": [
  {
    "type": "aws_s3_bucket",
    "name": "logs",
    "id": "my-logs-bucket-98765",
    "arn": "arn:aws:s3:::my-logs-bucket-98765"
  }
]`}
            </pre>
          </div>
        </div>

        <div className="w-[440px] shrink-0 space-y-6">
          <ConceptCard
            icon={Database}
            name="Three Golden Rules"
            accent={O}
            items={[
              "Never edit it by hand: JSON formatting and metadata are strictly managed by Terraform.",
              "Keep it out of Git: state files can contain plaintext passwords, tokens, and secret strings.",
              "In a team, store it remotely: use AWS S3 with DynamoDB state locking to prevent collisions.",
            ]}
          />
        </div>
      </div>
    ),
    notes: "This is the concept that trips up beginners.\nTerraform keeps a file, terraform.tfstate, recording the resources it manages. Without it, Terraform cannot tell what is its own.\nThree rules: do not edit it by hand; keep it out of Git because it can contain secrets; in a team, store it remotely.\nRemote state with locking stops two people making conflicting changes at the same time. Person 3 covers that.\nPerson 2 shows how state fits with the configuration.",
  },
  {
    id: "fund-reuse", section: "fundamentals", type: "visual", title: "Making code reusable",
    subtitle: "Four building blocks turn static hardcoded files into modular, production-ready code.",
    body: (
      <div className="grid w-full grid-cols-4 gap-6">
        <ConceptCard
          icon={SlidersHorizontal}
          name="Variables"
          badge="Inputs"
          accent={P}
          code={`variable "env" {
  type    = string
  default = "dev"
}`}
          text="Parameterize code so the same files build dev, staging, and prod without duplicating code."
        />
        <ConceptCard
          icon={Upload}
          name="Outputs"
          badge="Results"
          accent={T}
          code={`output "url" {
  value = aws_lb.web.dns_name
}`}
          text="Print useful values after apply (like load balancer URLs, server IPs, and database hostnames)."
        />
        <ConceptCard
          icon={Package}
          name="Modules"
          badge="Packages"
          accent={O}
          code={`module "vpc" {
  source = "./modules/vpc"
  cidr   = "10.0.0.0/16"
}`}
          text="Package related resources into clean, reusable components with defined inputs and outputs."
        />
        <ConceptCard
          icon={Search}
          name="Data sources"
          badge="Lookups"
          accent="#60A5FA"
          code={`data "aws_vpc" "default" {
  default = true
}`}
          text="Query information about existing resources in AWS without creating or managing them in code."
        />
      </div>
    ),
    notes: "As you learn, you will want reusable code. Four ideas, one line each.\nVariables pass in values such as an environment name, so the same code can build dev, test and prod.\nOutputs print results after an apply, such as a server's IP address.\nModules bundle related resources into a reusable package.\nData sources read information about things that already exist.\nPerson 2 explains how each fits into a configuration.",
  },
  {
    id: "fund-mistakes", section: "fundamentals", type: "visual", title: "Mistakes to avoid early",
    subtitle: "Three common pitfalls that trap beginners, and how professionals prevent them.",
    body: (
      <div className="grid w-full grid-cols-3 gap-8">
        <ConceptCard
          icon={Hand}
          name="1. Manual Console Edits"
          badge="Causes Drift"
          accent={O}
          items={[
            "Pitfall: Tweaking security groups or firewall ports directly in AWS Console.",
            "Consequence: Configuration drift — code and reality diverge silently.",
            "Fix: Make every change in .tf code; run 'terraform plan' to catch drift.",
          ]}
        />
        <ConceptCard
          icon={KeyRound}
          name="2. Hardcoding Secrets"
          badge="Security Leak"
          accent={R}
          items={[
            "Pitfall: Writing database passwords or AWS secret keys directly in files.",
            "Consequence: Credentials leaked to Git repositories and version history.",
            "Fix: Inject secrets via AWS SSM Parameter Store, Secrets Manager, or TF_VAR_.",
          ]}
        />
        <ConceptCard
          icon={Wallet}
          name="3. Abandoned Resources"
          badge="Surprise Bills"
          accent={T}
          items={[
            "Pitfall: Leaving experimental EC2 instances, ALBs, and databases running.",
            "Consequence: Cloud charges compound rapidly when forgotten.",
            "Fix: Always run 'terraform destroy' when testing ends; use resource tagging.",
          ]}
        />
      </div>
    ),
    notes: "Three habits that save you early.\nDo not change Terraform-managed resources by hand in the console; the real world drifts away from your code. Person 3 returns to drift.\nNever hardcode passwords or access keys in your files. Secrets can also end up in state, so state needs protecting too.\nDestroy your practice resources. Forgotten test servers are a classic source of surprise bills.",
  },
  {
    id: "fund-takeaway", section: "fundamentals", type: "visual", title: "Takeaway",
    body: <KeyTakeaway accent={P} text="Describe the infrastructure you want. Terraform works out how to build it. Always read the plan." points={["Declarative", "init, plan, apply", "State"]} />,
    notes: "One breath: clicking does not scale, so we describe infrastructure as code. Terraform is declarative, works through init, plan and apply, and keeps track of what it manages in state.\nHand off to Person 2: what are the building blocks you actually write?",
  },
];
