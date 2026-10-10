"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Slide position, direction, URL-hash sync, and cross-window sync (audience <-> presenter view). */
export function useDeck(ids: string[]) {
  const total = ids.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [ready, setReady] = useState(false);
  const idx = useRef(0);
  const ch = useRef<BroadcastChannel | null>(null);
  idx.current = index;

  useEffect(() => {
    const read = () => {
      const i = ids.indexOf(window.location.hash.slice(1));
      if (i >= 0) setIndex(i);
    };
    read();
    setReady(true);
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [ids]);

  useEffect(() => {
    if (ready) window.history.replaceState(null, "", "#" + ids[index]);
  }, [index, ready, ids]);

  useEffect(() => {
    const c = new BroadcastChannel("terraform-deck");
    ch.current = c;
    c.onmessage = (e) => {
      if (e.data === "req") c.postMessage(idx.current);
      else if (typeof e.data === "number") { setDir(e.data >= idx.current ? 1 : -1); setIndex(e.data); }
    };
    c.postMessage("req");
    return () => c.close();
  }, []);

  const go = useCallback(
    (n: number) => {
      const t = Math.max(0, Math.min(total - 1, n));
      setDir(t >= index ? 1 : -1);
      setIndex(t);
      ch.current?.postMessage(t);
    },
    [index, total]
  );

  return { index, dir, total, next: () => go(index + 1), prev: () => go(index - 1), first: () => go(0), last: () => go(total - 1), go };
}
