"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { highlightLine } from "./highlight";

type Props = { code: string; lang?: string; highlight?: number[]; labels?: Record<number, string>; accent: string; compact?: boolean };

export function CodeBlock({ code, lang = "hcl", highlight = [], labels = {}, accent, compact }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="w-full overflow-hidden rounded-xl border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-5 py-2.5 font-mono text-xl">
        <span style={{ color: accent }}>{lang}</span>
        <button onClick={copy} className="text-mute hover:text-ink" aria-label="Copy code">{copied ? <Check size={20} /> : <Copy size={20} />}</button>
      </div>
      <pre className={`py-3 font-mono ${compact ? "text-lg leading-[1.4]" : "text-xl leading-[1.5]"}`}>
        {code.split("\n").map((l, i) => {
          const n = i + 1;
          const hl = highlight.includes(n);
          return (
            <div key={i} className="flex items-center pr-5" style={hl ? { background: accent + "22", boxShadow: `inset 4px 0 0 ${accent}` } : undefined}>
              <span className="w-12 shrink-0 select-none pr-3 text-right text-mute/50 text-sm">{n}</span>
              <code className="flex-1 whitespace-pre">{highlightLine(l)}</code>
              {labels[n] && <span className="ml-4 rounded-md px-2.5 py-0.5 font-sans text-sm" style={{ background: accent + "33" }}>{labels[n]}</span>}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
