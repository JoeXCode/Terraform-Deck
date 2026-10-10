"use client";
import { useEffect, useState } from "react";

/** True after `ms` without mouse or touch activity. Keyboard use does not wake it. */
export function useIdle(ms = 2500) {
  const [idle, setIdle] = useState(false);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const wake = () => { setIdle(false); clearTimeout(t); t = setTimeout(() => setIdle(true), ms); };
    const events = ["mousemove", "mousedown", "touchstart"];
    wake();
    events.forEach((e) => window.addEventListener(e, wake));
    return () => { clearTimeout(t); events.forEach((e) => window.removeEventListener(e, wake)); };
  }, [ms]);
  return idle;
}
