"use client";
import { useEffect, useRef, useState } from "react";
import type { SlideData } from "@/lib/types";
import { sections } from "@/data/sections";
import { Slide } from "./Slide";

/** Renders a real slide on a 1920x1080 canvas scaled to its container. Used by the presenter view. */
export function SlidePreview({ slide, accent }: { slide?: SlideData; accent?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  useEffect(() => {
    const el = ref.current!;
    const fit = () => setScale(el.clientWidth / 1920);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const section = slide ? sections.find((s) => s.id === slide.section) ?? sections[0] : undefined;
  return (
    <div ref={ref} className="relative w-full overflow-hidden rounded-xl border bg-bg" style={{ aspectRatio: "16 / 9", borderColor: accent ?? "#223042" }}>
      {slide && section ? (
        <div key={slide.id} className="grid-bg absolute left-0 top-0 origin-top-left bg-bg" style={{ width: 1920, height: 1080, transform: `scale(${scale})` }}>
          <Slide slide={slide} section={section} />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center font-mono text-mute">End of presentation</div>
      )}
    </div>
  );
}
