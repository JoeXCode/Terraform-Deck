import type { ReactNode } from "react";
export type SectionId = "demo" | "wrap" | "intro" | "fundamentals" | "core" | "workflow" | "advanced";
export type SlideType = "title" | "section" | "content" | "flow" | "code" | "visual" | "side" | "closing";

export interface Section {
  id: SectionId;
  label: string;
  presenter: string;
  question?: string;
  accent: string; // hex
  num: string; // "01" (empty = hidden from header)
  tag: string; // WHY, WHAT, HOW, DEEPER
}

export interface SlideData {
  id: string; // unique, also used in the URL hash
  section: SectionId;
  type: SlideType;
  title: string;
  subtitle?: string;
  tag?: string; // story tag override for section slides
  bullets?: string[]; // type "content"
  flow?: string[]; // type "flow": boxes joined by animated arrows
  code?: { lang?: string; text: string }; // type "code"
  body?: ReactNode; // types "visual" (below title) and "side" (right of title)
  notes?: string; // speaker notes
}
