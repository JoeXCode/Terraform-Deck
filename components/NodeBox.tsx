"use client";
import { motion } from "framer-motion";

export function NodeBox({
  label,
  sub,
  accent,
  state = "normal",
  delay = 0,
  compact = false,
}: {
  label: string;
  sub?: string;
  accent: string;
  state?: "normal" | "active" | "dim";
  delay?: number;
  compact?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: state === "dim" ? 0.35 : 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className={`rounded-xl border bg-panel text-center transition-all ${
        compact
          ? "shrink min-w-0 px-3.5 py-2.5"
          : "shrink-0 px-6 py-4"
      }`}
      style={{
        borderColor: state === "active" ? accent : "#2A3A50",
        background: state === "active" ? accent + "1A" : undefined,
      }}
    >
      <div className={`font-semibold truncate ${compact ? "text-lg" : "text-2xl"}`}>{label}</div>
      {sub && (
        <div className={`mt-0.5 font-mono text-mute truncate ${compact ? "text-sm" : "text-lg"}`}>
          {sub}
        </div>
      )}
    </motion.div>
  );
}
