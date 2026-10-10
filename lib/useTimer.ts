"use client";
import { useEffect, useState } from "react";

export function formatTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  const mm = String(m).padStart(h ? 2 : 1, "0"), ss = String(sec).padStart(2, "0");
  return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function useTimer() {
  const [ms, setMs] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t0 = Date.now() - ms;
    const id = setInterval(() => setMs(Date.now() - t0), 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);
  return { ms, running, start: () => setRunning(true), toggle: () => setRunning((r) => !r), reset: () => { setRunning(false); setMs(0); } };
}
