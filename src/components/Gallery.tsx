"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { photos as copy, site } from "@/content";
import { keyQuery, photoSrc, useUrlKey } from "@/lib/urlKey";

type P = { id: string; name: string; ts: number };

const POLL_MS = 30_000;
const timeFmt = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });

/**
 * Guest gallery: every photo that isn't hidden, newest first. Tap one to see it big and download it.
 * Linked from the upload page (/share). Uses small previews in the grid so it stays quick on mobile data.
 */
export function Gallery() {
  const k = useUrlKey();
  const [list, setList] = useState<P[] | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (k === null) return;
    const res = await fetch(`/api/photos/list${keyQuery(k)}`, { cache: "no-store" }).catch(() => null);
    if (!res) return setError("Can't reach the site right now. Retrying...");
    if (res.status === 403) return setError("This link isn't valid. Scan the QR code again.");
    if (!res.ok) return setError("Couldn't load the photos. Retrying...");
    const data = (await res.json()) as { photos: P[] };
    setError("");
    setList(data.photos.slice().reverse());
  }, [k]);

  useEffect(() => {
    if (k === null) return;
    const first = setTimeout(load, 0);
    const t = setInterval(load, POLL_MS);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [k, load]);

  // Tracked by id, so new photos arriving at the top don't swap the one being viewed.
  // If it's hidden or deleted meanwhile, the viewer just closes.
  const openIndex = openId && list ? list.findIndex((p) => p.id === openId) : -1;
  const current = openIndex >= 0 && list ? list[openIndex] : null;

  return (
    <main className="min-h-svh bg-cream px-3 pb-16 pt-10 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-dusk-500">{site.shortDate}</p>
        <h1 className="mt-2 text-center font-serif text-5xl text-dusk-950">
          {site.coupleA} <span className="italic text-butter-500">&amp;</span> {site.coupleB}
        </h1>
        <h2 className="mt-5 text-center font-serif text-3xl text-dusk-700">{copy.galleryTitle}</h2>
        <p className="mt-1 text-center text-dusk-700">
          {list && list.length > 0 ? `${list.length} photo${list.length === 1 ? "" : "s"}. ${copy.galleryIntro}` : copy.galleryIntro}
        </p>
        <div className="mt-5 flex justify-center">
          <a
            href={`/share${keyQuery(k)}`}
            className="rounded-full bg-dusk-700 px-6 py-3 font-semibold text-cream shadow-lg shadow-dusk-700/20 transition hover:bg-dusk-900"
          >
            {copy.galleryShareLink}
          </a>
        </div>

        {error && <p className="mt-6 text-center text-red-700">{error}</p>}
        {!list && !error && <p className="mt-10 text-center text-dusk-500">Loading photos...</p>}
        {list && list.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-dusk-300 p-10 text-center text-dusk-500">{copy.galleryEmpty}</p>
        )}

        <ul className="mt-8 grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2 lg:grid-cols-5">
          {list?.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setOpenId(p.id)}
                className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-lg bg-dusk-100"
                aria-label={`Open photo${p.name ? ` from ${p.name}` : ""}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoSrc(p.id, k, { thumb: true })}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {current && list && (
        <Viewer
          photo={current}
          k={k}
          index={openIndex}
          total={list.length}
          onClose={() => setOpenId(null)}
          onMove={(d) => setOpenId(list[(openIndex + d + list.length) % list.length].id)}
        />
      )}
    </main>
  );
}

function Viewer({
  photo,
  k,
  index,
  total,
  onClose,
  onMove,
}: {
  photo: P;
  k: string | null;
  index: number;
  total: number;
  onClose: () => void;
  onMove: (d: number) => void;
}) {
  const touchX = useRef<number | null>(null);
  const [fullLoaded, setFullLoaded] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onMove(1);
      if (e.key === "ArrowLeft") onMove(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, onMove]);

  const iconBtn =
    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-2xl text-cream transition hover:bg-white/25";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-dusk-950"
      role="dialog"
      aria-modal="true"
      aria-label="Photo"
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50 && total > 1) onMove(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between gap-3 px-3 py-3 text-cream">
        <p className="min-w-0 truncate text-sm text-dusk-100">
          {photo.name ? (
            <>
              Shared by <span className="font-semibold text-butter-200">{photo.name}</span> ·{" "}
            </>
          ) : null}
          {timeFmt.format(photo.ts)} · {index + 1} of {total}
        </p>
        <button type="button" onClick={onClose} className={iconBtn} aria-label="Close">
          ×
        </button>
      </div>

      <div className="relative min-h-0 flex-1" onClick={onClose}>
        {/* Preview shows instantly; the full photo fades in over it once loaded. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc(photo.id, k, { thumb: true })}
          alt=""
          className="absolute inset-0 h-full w-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.id}
          src={photoSrc(photo.id, k)}
          alt={photo.name ? `Photo shared by ${photo.name}` : "Guest photo"}
          onLoad={() => setFullLoaded(photo.id)}
          className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
            fullLoaded === photo.id ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        />
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMove(-1);
              }}
              className={`${iconBtn} absolute left-2 top-1/2 -translate-y-1/2 max-sm:hidden`}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMove(1);
              }}
              className={`${iconBtn} absolute right-2 top-1/2 -translate-y-1/2 max-sm:hidden`}
              aria-label="Next photo"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 px-4 pb-6 pt-4">
        <a
          href={photoSrc(photo.id, k, { download: true })}
          download
          className="rounded-full bg-butter-400 px-8 py-3 font-semibold text-dusk-950 transition hover:bg-butter-500"
        >
          {copy.galleryDownload}
        </a>
        <p className="text-center text-xs text-dusk-300">
          On iPhone you can also press and hold the photo, then tap &quot;Save to Photos&quot;.
          {total > 1 ? " Swipe to see more." : ""}
        </p>
      </div>
    </div>
  );
}
