"use client";
import { motion } from "framer-motion";

type Props = { vertical?: boolean; label?: string; accent: string; delay?: number; dashed?: boolean; dim?: boolean; compact?: boolean };

/** Arrow that draws in once, then a dot travels along it twice. Horizontal connectors stretch so labels have room. */
export function Connector({ vertical, label, accent, delay = 0, dashed, dim, compact = false }: Props) {
  const dot = { duration: 1.2, repeat: 1, ease: "linear" as const, delay: delay + 0.35 };
  const tag = label && (
    <span className={`absolute whitespace-nowrap font-mono text-mute ${compact ? "text-xs" : "text-xl"} ${vertical ? "left-7 top-3" : "bottom-full left-1/2 mb-1 -translate-x-1/2"}`}>{label}</span>
  );
  if (vertical) {
    const h = compact ? 48 : 64;
    return (
      <div className={`relative shrink-0 ${dim ? "opacity-30" : ""}`}>
        <svg width="20" height={h} fill="none" stroke={accent} strokeWidth={compact ? "2" : "3"} strokeDasharray={dashed ? "6 5" : undefined}>
          <motion.path d={`M10 0 V${h - 8} M3 ${h - 15} L10 ${h - 6} L17 ${h - 15}`} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay, duration: 0.25 }} />
          <motion.circle r="3" fill={accent} stroke="none" cx="10" cy="0" animate={{ cy: [0, h - 8] }} transition={dot} />
        </svg>
        {tag}
      </div>
    );
  }
  const line = dashed ? `repeating-linear-gradient(90deg, ${accent} 0 6px, transparent 6px 12px)` : accent;
  return (
    <div className={`relative h-5 flex-1 ${compact ? "min-w-[20px] max-w-[56px]" : "min-w-[48px]"} ${dim ? "opacity-30" : ""}`}>
      <motion.div className="absolute left-0 right-2 top-[7px] h-[3px]" style={{ background: line, originX: 0 }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay, duration: 0.25 }} />
      <motion.svg className="absolute right-0 top-0" width="12" height="18" fill="none" stroke={accent} strokeWidth="2.5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: delay + 0.2, duration: 0.1 }}>
        <path d="M1 2 L10 9 L1 16" />
      </motion.svg>
      <motion.span className="absolute top-[5px] h-2 w-2 rounded-full" style={{ background: accent }} animate={{ left: ["0%", "88%"] }} transition={dot} />
      {tag}
    </div>
  );
}
