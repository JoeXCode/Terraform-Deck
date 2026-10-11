import { Hand, KeyRound, Database, Package, Search, SlidersHorizontal, Upload, Wallet } from "lucide-react";
import type { SlideData } from "@/lib/types";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { CodeBlock } from "@/components/CodeBlock";
import { ConceptCard } from "@/components/ConceptCard";
import { KeyTakeaway } from "@/components/KeyTakeaway";
import { StateDiagram } from "@/components/StateDiagram";
import { WorkflowDiagram } from "@/components/WorkflowDiagram";
import { chip } from "@/lib/ui";

// Saad: Fundamentals. "What is Terraform and why does it exist?"
// Built from the research document "Terraform Explained from Scratch" (Terraform_Fundamentals.docx).
const P = "#7B42BC", O = "#FF9900", T = "#2DD4BF", R = "#F87171";

const hcl = `provider "aws" {
  region = "eu-west-1"
}

resource "aws_s3_bucket" "state" {
  bucket = "\${var.group_name}-tfstate-\${data.aws_caller_identity.me.account_id}"
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
      <div className="w-full space-y-6">
        <div className="grid grid-cols-2 gap-8">
          <div className="rounded-xl border border-line bg-panel p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-line">
                <span className="font-mono text-2xl font-bold" style={{ color: O }}>By hand (ClickOps)</span>
                <span className="rounded px-2.5 py-0.5 font-mono text-base text-mute bg-bg border border-line">Manual & Fragile</span>
              </div>
              <div className="mt-5">
                <ArchitectureDiagram direction="row" compact accent={O} nodes={[
                  { id: "b1", label: "Console clicks", sub: "no written record" },
                  { id: "b2", label: "Built once", sub: "works today only" },
                  { id: "b3", label: "Rebuild later", sub: "relies on memory" },
                  { id: "b4", label: "Outage happens", sub: "what changed?" },
                ]} />
              </div>
            </div>
            <ul className="mt-6 space-y-3.5 text-xl text-mute border-t border-line/60 pt-5">
              <li className="flex items-start gap-3"><span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: O }} /><span><b className="text-ink">No change history:</b> Nobody knows who clicked what, when it changed, or why it broke.</span></li>
              <li className="flex items-start gap-3"><span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: O }} /><span><b className="text-ink">Environments drift apart:</b> Dev, staging, and prod silently become different because people make untracked manual edits.</span></li>
              <li className="flex items-start gap-3"><span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: O }} /><span><b className="text-ink">Slow disaster recovery:</b> If an environment is deleted or fails, rebuilding it from memory takes hours or days.</span></li>
            </ul>
          </div>

          <div className="rounded-xl border border-line bg-panel p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-line">
                <span className="font-mono text-2xl font-bold" style={{ color: P }}>As code (IaC)</span>
                <span className="rounded px-2.5 py-0.5 font-mono text-base text-ink font-semibold" style={{ background: P + "22", border: `1px solid ${P}55` }}>Automated & Repeatable</span>
              </div>
              <div className="mt-5">
                <ArchitectureDiagram direction="row" compact accent={P} startDelay={0.5} nodes={[
                  { id: "a1", label: "Write code", sub: "declarative .tf file" },
                  { id: "a2", label: "Peer review", sub: "approved in Git" },
                  { id: "a3", label: "terraform apply", sub: "automated build" },
                  { id: "a4", label: "Rebuild anytime", sub: "100% identical copy" },
                ]} />
              </div>
            </div>
            <ul className="mt-6 space-y-3.5 text-xl text-mute border-t border-line/60 pt-5">
              <li className="flex items-start gap-3"><span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: P }} /><span><b className="text-ink">Full version control:</b> Every change is tracked, reviewed by teammates, and easy to roll back in Git.</span></li>
              <li className="flex items-start gap-3"><span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: P }} /><span><b className="text-ink">100% identical environments:</b> Spin up dev, staging, or production from the same code with zero guesswork.</span></li>
              <li className="flex items-start gap-3"><span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: P }} /><span><b className="text-ink">Clear source of truth:</b> Your code files document the whole cloud setup—no hidden clicks or tribal knowledge.</span></li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-panel p-4 text-xl text-mute flex items-center justify-between">
          <div><b className="text-ink">The Big Shift:</b> Stop clicking buttons in cloud consoles. Describe your infrastructure in code so it can be versioned, reviewed, and built automatically.</div>
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
          <CodeBlock code={hcl} accent={P} highlight={[5, 6, 7]} labels={{ 1: "Provider: AWS plugin (eu-west-1)", 5: "Resource: state bucket with dynamic ID" }} />
          <div className="rounded-xl border border-line bg-panel p-5 text-lg text-mute leading-snug">
            <p className="font-semibold text-ink text-xl mb-1.5 font-mono" style={{ color: P }}>Declarative vs Imperative:</p>
            <p>• <b className="text-ink">Imperative (Scripts):</b> You write the step-by-step commands (create bucket, add tag). If it fails midway, re-running can break or create duplicate resources.</p>
            <p className="mt-1.5">• <b className="text-ink">Declarative (Terraform):</b> You specify the <i>target end state</i>. Terraform inspects what exists, calculates the diff, and takes only the exact actions needed.</p>
          </div>
        </div>

        <div className="space-y-5">
          <ArchitectureDiagram accent={P} nodes={[
            { id: "d", label: "What you describe", sub: "one S3 bucket in eu-west-1", edge: "compared with" },
            { id: "e", label: "What exists", sub: "tracked in state + live AWS query", edge: "generates" },
            { id: "p", label: "Execution plan", sub: "precise list of creates, changes, deletes" }
          ]} />
          <div className="rounded-xl border border-line bg-panel p-5 text-lg leading-snug text-mute">
            <span className="font-mono text-ink font-semibold">The Reconciliation Engine:</span> Terraform is a reconciliation loop. It continuously compares your desired code against real cloud infrastructure, keeping them in sync.
          </div>
        </div>
      </div>
    ),
    notes: "Terraform is declarative: you say 'I want one storage bucket in eu-west-1', not the manual steps to get there.\nHere the bucket name is built dynamically from var.group_name and the AWS account ID so it is guaranteed to be globally unique.\nTerraform compares your description with what it already manages, and works out what to create, change or remove.\nRead the file aloud. The provider connects Terraform to AWS in eu-west-1. The resource defines what to build; 'state' is its local name.\nPrecisely: it compares your configuration with state, refreshed from the live infrastructure.\nIf asked: HashiCorp moved Terraform to the Business Source License in 2023; OpenTofu is a community fork.",
  },
  {
    id: "fund-commands", section: "fundamentals", type: "visual", title: "The everyday commands",
    subtitle: "Day to day, you work with four core commands. Always read the plan before confirming.",
    body: (
      <div className="w-full space-y-6">
        <div className="grid grid-cols-2 gap-5">
          <ConceptCard
            name="1. init"
            badge="Setup"
            accent={T}
            items={[
              "Downloads required provider plugins (e.g. AWS plugin for eu-west-1)",
              "Initializes module packages and connects to remote state backend",
            ]}
            footer="Run first, and whenever plugins or backend configurations change"
          />
          <ConceptCard
            name="2. plan"
            badge="Preview"
            accent={O}
            items={[
              "Queries real cloud state via live AWS APIs to check current reality",
              "Compares live resources to your .tf files and outputs exact proposed changes",
            ]}
            footer="Dry-run safety net: modifies nothing in your cloud environment"
          />
          <ConceptCard
            name="3. apply"
            badge="Execute"
            accent={P}
            items={[
              "Prompts for explicit human confirmation (type 'yes') before executing",
              "Calls cloud APIs in dependency order and updates terraform.tfstate upon completion",
            ]}
            footer="Creates, modifies, or deletes real infrastructure"
          />
          <ConceptCard
            name="4. destroy"
            badge="Teardown"
            accent={R}
            items={[
              "Calculates reverse dependency graph to delete all managed resources safely",
              "Tears down experimental infrastructure while leaving untracked resources untouched",
            ]}
            footer="Used for ephemeral testing and cleanup to prevent unexpected cloud bills"
          />
        </div>

        <div>
          <p className="mb-3 font-mono text-xl text-mute">Key symbols in the plan preview:</p>
          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-xl border border-line bg-panel p-5 flex items-center gap-6">
              <span className="font-mono text-5xl font-bold" style={{ color: T }}>+</span>
              <div>
                <div className="font-mono text-2xl font-bold" style={{ color: T }}>+ Create</div>
                <div className="text-lg text-mute">Will create a brand-new cloud resource</div>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-panel p-5 flex items-center gap-6">
              <span className="font-mono text-5xl font-bold" style={{ color: O }}>~</span>
              <div>
                <div className="font-mono text-2xl font-bold" style={{ color: O }}>~ Update</div>
                <div className="text-lg text-mute">Will modify existing resource in-place</div>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-panel p-5 flex items-center gap-6">
              <span className="font-mono text-5xl font-bold" style={{ color: R }}>-</span>
              <div>
                <div className="font-mono text-2xl font-bold" style={{ color: R }}>- Destroy</div>
                <div className="text-lg text-mute">Will delete this cloud resource completely</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    notes: "Four commands in daily use.\ninit downloads provider plugins; run it first whenever code or backends change.\nplan previews the changes without touching live infrastructure: + create, ~ update, - destroy. (A replace shows as -/+).\napply makes changes real, only after you type 'yes'.\ndestroy tears down everything managed by this project.\nGolden rule: always read the full plan output before confirming an apply.",
  },
  {
    id: "fund-state", section: "fundamentals", type: "side", title: "State",
    subtitle: "terraform.tfstate records what Terraform manages. That is how it maps code to real cloud IDs.",
    body: (
      <div className="flex w-full items-center gap-10">
        <div className="flex-1 space-y-6">
          <StateDiagram accent={P} />
          <div className="rounded-xl border border-line bg-panel p-5 font-mono text-lg text-mute">
            <span className="text-ink font-semibold">Under the hood in terraform.tfstate:</span>
            <pre className="mt-2.5 text-ink/90 overflow-x-auto text-base bg-bg p-3.5 rounded-lg border border-line/60">
{`"resources": [
  {
    "type": "aws_s3_bucket",
    "name": "state",
    "id": "mygroup-tfstate-123456789012",
    "arn": "arn:aws:s3:::mygroup-tfstate-123456789012",
    "region": "eu-west-1"
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
    notes: "This is the concept that trips up beginners.\nTerraform keeps a file, terraform.tfstate, recording the resources it manages. Without it, Terraform cannot tell what is its own.\nNotice the under-the-hood record for our state bucket in eu-west-1: it maps the resource name 'state' to the real bucket ID and ARN.\nThree rules: do not edit it by hand; keep it out of Git because it can contain secrets; in a team, store it remotely.\nRemote state with locking stops two people making conflicting changes at the same time. Joseph covers that.\nSaad shows how state fits with the configuration.",
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
          text="Values passed in from outside - like function inputs. Lets you use the exact same code files to build dev, staging, and prod without duplicating code."
        />
        <ConceptCard
          icon={Upload}
          name="Outputs"
          badge="Results"
          accent={T}
          code={`output "bucket_arn" {
  value = aws_s3_bucket.state.arn
}`}
          text="Values printed on your screen after apply - like function return values. Exposes newly created details like bucket ARNs, server IPs, and URLs."
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
          text="Bundles of related resources packaged together - like reusable code libraries. Lets you deploy an entire network architecture in just 3 lines."
        />
        <ConceptCard
          icon={Search}
          name="Data sources"
          badge="Lookups"
          accent="#60A5FA"
          code={`data "aws_vpc" "default" {
  default = true
}`}
          text="Read-only queries to fetch details about resources that already exist in AWS. Reads information without creating or modifying anything in code."
        />
      </div>
    ),
    notes: "Think of Terraform like writing standard functions in programming:\n1. Variables are your inputs: pass in 'dev' or 'prod' so one file builds any environment.\n2. Outputs are return values: they tell you what was created, like a server IP or bucket ARN.\n3. Modules are reusable libraries: package 10 resources together so teams don't repeat code.\n4. Data Sources are read-only lookups: query existing AWS resources without creating new ones.\nSaad explains how each fits into a configuration.",
  },
  {
    id: "fund-mistakes", section: "fundamentals", type: "visual", title: "Mistakes to avoid early",
    subtitle: "Three common beginner mistakes, what goes wrong, and how to stay safe.",
    body: (
      <div className="w-full space-y-6">
        <div className="grid grid-cols-3 gap-7">
          <div className="rounded-2xl border border-line bg-panel p-7 flex flex-col justify-between" style={{ boxShadow: `inset 4px 0 0 ${O}` }}>
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-line">
                <div className="flex items-center gap-3">
                  <Hand size={32} color={O} />
                  <span className="font-mono text-2xl font-bold text-ink">1. Console Edits</span>
                </div>
                <span className="rounded px-2.5 py-1 font-mono text-sm font-semibold uppercase tracking-wider" style={{ background: O + "22", color: O, border: `1px solid ${O}44` }}>Causes Drift</span>
              </div>
              <ul className="mt-5 space-y-4 text-xl text-mute">
                <li className="flex items-start gap-3">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: O }} />
                  <span><b className="text-ink">The mistake:</b> Clicking buttons in AWS Console to tweak firewall rules or server settings by hand.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: O }} />
                  <span><b className="text-ink">The danger:</b> Code and reality silently drift apart - teammates have no record of what changed or why.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: O }} />
                  <span><b className="text-ink">The rule:</b> Make every single change in your .tf code and apply it through Terraform.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-panel p-7 flex flex-col justify-between" style={{ boxShadow: `inset 4px 0 0 ${R}` }}>
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-line">
                <div className="flex items-center gap-3">
                  <KeyRound size={32} color={R} />
                  <span className="font-mono text-2xl font-bold text-ink">2. Hardcoding Secrets</span>
                </div>
                <span className="rounded px-2.5 py-1 font-mono text-sm font-semibold uppercase tracking-wider" style={{ background: R + "22", color: R, border: `1px solid ${R}44` }}>Security Leak</span>
              </div>
              <ul className="mt-5 space-y-4 text-xl text-mute">
                <li className="flex items-start gap-3">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: R }} />
                  <span><b className="text-ink">The mistake:</b> Writing database passwords or AWS secret keys directly inside plain text files.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: R }} />
                  <span><b className="text-ink">The danger:</b> Secrets get pushed into Git history - anyone with repository access can see and use them.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: R }} />
                  <span><b className="text-ink">The rule:</b> Pass secrets through environment variables or secure cloud secret vaults.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-panel p-7 flex flex-col justify-between" style={{ boxShadow: `inset 4px 0 0 ${T}` }}>
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-line">
                <div className="flex items-center gap-3">
                  <Wallet size={32} color={T} />
                  <span className="font-mono text-2xl font-bold text-ink">3. Abandoned Servers</span>
                </div>
                <span className="rounded px-2.5 py-1 font-mono text-sm font-semibold uppercase tracking-wider" style={{ background: T + "22", color: T, border: `1px solid ${T}44` }}>Surprise Bills</span>
              </div>
              <ul className="mt-5 space-y-4 text-xl text-mute">
                <li className="flex items-start gap-3">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: T }} />
                  <span><b className="text-ink">The mistake:</b> Leaving practice databases, virtual machines, and load balancers running overnight.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: T }} />
                  <span><b className="text-ink">The danger:</b> Cloud charges accumulate hour by hour - forgotten test setups cause sudden bill shocks.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2.5 h-2 w-2 rounded-full shrink-0" style={{ background: T }} />
                  <span><b className="text-ink">The rule:</b> When testing is done, always run 'terraform destroy' to cleanly remove resources.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-panel p-4 text-xl text-mute flex items-center justify-between">
          <div><b className="text-ink">Golden Rule:</b> Treat infrastructure like production software - manage it through code, keep secrets out of Git, and destroy test resources when finished.</div>
        </div>
      </div>
    ),
    notes: "Three practical habits that keep you safe:\n1. Never edit resources by hand in the console - it creates configuration drift. Joseph returns to drift later.\n2. Never hardcode passwords or API keys in files. Inject them securely.\n3. Always destroy practice resources when finished - forgotten test servers are the #1 cause of surprise bills.",
  },
  {
    id: "fund-takeaway", section: "fundamentals", type: "visual", title: "Takeaway",
    body: <KeyTakeaway accent={P} text="Describe the infrastructure you want. Terraform works out how to build it. Always read the plan." points={["Declarative", "init, plan, apply", "State"]} />,
    notes: "One breath: clicking does not scale, so we describe infrastructure as code. Terraform is declarative, works through init, plan and apply, and keeps track of what it manages in state.\nHand off to Saad: what are the building blocks you actually write?",
  },
];
