"use client";
import { useEffect, useMemo } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import type { Section, SlideData } from "@/lib/types";
import { useDeck } from "@/lib/useDeck";
import { useDeckKeys } from "@/lib/useDeckKeys";
import { useIdle } from "@/lib/useIdle";
import { exitFullscreen, openPresenter, toggleFullscreen } from "@/lib/fullscreen";
import { Stage } from "./Stage";
import { Slide } from "./Slide";
import { SlideHeader } from "./SlideHeader";
import { ProgressBar } from "./ProgressBar";
import { NavigationControls } from "./NavigationControls";

const variants = {
  enter: (d: number) => ({ opacity: 0, x: 48 * d }),
  center: { opacity: 1, x: 0 },
  exit: (d: number) => ({ opacity: 0, x: -48 * d }),
};

/** Audience view: slide, section indicator, progress, and controls that fade when idle. Notes never appear here. */
export function Deck({ slides, sections }: { slides: SlideData[]; sections: Section[] }) {
  const ids = useMemo(() => slides.map((s) => s.id), [slides]);
  const deck = useDeck(ids);
  const idle = useIdle();

  useEffect(() => {
    document.documentElement.style.cursor = idle ? "none" : "";
  }, [idle]);

  useDeckKeys({
    ArrowRight: deck.next, ArrowDown: deck.next, PageDown: deck.next, Space: deck.next,
    ArrowLeft: deck.prev, ArrowUp: deck.prev, PageUp: deck.prev,
    Home: deck.first, End: deck.last,
    f: toggleFullscreen, p: openPresenter, Escape: exitFullscreen,
  });

  const slide = slides[deck.index];
  const section = sections.find((s) => s.id === slide.section) ?? sections[0];

  return (
    <MotionConfig reducedMotion="user">
      <Stage>
        <AnimatePresence mode="wait" custom={deck.dir} initial={false}>
          <motion.div
            key={slide.id} custom={deck.dir} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Slide slide={slide} section={section} />
          </motion.div>
        </AnimatePresence>
        <SlideHeader sections={sections} current={section.id} index={deck.index} total={deck.total} />
        <ProgressBar index={deck.index} total={deck.total} accent={section.accent} />
        <NavigationControls
          visible={!idle} onPrev={deck.prev} onNext={deck.next} onFullscreen={toggleFullscreen} onPresenter={openPresenter}
          atStart={deck.index === 0} atEnd={deck.index === deck.total - 1}
        />
      </Stage>
    </MotionConfig>
  );
}
