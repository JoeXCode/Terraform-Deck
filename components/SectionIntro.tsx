"use client";
import { Fragment } from "react";
import { motion } from "framer-motion";
import type { Section, SlideData } from "@/lib/types";
import { story } from "@/data/sections";

const rise = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

/** Section transition: story strip (WHY to EVALUATE), accent bar, title, question, presenter. */
export function SectionIntro({ slide, section }: { slide: SlideData; section: Section }) {
  const tag = slide.tag ?? section.tag;
  const question = slide.subtitle ?? section.question;
  return (
    <div className="flex h-full flex-col justify-center px-40">
      <div className="mb-14 flex items-center gap-6 font-mono text-3xl">
        {story.map((t, i) => (
          <Fragment key={t}>
            {i > 0 && <span className="h-px w-12 bg-line" />}
            <span className={t === tag ? "font-semibold" : "text-mute/60"} style={t === tag ? { color: section.accent } : undefined}>{t}</span>
          </Fragment>
        ))}
      </div>
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.4 }} style={{ background: section.accent, originX: 0 }} className="mb-10 h-2 w-48 rounded-full" />
      <motion.h1 {...rise} transition={{ delay: 0.1, duration: 0.25 }} className="text-9xl font-bold tracking-tight">{slide.title}</motion.h1>
      {question && <motion.p {...rise} transition={{ delay: 0.25, duration: 0.25 }} className="mt-10 max-w-[1300px] text-5xl leading-snug text-mute">{question}</motion.p>}
      <motion.p {...rise} transition={{ delay: 0.4, duration: 0.25 }} className="mt-12 flex gap-8 font-mono text-3xl" style={{ color: section.accent }}>
        <span>{section.num} {section.label}</span><span className="text-mute">{section.presenter}</span>
      </motion.p>
    </div>
  );
}
