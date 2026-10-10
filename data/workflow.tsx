import { Database, GitCompare, ShieldAlert } from "lucide-react";
import type { SlideData } from "@/lib/types";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ConceptCard } from "@/components/ConceptCard";
import { KeyTakeaway } from "@/components/KeyTakeaway";
import { ProjectExample } from "@/components/ProjectExample";

// PERSON 3: Workflow & Collaboration.
// "How does Terraform move from code on a developer's machine to safely managed infrastructure?"
const O = "#FF9900", T = "#2DD4BF", B = "#60A5FA";

import { chip } from "@/lib/ui";

export const workflowSlides: SlideData[] = [
  {
    id: "workflow-intro", section: "workflow", type: "section", title: "Workflow & Collaboration",
    notes: "The question: how does Terraform move from code on one developer's machine to safely managed infrastructure?\nFour steps: the command lifecycle, state, locking, and the team workflow around Git and pipelines.",
  },
  {
    id: "wf-lifecycle", section: "workflow", type: "visual", title: "From code to infrastructure",
    subtitle: "The complete CLI workflow: from local authoring to production deployment.",
    body: (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-line bg-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-bold" style={{ color: T }}>1. Prepare & Validate</span>
              <span className="rounded bg-bg border border-line px-2 py-0.5 font-mono text-xs text-mute">Offline checks</span>
            </div>
            <ArchitectureDiagram direction="row" compact accent={T} nodes={[
              { id: "w", label: "Write", sub: ".tf files" },
              { id: "f", label: "fmt", sub: "clean styling" },
              { id: "i", label: "init", sub: "plugins & backend" },
              { id: "v", label: "validate", sub: "syntax & types" },
            ]} />
            <div className="text-base text-mute space-y-1 border-t border-line/60 pt-2.5">
              <p>• <b className="text-ink font-mono">fmt:</b> Automatically formats indentation and aligns assignments across team.</p>
              <p>• <b className="text-ink font-mono">validate:</b> Catches missing variables, type errors, and syntax bugs without calling cloud APIs.</p>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-bold" style={{ color: O }}>2. Plan & Apply</span>
              <span className="rounded bg-bg border border-line px-2 py-0.5 font-mono text-xs text-mute">Live Cloud Execution</span>
            </div>
            <ArchitectureDiagram direction="row" compact accent={O} startDelay={0.5} nodes={[
              { id: "p", label: "Plan", sub: "dry run diff" },
              { id: "r", label: "Review", sub: "human gate" },
              { id: "a", label: "Apply", sub: "run API calls" },
              { id: "s", label: "State", sub: "write record" },
            ]} />
            <div className="text-base text-mute space-y-1 border-t border-line/60 pt-2.5">
              <p>• <b className="text-ink font-mono">plan -out=tfplan:</b> Saves exact proposed actions into an immutable preview file.</p>
              <p>• <b className="text-ink font-mono">apply tfplan:</b> Guarantees execution of only the reviewed plan with zero race conditions.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-line bg-panel p-4 font-mono text-base">
          <span><span className="font-bold text-aws">terraform destroy:</span> Safe teardown tool that reads state and deletes managed objects in reverse order.</span>
          <span className="rounded bg-bg border border-line px-2.5 py-0.5 text-sm text-mute">Protected in prod via prevent_destroy</span>
        </div>
      </div>
    ),
    notes: "Walk left to right, top to bottom.\nWrite the configuration. fmt rewrites files into the canonical style. init prepares the working directory: it downloads providers and modules and sets up the state backend; run it first and again when those change. validate checks syntax and internal consistency without calling remote services.\nplan builds an execution plan: what Terraform would create, change or destroy. Review is a human step, and the most important one. apply carries out the changes, asks for approval unless told otherwise, and updates state.\ndestroy removes everything the configuration manages. Use it deliberately.\nKey message: always plan before apply.",
  },
  {
    id: "wf-state", section: "workflow", type: "visual", title: "State in a team",
    subtitle: "Local state fails in teams. A central remote backend with locking is mandatory.",
    body: (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-[1.1fr_1fr] gap-6">
          <div className="rounded-xl border border-line bg-panel p-4 space-y-2.5">
            <span className="font-mono text-xl font-bold" style={{ color: O }}>Our Production Remote Backend</span>
            <pre className="overflow-x-auto rounded-lg border border-line/60 bg-bg p-2.5 font-mono text-sm leading-snug text-ink">
{`terraform {
  backend "s3" {
    bucket         = "group1b-tfstate-565122144736"
    key            = "infra/terraform.tfstate"
    region         = "eu-west-1"
    dynamodb_table = "group1b-tflock"
    encrypt        = true
  }
}`}
            </pre>
            <p className="font-mono text-xs text-mute">Configured in personal_internship/infra/versions.tf</p>
          </div>

          <div>
            <ConceptCard
              compact
              icon={Database}
              name="Why S3 Remote State"
              badge="Source of Truth"
              accent={T}
              items={[
                "Centralized: entire team works against the same real cloud state.",
                "Versioned: S3 bucket versioning enables instant rollback if state corrupts.",
                "Encrypted: AES-256 encryption protects database passwords & secret tokens.",
              ]}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <ConceptCard
            compact
            icon={GitCompare}
            name="Configuration Drift"
            badge="Detection"
            accent={B}
            items={[
              "Problem: Someone manually opens a port in AWS Console or changes an instance size.",
              "Detection: 'terraform plan' refreshes live cloud and flags the unexpected difference.",
              "Remediation: 'terraform apply' safely overwrites manual tweaks back to the approved code.",
            ]}
          />
          <ConceptCard
            compact
            icon={ShieldAlert}
            name="State Security & Access"
            badge="Governance"
            accent={O}
            items={[
              "Never commit state to Git: terraform.tfstate contains sensitive connection strings.",
              "IAM Least Privilege: only CI/CD runners and authorized admins can read the S3 state bucket.",
              "Audit Logging: AWS CloudTrail logs every read and write to the state bucket.",
            ]}
          />
        </div>
      </div>
    ),
    notes: "Why state: Terraform must know which real object belongs to which resource in the configuration, and it stores their attributes.\nLocal state is a terraform.tfstate file on one machine. Fine alone; for a team, copies diverge. Remote state lives in a shared backend such as an S3 bucket, and many backends also support locking.\nDrift: someone changes infrastructure outside Terraform. plan refreshes from the real world and proposes to bring it back in line with the configuration.\nSecurity: state can contain sensitive values in plain text, so encrypt it, restrict access, and never commit it to Git.\n[FILL IN before presenting: which backend does the reference project use? Check the project files.]",
  },
  {
    id: "wf-locking", section: "workflow", type: "visual", title: "State locking",
    subtitle: "DynamoDB state locking prevents race conditions and corrupted cloud states.",
    body: (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-line bg-panel p-4 space-y-3">
            <p className="font-mono text-xl font-bold" style={{ color: T }}>Engineer A: Acquires Exclusive Lock</p>
            <ArchitectureDiagram direction="row" compact accent={T} nodes={[
              { id: "a1", label: "terraform apply", sub: "starts run" },
              { id: "a2", label: "DynamoDB Lock", sub: "writes LockID item" },
              { id: "a3", label: "Modify Cloud", sub: "ECS / RDS / ALB" },
              { id: "a4", label: "Release Lock", sub: "item deleted" },
            ]} />
            <p className="text-base text-mute pt-1.5 border-t border-line/60">
              Lock records caller info, timestamp, and operation hash to ensure uninterrupted atomicity.
            </p>
          </div>

          <div className="rounded-xl border border-line bg-panel p-4 space-y-3">
            <p className="font-mono text-xl font-bold" style={{ color: O }}>Engineer B: Blocked Safely</p>
            <ArchitectureDiagram direction="row" compact accent={O} startDelay={0.5} nodes={[
              { id: "b1", label: "terraform apply", sub: "concurrent run" },
              { id: "b2", label: "Lock Check", sub: "lock exists in DynamoDB" },
              { id: "b3", label: "Halts Execution", sub: "Error acquiring lock" },
            ]} />
            <p className="text-base text-mute pt-1.5 border-t border-line/60">
              Terraform rejects concurrent execution immediately: <code className="text-ink">Error: Error acquiring the state lock</code>.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-panel p-4 font-mono text-base space-y-1.5">
          <div className="flex items-center justify-between text-ink font-bold">
            <span>Disaster Recovery: Stuck Locks after a crash</span>
            <span className="rounded bg-bg border border-line px-2.5 py-0.5 text-sm text-aws font-semibold">terraform force-unlock</span>
          </div>
          <p className="text-mute text-sm font-sans">
            If a CI/CD runner crashes or network disconnects while holding the lock, administrators can safely clear it using:
            <code className="ml-2 font-mono text-ink bg-bg px-1.5 py-0.5 rounded border border-line">terraform force-unlock &lt;LOCK-ID&gt;</code> after verifying no operation is running.
          </p>
        </div>
      </div>
    ),
    notes: "Follow Engineer A: apply starts, Terraform acquires a lock on the state, makes the infrastructure changes, writes the new state, then releases the lock.\nEngineer B runs apply while the lock is held. Terraform cannot get the lock, so by default it stops with an error showing who holds it. With the -lock-timeout option it waits for the lock instead.\nWhy it matters: two simultaneous runs could overwrite each other's state updates and leave state out of step with reality.\nPrecision: locking needs a backend that supports it. Operations that can write state, including plan by default, take the lock. If a lock is stuck after a crash, terraform force-unlock exists, but use it carefully.",
  },
  {
    id: "wf-team", section: "workflow", type: "visual", title: "The team workflow",
    subtitle: "Enterprise delivery: Git feature branches, automated PR plan gates, and CI/CD pipelines.",
    body: (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-line bg-panel p-4 space-y-3">
            <p className="font-mono text-xl font-bold" style={{ color: B }}>Phase 1: Propose & PR Review Gate</p>
            <ArchitectureDiagram direction="row" compact accent={B} nodes={[
              { id: "d", label: "Developer", sub: "feat/ecs-scaling" },
              { id: "g", label: "GitHub PR", sub: "triggers Actions" },
              { id: "pr", label: "Speculative Plan", sub: "posted to PR diff" },
              { id: "rv", label: "Peer Approval", sub: "verify changes" },
            ]} />
          </div>

          <div className="rounded-xl border border-line bg-panel p-4 space-y-3">
            <p className="font-mono text-xl font-bold" style={{ color: O }}>Phase 2: Automated Apply & Delivery</p>
            <ArchitectureDiagram direction="row" compact accent={O} startDelay={0.5} nodes={[
              { id: "m", label: "Merge to main", sub: "approval granted" },
              { id: "pl", label: "GitHub Actions", sub: "OIDC auth to AWS" },
              { id: "in", label: "Live Cloud", sub: "AWS Fargate updated" },
            ]} />
          </div>
        </div>

        <ProjectExample
          compact
          title="Production CI/CD Automation: GitHub Actions & AWS OIDC"
          subtitle="Team Delivery Pipeline"
          what="How our team delivers infrastructure safely without static credentials on developer laptops:"
          points={[
            "Trunk-based workflow: Short-lived feature branches, no direct pushes to main",
            "PR checks: Automated 'terraform fmt -check' and 'terraform validate'",
            "Speculative plan: CI runner generates plan and posts diff comment directly on the PR",
            "AWS OIDC authentication: Zero long-lived AWS secret access keys stored in GitHub",
          ]}
          tags={["GitHub Actions", "AWS OIDC", "Pull Request Gates", "Zero Static Secrets"]}
        />
      </div>
    ),
    notes: "A common team flow: a developer works on a Git branch, opens a pull request so teammates see exactly what changed, and the team reviews. Many teams also run terraform plan in CI and attach its output, so reviewers see the effect on infrastructure. After merge, a pipeline runs init, plan and apply against the shared remote state.\nBenefits: every change is reviewed, history lives in Git, and apply runs the same way each time instead of from individual laptops. Modules let teams reuse tested building blocks.\nTeams differ in the details; this is a typical pattern, not the only one.\nTHE PLACEHOLDER: replace it with how the reference project is really deployed. Do not guess.",
  },
  {
    id: "wf-debugging", section: "workflow", type: "visual", title: "Real-world pipeline debugging",
    subtitle: "Four production blockers we resolved while automating GitHub Actions with AWS OIDC.",
    body: (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-2 gap-5">
          <div className="rounded-xl border border-line bg-panel p-5" style={{ boxShadow: `inset 4px 0 0 #F87171` }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-bold text-ink">Could not assume role with OIDC</span>
              <span className="rounded px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider" style={{ background: "#F8717122", color: "#F87171" }}>IAM & Trust Policy</span>
            </div>
            <div className="mt-3 rounded-lg border border-line/60 bg-bg p-3 text-sm">
              <span className="font-mono font-semibold text-rose-400">Cause:</span>
              <span className="ml-2 text-mute">AWS rejected GitHub Actions' request to assume the IAM plan role.</span>
            </div>
            <div className="mt-2.5 rounded-lg border border-line/60 bg-bg p-3 text-sm">
              <span className="font-mono font-semibold text-teal-400">Correction:</span>
              <span className="ml-2 text-ink">Checked IAM OIDC provider, role ARN, repository variables, workflow permissions and trust policy.</span>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5" style={{ boxShadow: `inset 4px 0 0 #60A5FA` }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-bold text-ink">Terraform Core version mismatch</span>
              <span className="rounded px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider" style={{ background: "#60A5FA22", color: "#60A5FA" }}>Version Parity</span>
            </div>
            <div className="mt-3 rounded-lg border border-line/60 bg-bg p-3 text-sm">
              <span className="font-mono font-semibold text-rose-400">Cause:</span>
              <span className="ml-2 text-mute">versions.tf required ~&gt; 1.16, while GitHub Actions installed Terraform 1.9.8.</span>
            </div>
            <div className="mt-2.5 rounded-lg border border-line/60 bg-bg p-3 text-sm">
              <span className="font-mono font-semibold text-teal-400">Correction:</span>
              <span className="ml-2 text-ink">Changed the constraint to ~&gt; 1.9.0 to match the workflow's Terraform version.</span>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5" style={{ boxShadow: `inset 4px 0 0 #2DD4BF` }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-bold text-ink">ci.tfvars does not exist</span>
              <span className="rounded px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider" style={{ background: "#2DD4BF22", color: "#2DD4BF" }}>Git & Config</span>
            </div>
            <div className="mt-3 rounded-lg border border-line/60 bg-bg p-3 text-sm">
              <span className="font-mono font-semibold text-rose-400">Cause:</span>
              <span className="ml-2 text-mute">The GitHub runner could not find the variable file inside the infra working directory.</span>
            </div>
            <div className="mt-2.5 rounded-lg border border-line/60 bg-bg p-3 text-sm">
              <span className="font-mono font-semibold text-teal-400">Correction:</span>
              <span className="ml-2 text-ink">Adjusted Git's ignore configuration so the non-secret infra/ci.tfvars file could be committed.</span>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-panel p-5" style={{ boxShadow: `inset 4px 0 0 #FF9900` }}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xl font-bold text-ink">Workflow authentication and configuration</span>
              <span className="rounded px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-wider" style={{ background: "#FF990022", color: "#FF9900" }}>OIDC Permissions</span>
            </div>
            <div className="mt-3 rounded-lg border border-line/60 bg-bg p-3 text-sm">
              <span className="font-mono font-semibold text-rose-400">Cause:</span>
              <span className="ml-2 text-mute">The workflow needed the correct repository variables and OIDC permissions.</span>
            </div>
            <div className="mt-2.5 rounded-lg border border-line/60 bg-bg p-3 text-sm">
              <span className="font-mono font-semibold text-teal-400">Correction:</span>
              <span className="ml-2 text-ink">Verified AWS_PLAN_ROLE_ARN, AWS_REGION, and id-token: write.</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-line bg-panel px-6 py-3 font-mono text-sm">
          <span><span className="font-bold text-ink">Takeaway from our internship:</span> Real-world pipeline failures are rarely HCL syntax errors — they are IAM trust relationships, runner permissions, and Git tracking hygiene.</span>
          <span className="rounded bg-bg border border-line px-2.5 py-0.5 text-xs text-mute">GitHub Actions • AWS OIDC</span>
        </div>
      </div>
    ),
    notes: "Share our real engineering experience here.\nWhen setting up the automated pipeline, we hit four distinct hurdles:\n1. OIDC role assumption failed because the IAM trust policy didn't match the repo/branch.\n2. Terraform version mismatch: local code asked for 1.16 while CI ran 1.9.8; we pinned to ~> 1.9.0.\n3. ci.tfvars was swallowed by .gitignore (*.tfvars) so the runner had missing variables until we explicitly un-ignored it.\n4. GitHub Actions couldn't mint OIDC tokens until we granted 'permissions: id-token: write' and wired the repository secrets and variables.",
  },
  {
    id: "wf-takeaway", section: "workflow", type: "visual", title: "Takeaway",
    body: <KeyTakeaway accent={O} text="Code is reviewed, planned, then applied through a pipeline. Remote state with locking keeps the whole team safe." points={["Plan before apply", "Pull requests", "Remote state", "Locking"]} />,
    notes: "Answer the section question: Terraform moves from a developer's machine to managed infrastructure through a reviewed, repeatable path. Plan shows the change, a pull request gets it reviewed, a pipeline applies it, and shared state with locking stops teammates from colliding.\nHand off to Person 4: how does Terraform work underneath, and how should projects be designed?",
  },
];
