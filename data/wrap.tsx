import type { SlideData } from "@/lib/types";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { FAQ } from "@/components/FAQ";

const P = "#7B42BC", T = "#2DD4BF", O = "#FF9900", B = "#60A5FA";

const lessons = [
  ["WHY", P, "Infrastructure belongs in code, where it can be reviewed."],
  ["WHAT", T, "Configuration declares what you want; state records what exists."],
  ["HOW", O, "Plan, review, then apply, with remote state and locking."],
  ["DEEPER", B, "Core builds the graph; providers talk to the cloud APIs."],
  ["EVALUATE", B, "Terraform is one good tool; choose by the job."],
];

export const wrapSlides: SlideData[] = [
  {
    id: "wrap-synthesis", section: "wrap", type: "visual", title: "Putting it together",
    body: (
      <div className="w-full space-y-6">
        <div>
          <p className="mb-4 font-mono text-xl" style={{ color: T }}>Understand the change</p>
          <ArchitectureDiagram direction="row" compact accent={T} nodes={[
            { id: "c", label: "Configuration", sub: ".tf files" }, { id: "k", label: "Terraform Core", sub: "reads config and state" },
            { id: "g", label: "Dependency graph", sub: "orders operations" }, { id: "p", label: "Plan", sub: "preview" }]} />
        </div>
        <div>
          <p className="mb-4 font-mono text-xl" style={{ color: O }}>Make the change</p>
          <ArchitectureDiagram direction="row" compact accent={O} startDelay={1} nodes={[
            { id: "a", label: "Apply", sub: "after review" }, { id: "pr", label: "Provider", sub: "calls cloud APIs" },
            { id: "s", label: "State", sub: "records the result" }, { id: "i", label: "Infrastructure", sub: "real resources" }]} />
        </div>
      </div>
    ),
    notes: "One last look at the whole picture, tying all four parts together.\nYour configuration (Person 2) is read by Terraform Core (Person 4), which builds a dependency graph and a plan. The team reviews the plan through Git and a pipeline (Person 3). On apply, providers call the cloud APIs, state records the result, and the infrastructure now matches what you described (Person 1).\nNote the order: the provider acts at apply time, after the plan is reviewed.",
  },
  {
    id: "wrap-faq-1", section: "wrap", type: "visual", title: "Common questions: concepts",
    body: <FAQ accent={P} items={[
      { q: "Is Terraform only for AWS?", a: "No. Providers let Terraform manage many platforms, including other clouds and some SaaS services." },
      { q: "What is the difference between plan and apply?", a: "plan previews the changes. apply carries them out and updates state." },
      { q: "What happens if the state file is lost?", a: "Terraform loses track of what it manages. Remote state and backups reduce that risk." },
      { q: "Terraform or CloudFormation?", a: "It depends on the job: Terraform spans platforms; CloudFormation is AWS-native." }]} />,
    notes: "Short, direct answers; tap a question to expand it.\nFor the state question: without state, Terraform cannot match configuration to real objects, and may try to create duplicates. Existing resources can be re-imported.\nFor the last one, point back to the comparison slide: no tool is universally better.",
  },
  {
    id: "wrap-faq-2", section: "wrap", type: "visual", title: "Common questions: in practice",
    body: <FAQ accent={O} items={[
      { q: "Can Terraform manage infrastructure that already exists?", a: "Yes. Import brings existing resources under management, but the configuration must be written to match." },
      { q: "What if someone changes infrastructure by hand?", a: "That is drift. plan shows it, and apply will restore the configuration unless you update the code." },
      { q: "Are secrets safe in Terraform?", a: "Values can end up in state, so encrypt state, restrict access, and keep secrets out of Git." },
      { q: "Does destroy delete everything?", a: "Only what this configuration and state manage. Read the plan before confirming." }]} />,
    notes: "Same format. Reinforce the safety message: read the plan, protect state, avoid manual changes.\nFor import: it brings a resource into state, and you still write the matching configuration.\nFor destroy: it removes the resources Terraform manages for this configuration, not everything in the account.",
  },
  {
    id: "wrap-lessons", section: "wrap", type: "visual", title: "Five lessons",
    body: (
      <div className="w-full space-y-3.5">
        {lessons.map(([tag, color, text]) => (
          <div key={tag} className="flex items-center gap-6 rounded-xl border border-line bg-panel px-6 py-4" style={{ boxShadow: `inset 6px 0 0 ${color}` }}>
            <span className="w-36 shrink-0 font-mono text-xl" style={{ color }}>{tag}</span>
            <span className="text-2xl font-medium leading-snug">{text}</span>
          </div>
        ))}
      </div>
    ),
    notes: "One lesson per part of the story, in the order we told it.\nWHY: infrastructure in code can be reviewed and repeated. WHAT: configuration is the desired state, state is the record. HOW: plan, review, apply, protected by remote state and locking. DEEPER: Core plans, providers act. EVALUATE: pick the tool that fits the job.\nPause, then move to questions.",
  },
  { id: "wrap-closing", section: "wrap", type: "closing", title: "Questions?", subtitle: "Terraform & Infrastructure as Code", notes: "Thank the audience and invite questions. Use the FAQ slides if useful." },
];
