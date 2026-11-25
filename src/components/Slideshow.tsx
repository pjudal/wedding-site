"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { photos as copy, site } from "@/content";
import { photoSrc, useUrlKey } from "@/lib/urlKey";
import { QrCode } from "./QrCode";

type P = { id: string; name: string };

const POLL_MS = 10_000; // how often to look for new photos
const SLIDE_MS = 7_000; // how long each photo stays up
const RUSH_MS = 4_000; // shorter, while a batch of new photos is waiting
const FADE_S = 1.2;

function shuffle<T>(a: T[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function preload(src: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => img.decode().then(resolve, resolve);
    img.onerror = () => reject(new Error("load failed"));
    img.src = src;
  });
}

/*
 * Projector slideshow. Open /live?k=<guest key> on the laptop, click once for full screen, and leave it.
 * - Polls for new photos every 10 seconds; new ones jump the queue and show next.
 * - Otherwise cycles through every photo in a shuffled order, reshuffling each round.
 * - Keeps running through network drops (it just keeps showing what it already has).
 */
export function Slideshow() {
  const k = useUrlKey();
  const [current, setCurrent] = useState<P | null>(null);
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [offline, setOffline] = useState(false);
  const [badKey, setBadKey] = useState(false);
  const [idle, setIdle] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const all = useRef(new Map<string, P>());
  const fresh = useRef<string[]>([]);
  const deck = useRef<string[]>([]);
  const first = useRef(true);
  const currentId = useRef<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (k) setShareUrl(`${window.location.origin}/share?k=${encodeURIComponent(k)}`);
  }, [k]);

  // ---- polling ----
  const poll = useCallback(async () => {
    if (!k) return;
    try {
      const res = await fetch(`/api/photos/list?k=${encodeURIComponent(k)}`, { cache: "no-store" });
      if (res.status === 403) {
        setBadKey(true);
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as { photos: P[] };
      const next = new Map(data.photos.map((p) => [p.id, p]));
      if (!first.current) {
        for (const p of data.photos) if (!all.current.has(p.id)) fresh.current.push(p.id);
      }
      first.current = false;
      all.current = next;
      // Drop anything that was hidden or removed.
      fresh.current = fresh.current.filter((id) => next.has(id));
      deck.current = deck.current.filter((id) => next.has(id));
      setCount(next.size);
      setOffline(false);
      setLoaded(true);
    } catch {
      setOffline(true);
    }
  }, [k]);

  useEffect(() => {
    if (!k) return;
    const first = setTimeout(poll, 0);
    const t = setInterval(poll, POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [k, poll]);

  // ---- slide loop ----
  useEffect(() => {
    if (!k || !loaded) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    const pick = (): string | undefined => {
      while (fresh.current.length) {
        const id = fresh.current.shift()!;
        if (all.current.has(id)) return id;
      }
      if (!deck.current.length) {
        deck.current = shuffle([...all.current.keys()].filter((id) => id !== currentId.current || all.current.size === 1));
      }
      return deck.current.pop();
    };

    const step = async () => {
      if (stopped) return;
      // A few tries so one broken image doesn't stall the show.
      for (let tries = 0; tries < 5; tries++) {
        const id = pick();
        if (!id) break;
        if (id === currentId.current && all.current.size > 1) continue;
        try {
          await preload(photoSrc(id, k));
          if (stopped) return;
          if (!all.current.has(id)) continue; // hidden while loading
          currentId.current = id;
          setCurrent(all.current.get(id)!);
          break;
        } catch {}
      }
      if (currentId.current && !all.current.has(currentId.current)) {
        currentId.current = null;
        setCurrent(null);
      }
      const delay = !all.current.size ? 2_000 : fresh.current.length > 3 ? RUSH_MS : SLIDE_MS;
      timer = setTimeout(step, delay);
    };
    step();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [k, loaded]);

  // ---- keep the screen awake ----
  useEffect(() => {
    let lock: WakeLockSentinel | null = null;
    const acquire = async () => {
      try {
        if (document.visibilityState === "visible" && "wakeLock" in navigator) lock = await navigator.wakeLock.request("screen");
      } catch {}
    };
    acquire();
    document.addEventListener("visibilitychange", acquire);
    return () => {
      document.removeEventListener("visibilitychange", acquire);
      lock?.release().catch(() => {});
    };
  }, []);

  // ---- hide the cursor when idle ----
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const wake = () => {
      setIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), 3000);
    };
    wake();
    window.addEventListener("mousemove", wake);
    return () => {
      window.removeEventListener("mousemove", wake);
      clearTimeout(t);
    };
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (badKey) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-dusk-950 p-8 text-center text-dusk-100">
        <p>This slideshow link isn&apos;t valid. Use the full link with the ?k= part.</p>
      </main>
    );
  }

  return (
    <main
      className={`fixed inset-0 overflow-hidden bg-dusk-950 text-cream select-none ${idle ? "cursor-none" : ""}`}
      onDoubleClick={toggleFullscreen}
    >
      <AnimatePresence>
        {current && (
          <motion.div
            key={current.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_S, ease: "easeInOut" }}
          >
            {/* Blurred copy fills the screen behind portrait photos */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoSrc(current.id, k)} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoSrc(current.id, k)} alt="" className="absolute inset-0 h-full w-full object-contain" />
            {current.name && (
              <p className="absolute bottom-[4vh] left-[3vw] rounded-full bg-dusk-950/55 px-[1.4vw] py-[0.6vw] text-[1.6vw] backdrop-blur-sm">
                Shared by <span className="font-semibold text-butter-200">{current.name}</span>
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!current && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3vh] text-center">
          <p className="font-serif text-[6vw] leading-none">
            {site.coupleA} <span className="italic text-butter-400">&amp;</span> {site.coupleB}
          </p>
          <div className="rounded-[2vw] bg-cream p-[1.5vw]">
            <QrCode value={shareUrl} className="h-[28vh] w-[28vh]" />
          </div>
          <p className="text-[2vw] text-dusk-100">{loaded ? copy.liveEmpty : "Loading..."}</p>
          <p className="text-[1.4vw] text-dusk-300">{copy.liveCallout}</p>
        </div>
      )}

      {current && (
        <div className="absolute bottom-[4vh] right-[3vw] flex items-center gap-[1vw] rounded-[1.2vw] bg-cream/95 p-[0.8vw] pr-[1.4vw] text-dusk-950 shadow-2xl">
          <QrCode value={shareUrl} className="h-[11vh] w-[11vh]" />
          <div className="max-w-[14vw]">
            <p className="font-serif text-[1.7vw] leading-tight">{copy.liveCallout}</p>
            <p className="mt-[0.3vw] text-[0.9vw] text-dusk-700">
              {count} photo{count === 1 ? "" : "s"} so far
            </p>
          </div>
        </div>
      )}

      {offline && (
        <span
          className="absolute right-[1vw] top-[1vw] h-3 w-3 rounded-full bg-butter-400/80"
          title="Can't reach the internet right now. Still showing the photos it already has."
        />
      )}

      {!idle && (
        <p className="absolute left-1/2 top-[2vh] -translate-x-1/2 rounded-full bg-dusk-950/60 px-4 py-1.5 text-sm text-dusk-100">
          Double-click or press F for full screen
        </p>
      )}
    </main>
  );
}
