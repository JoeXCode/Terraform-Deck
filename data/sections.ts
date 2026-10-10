import type { Section } from "@/lib/types";

export const story = ["WHY", "WHAT", "HOW", "DEEPER", "EVALUATE"];

export const sections: Section[] = [
  { id: "intro", label: "Intro", num: "", tag: "", presenter: "Team", accent: "#7B42BC" },
  { id: "fundamentals", label: "Fundamentals", num: "01", tag: "WHY", presenter: "Person 1", question: "What is Terraform and why does it exist?", accent: "#7B42BC" },
  { id: "core", label: "Core Concepts", num: "02", tag: "WHAT", presenter: "Person 2", question: "What are the building blocks of Terraform?", accent: "#2DD4BF" },
  { id: "workflow", label: "Workflow", num: "03", tag: "HOW", presenter: "Person 3", question: "How is Terraform used in real projects and teams?", accent: "#FF9900" },
  { id: "advanced", label: "Advanced", num: "04", tag: "DEEPER", presenter: "Person 4", question: "How does Terraform work at a deeper level, and how should projects be designed?", accent: "#60A5FA" },
  { id: "wrap", label: "Wrap-up", num: "", tag: "", presenter: "Team", accent: "#7B42BC" },
  { id: "demo", label: "Components", num: "", tag: "", presenter: "Demo", accent: "#7B42BC" },
];
