"use client";
import { useEffect, useState } from "react";

/** Fixed 1920x1080 canvas scaled to fit the window (letterboxed), so 1366x768 matches 1080p. */
export function Stage({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState<number | null>(null);
  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <div className="fixed inset-0 overflow-hidden bg-bg">
      <div
        className="grid-bg absolute left-1/2 top-1/2 overflow-hidden bg-bg"
        style={{ width: 1920, height: 1080, transform: `translate(-50%, -50%) scale(${scale ?? 1})`, visibility: scale === null ? "hidden" : "visible" }}
      >
        {children}
      </div>
    </div>
  );
}
