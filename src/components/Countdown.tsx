"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/content";

// A once-a-second clock. The server snapshot is null so server and browser render the same "--" first.
function subscribe(cb: () => void) {
  const t = setInterval(cb, 1000);
  return () => clearInterval(t);
}
const getNow = () => Math.floor(Date.now() / 1000) * 1000;
const getServerNow = () => null;

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return [
    { v: Math.floor(s / 86400), l: "days" },
    { v: Math.floor((s % 86400) / 3600), l: "hours" },
    { v: Math.floor((s % 3600) / 60), l: "minutes" },
    { v: s % 60, l: "seconds" },
  ];
}

export function Countdown() {
  const now = useSyncExternalStore(subscribe, getNow, getServerNow);

  const target = new Date(site.weddingDate).getTime();
  const items = now === null ? parts(0).map((p) => ({ ...p, v: null })) : parts(target - now);

  return (
    <div className="flex gap-2 sm:gap-3" role="timer" aria-label="Time until the wedding">
      {items.map((p) => (
        <div
          key={p.l}
          className="w-[4.5rem] rounded-2xl bg-cream/60 px-1 py-3 text-center shadow-sm ring-1 ring-white/60 backdrop-blur-md sm:w-20"
        >
          <div className="font-serif text-2xl font-medium tabular-nums lining-nums text-dusk-900 sm:text-3xl">
            {p.v === null ? "--" : String(p.v).padStart(2, "0")}
          </div>
          <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-dusk-700 sm:text-[10px] sm:tracking-[0.2em]">
            {p.l}
          </div>
        </div>
      ))}
    </div>
  );
}
