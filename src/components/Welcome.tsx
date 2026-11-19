"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import beach from "@/assets/welcome-beach.webp";
import jedah from "@/assets/welcome-jedah.webp";
import pj from "@/assets/welcome-pj.webp";

const start = 20;
const shore = 78;
const welcomeKey = "wedding-welcome-completed";

let completedThisVisit = false;

export function Welcome() {
  const dialog = useRef<HTMLDialogElement>(null);
  const course = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef<{ id: number; startX: number; startPosition: number } | null>(null);
  const [position, setPosition] = useState(start);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    let completed = completedThisVisit;
    try {
      completed ||= sessionStorage.getItem(welcomeKey) === "yes";
    } catch {
      // Keep the welcome usable when browser storage is unavailable.
    }
    const screen = dialog.current;
    if (!completed && screen && !screen.open) {
      screen.showModal();
      screen.querySelector("h1")?.focus({ preventScroll: true });
    }
    return () => {
      if (timer.current) clearTimeout(timer.current);
      screen?.close();
    };
  }, []);

  function reachShore(next: number) {
    if (timer.current) return;
    setPosition(Math.min(shore, Math.max(start, next)));
    if (next < shore) return;
    setArrived(true);
    completedThisVisit = true;
    try {
      sessionStorage.setItem(welcomeKey, "yes");
    } catch {
      // In-memory state still remembers completion during navigation.
    }
    timer.current = setTimeout(() => {
      dialog.current?.close();
      if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
      document.getElementById("top")?.focus({ preventScroll: true });
    }, 650);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (arrived || !event.isPrimary || event.button !== 0) return;
    drag.current = { id: event.pointerId, startX: event.clientX, startPosition: position };
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const active = drag.current;
    const width = course.current?.clientWidth;
    if (!active || active.id !== event.pointerId || !width) return;
    reachShore(active.startPosition + ((event.clientX - active.startX) / width) * 100);
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (drag.current?.id === event.pointerId) drag.current = null;
  }

  return (
    <dialog
      ref={dialog}
      aria-labelledby="welcome-title"
      onCancel={(event) => event.preventDefault()}
      className="w-full max-w-none bg-transparent p-0 text-dusk-950 backdrop:bg-cream open:fixed open:inset-0 open:m-0 open:grid open:h-dvh open:max-h-none open:place-items-center"
    >
      <div ref={course} className="relative isolate h-full w-full overflow-hidden bg-dusk-100">
        <Image src={beach} alt="" fill loading="eager" sizes="100vw" className="pointer-events-none select-none object-cover object-center" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-cream/75 via-transparent to-transparent" />

        <div className="absolute inset-x-5 top-[8%] text-center sm:top-[9%]">
          <h1 id="welcome-title" tabIndex={-1} className="sr-only">PJ and JM’s wedding welcome</h1>
          <p className="font-serif text-3xl font-semibold leading-tight text-dusk-950 sm:text-5xl" aria-live="polite">
            {arrived ? "You made it! Welcome to our wedding." : "Drag Jedah on her surfboard to PJ."}
          </p>
          <p id="surf-keys" className="sr-only">Use the left and right arrow keys to guide Jedah toward PJ.</p>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 text-white">
          {[{ left: "16%", top: "26%" }, { left: "46%", top: "36%" }, { left: "75%", top: "24%" }].map(({ left, top }, index) => (
            <span
              key={left}
              className="welcome-bird absolute block h-4 w-7 drop-shadow-[0_1px_1px_rgba(38,56,74,0.55)]"
              style={{ left, top, animationDelay: `${index * -0.9}s` }}
            >
              <span className="absolute left-0 top-1 h-2 w-4 rotate-[22deg] rounded-t-full border-t-2 border-current" />
              <span className="absolute right-0 top-1 h-2 w-4 -rotate-[22deg] rounded-t-full border-t-2 border-current" />
            </span>
          ))}
        </div>

        <svg
          aria-hidden="true"
          viewBox="0 0 242 75"
          className="welcome-sand-note pointer-events-none absolute bottom-[4%] right-[9%] w-40 sm:bottom-[3%] sm:right-[12%] sm:w-60"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <defs>
            <path
              id="welcome-sand-initials"
              d="M17 60 Q19 49 20 38 L23 15 M22 18 C31 10 51 11 50 24 Q48 36 21 36
                 M59 14 Q70 12 86 15 M78 14 L75 43 Q74 54 67 58 Q58 64 51 55 L49 49
                 M117 55 C108 47 96 39 96 29 C96 19 108 17 117 28 C123 17 138 16 139 28 C141 38 129 48 117 55 Z
                 M149 16 Q160 13 178 15 M168 15 L166 42 Q165 56 157 59 Q146 64 142 53
                 M183 61 L191 16 Q193 15 195 22 L205 45 L225 15 L226 36 L231 58"
            />
          </defs>
          <use href="#welcome-sand-initials" stroke="#b58a60" strokeWidth="8" opacity=".23" />
          <use href="#welcome-sand-initials" transform="translate(.5 2)" stroke="#fff0ca" strokeWidth="4.5" opacity=".85" />
          <use href="#welcome-sand-initials" stroke="#92704e" strokeWidth="3.5" opacity=".84" />
        </svg>

        <div className="pointer-events-none absolute bottom-[13%] left-[85%] w-[18vw] max-w-36 -translate-x-1/2 select-none sm:bottom-[12%]">
          <Image src={pj} alt="PJ waiting by the shore" className="h-auto w-full" sizes="(min-width: 800px) 144px, 18vw" draggable={false} />
        </div>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Jedah on her surfboard"
          aria-describedby="surf-keys"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(((position - start) / (shore - start)) * 100)}
          aria-valuetext={arrived ? "Reached PJ" : `${Math.round(((position - start) / (shore - start)) * 100)} percent to PJ`}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onLostPointerCapture={endDrag}
          onKeyDown={(event) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
            event.preventDefault();
            reachShore(position + (event.key === "ArrowRight" ? 8 : -8));
          }}
          style={{ left: `${position}%` }}
          className="absolute bottom-[16%] w-[27vw] min-w-24 max-w-56 -translate-x-1/2 touch-none select-none rounded-xl outline-offset-8 focus-visible:outline-2 focus-visible:outline-dusk-950 sm:bottom-[14%] [cursor:grab] active:cursor-grabbing"
        >
          <Image src={jedah} alt="" draggable={false} className="pointer-events-none h-auto w-full" sizes="(min-width: 830px) 224px, 27vw" />
        </div>
      </div>
    </dialog>
  );
}
