"use client";
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";

type Props = { onPrev: () => void; onNext: () => void; onFullscreen: () => void; atStart: boolean; atEnd: boolean; visible: boolean };

/** Audience controls. Fade out when the mouse is idle. */
export function NavigationControls({ onPrev, onNext, onFullscreen, atStart, atEnd, visible }: Props) {
  const btn = "rounded-lg border border-line bg-panel/80 p-3 text-mute transition hover:text-ink disabled:opacity-30";
  return (
    <div className={`absolute bottom-10 right-40 flex gap-3 transition-opacity duration-300 ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <button className={btn} onClick={onFullscreen} aria-label="Fullscreen (F)"><Maximize size={26} /></button>
      <button className={btn} onClick={onPrev} disabled={atStart} aria-label="Previous slide"><ChevronLeft size={26} /></button>
      <button className={btn} onClick={onNext} disabled={atEnd} aria-label="Next slide"><ChevronRight size={26} /></button>
    </div>
  );
}
