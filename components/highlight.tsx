import type { ReactNode } from "react";

const RE = /(#.*|\/\/.*)|("(?:[^"\\]|\\.)*")|\b(resource|data|variable|output|provider|module|locals|terraform|dynamic|for_each|count|depends_on)\b|\b(true|false|null|\d+)\b|([A-Za-z_][\w-]*)(?=\s*=)/g;
const CLS = ["", "text-mute italic", "text-emerald-300", "text-[#C4A1FF]", "text-aws", "text-sky-300"];

/** Tiny HCL tokenizer: comment, string, keyword, number, attribute. */
export function highlightLine(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of line.matchAll(RE)) {
    const i = m.index!;
    if (i > last) out.push(line.slice(last, i));
    out.push(<span key={i} className={CLS[m.findIndex((x, k) => k > 0 && x !== undefined)]}>{m[0]}</span>);
    last = i + m[0].length;
  }
  out.push(line.slice(last));
  if (!line) out.push(" ");
  return out;
}
