"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";
import { slides } from "@/data/slides";
import { sections } from "@/data/sections";
import { useDeck } from "@/lib/useDeck";
import { useDeckKeys } from "@/lib/useDeckKeys";
import { exitFullscreen, toggleFullscreen } from "@/lib/fullscreen";
import { formatTime, useTimer } from "@/lib/useTimer";
import { SlidePreview } from "./SlidePreview";
import { SpeakerNotes } from "./SpeakerNotes";

const sizes = ["text-lg", "text-xl", "text-2xl", "text-3xl"];
const btn = "flex items-center gap-2 rounded-lg border border-line bg-panel px-4 py-2 text-lg text-ink transition hover:border-mute disabled:opacity-30";

/** Second window: current slide, next slide, notes, section, slide number, timer. Drives the audience window. */
export function PresenterView() {
  const ids = useMemo(() => slides.map((s) => s.id), []);
  const d = useDeck(ids);
  const timer = useTimer();
  const [size, setSize] = useState(2);
  const started = useRef(false);

  useDeckKeys({
    ArrowRight: d.next, ArrowDown: d.next, PageDown: d.next, Space: d.next,
    ArrowLeft: d.prev, ArrowUp: d.prev, PageUp: d.prev,
    Home: d.first, End: d.last, f: toggleFullscreen, Escape: exitFullscreen,
  });

  useEffect(() => {
    if (d.index > 0 && !started.current) { started.current = true; timer.start(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d.index]);

  const slide = slides[d.index];
  const next = slides[d.index + 1];
  const section = sections.find((s) => s.id === slide.section) ?? sections[0];

  return (
    <div className="flex h-screen flex-col bg-bg text-ink">
      <header className="flex items-center justify-between border-b border-line px-8 py-4">
        <div className="flex items-center gap-4 font-mono text-lg">
          <span className="h-3 w-3 rounded-full" style={{ background: section.accent }} />
          <span style={{ color: section.accent }}>{section.num} {section.label}</span>
          {section.tag && <span className="text-mute">{slide.tag ?? section.tag}</span>}
        </div>
        <span className="font-mono text-lg text-mute">Slide {d.index + 1} of {d.total}</span>
        <div className="flex items-center gap-3">
          <span className="font-mono text-3xl tabular-nums">{formatTime(timer.ms)}</span>
          <button className={btn} onClick={timer.toggle} aria-label={timer.running ? "Pause timer" : "Start timer"}>{timer.running ? <Pause size={20} /> : <Play size={20} />}</button>
          <button className={btn} onClick={timer.reset} aria-label="Reset timer"><RotateCcw size={20} /></button>
        </div>
      </header>
      <div className="h-1 bg-line"><div className="h-full transition-all duration-200" style={{ width: `${(d.index / (d.total - 1)) * 100}%`, background: section.accent }} /></div>

      <main className="grid min-h-0 flex-1 grid-cols-[1.3fr_1fr] gap-6 p-6">
        <div className="flex min-h-0 flex-col gap-4">
          <p className="font-mono text-sm text-mute">Now showing</p>
          <SlidePreview slide={slide} accent={section.accent} />
          <h1 className="text-3xl font-semibold">{slide.title}</h1>
          <div className="flex gap-3">
            <button className={btn} onClick={d.prev} disabled={d.index === 0}><ChevronLeft size={20} />Previous</button>
            <button className={btn} onClick={d.next} disabled={d.index === d.total - 1}>Next<ChevronRight size={20} /></button>
          </div>
        </div>
        <div className="flex min-h-0 flex-col gap-4">
          <p className="font-mono text-sm text-mute">Next</p>
          <div className="max-w-[440px]"><SlidePreview slide={next} /></div>
          <div className="flex items-center justify-between">
            <p className="font-mono text-sm text-mute">Notes size</p>
            <div className="flex gap-2">
              <button className={btn} onClick={() => setSize((s) => Math.max(0, s - 1))} aria-label="Smaller notes"><Minus size={18} /></button>
              <button className={btn} onClick={() => setSize((s) => Math.min(sizes.length - 1, s + 1))} aria-label="Larger notes"><Plus size={18} /></button>
            </div>
          </div>
          <SpeakerNotes text={slide.notes} size={sizes[size]} className="min-h-0 flex-1 overflow-y-auto" />
        </div>
      </main>
    </div>
  );
}
