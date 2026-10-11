import type { SlideData } from "@/lib/types";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";

const P = "#7B42BC";
const parts = [
  { num: "01", tag: "WHY", topic: "Fundamentals", desc: "Why IaC matters, the 4 daily commands, state basics, and rookie mistakes to avoid.", accent: "#7B42BC", presenter: "Saad" },
  { num: "02", tag: "WHAT", topic: "Core Concepts", desc: "The building blocks of HCL: providers, resources, variables, implicit dependencies, and state reconciliation.", accent: "#2DD4BF", presenter: "Saad" },
  { num: "03", tag: "HOW", topic: "Workflow & Teams", desc: "Local CLI habits, S3 remote state, DynamoDB state locking, and automated CI/CD PR pipelines.", accent: "#FF9900", presenter: "Joseph" },
  { num: "04", tag: "DEEPER", topic: "Advanced & Architecture", desc: "Under the hood (Core vs gRPC), DAG dependency graphs, modules, safety patterns, and tool evaluation.", accent: "#60A5FA", presenter: "Joseph" },
];

export const openingSlides: SlideData[] = [
  {
    id: "title", section: "intro", type: "title", title: "Terraform", subtitle: "Infrastructure as Code",
    notes: "Welcome. In the next stretch we tell one story: why infrastructure needs code, what Terraform is made of, how teams use it, and how it works underneath.\n[FILL IN: add the group name and date if needed.]",
  },
  {
    id: "intro-roadmap", section: "intro", type: "visual", title: "One story, four parts",
    subtitle: "A complete journey from first principles to production architecture and team collaboration.",
    body: (
      <div className="w-full space-y-6">
        <ArchitectureDiagram direction="row" compact accent={P} nodes={[
          { id: "why", label: "Why", sub: "Fundamentals" },
          { id: "what", label: "What", sub: "Core Concepts" },
          { id: "how", label: "How", sub: "Team Workflow" },
          { id: "deep", label: "Deeper", sub: "Architecture & DAG" },
          { id: "eval", label: "Evaluate", sub: "Production Standards" }
        ]} />
        <div className="grid grid-cols-4 gap-5">
          {parts.map((p) => (
            <div key={p.num} className="flex h-full flex-col justify-between rounded-xl border border-line bg-panel p-5" style={{ boxShadow: `inset 4px 0 0 ${p.accent}` }}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-bold" style={{ color: p.accent }}>{p.num}</span>
                  <span className="rounded px-2 py-0.5 font-mono text-sm font-semibold uppercase tracking-wider" style={{ background: p.accent + "22", color: p.accent }}>{p.tag}</span>
                </div>
                <p className="mt-2.5 text-2xl font-semibold text-ink">{p.topic}</p>
                <p className="mt-2 text-base leading-snug text-mute">{p.desc}</p>
              </div>
              <div className="mt-4 border-t border-line/60 pt-2.5 font-mono text-base text-mute">
                Presenter: <span className="text-ink">{p.presenter}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    notes: "Preview the arc: WHY we need Infrastructure as Code, WHAT Terraform is made of, HOW teams use it, then DEEPER into how it works, and finally how to EVALUATE it: best practices, limits, and when to choose something else.\nIntroduce the presenters: Saad (Fundamentals & Core Concepts) and Joseph (Workflow & Advanced Architecture).",
  },
];
