"use client";
import { Fragment } from "react";
import { motion } from "framer-motion";

/** Boxes joined by arrows that draw in left to right. */
export function FlowDiagram({ steps, accent }: { steps: string[]; accent: string }) {
  return (
    <div className="flex w-full items-center justify-between">
      {steps.map((s, i) => (
        <Fragment key={s}>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 * i, duration: 0.2 }}
            className="rounded-xl border bg-panel px-10 py-12 text-4xl font-semibold"
            style={{ borderColor: accent }}
          >
            {s}
          </motion.div>
          {i < steps.length - 1 && (
            <svg width="120" height="24" className="shrink-0" fill="none" stroke={accent} strokeWidth="3">
              <motion.path d="M0 12 H108 M96 2 L112 12 L96 22" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15 * i + 0.1, duration: 0.3 }} />
            </svg>
          )}
        </Fragment>
      ))}
    </div>
  );
}
