"use client";
import { useEffect } from "react";

type Handlers = Record<string, () => void>;

/** Maps KeyboardEvent.key to a handler, blocks browser defaults, and ignores typing in form fields. */
export function useDeckKeys(map: Handlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName)) return;
      if (t.tagName === "BUTTON") t.blur();
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const fn = map[key === " " ? "Space" : key];
      if (fn) {
        e.preventDefault();
        if (!e.repeat) fn();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [map]);
}
