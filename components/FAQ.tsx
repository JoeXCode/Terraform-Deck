"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function FAQ({ items, accent }: { items: { q: string; a: string }[]; accent: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="w-full space-y-4">
      {items.map((it, i) => (
        <div key={it.q} className="rounded-xl border border-line bg-panel">
          <button onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-center justify-between p-6 text-left text-4xl font-semibold">
            {it.q}
            <ChevronDown size={36} color={accent} className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }} className="overflow-hidden">
                <p className="px-6 pb-6 text-3xl text-mute">{it.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
