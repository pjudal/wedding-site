"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";

const layouts = {
  single: { name: "One full-page photo", pockets: 1, grid: "grid-cols-1 grid-rows-1" },
  pair: { name: "Two stacked photos", pockets: 2, grid: "grid-cols-1 grid-rows-2" },
  trio: { name: "One wide, two small", pockets: 3, grid: "grid-cols-2 grid-rows-2 [&>*:first-child]:col-span-2" },
  four: { name: "Four pockets", pockets: 4, grid: "grid-cols-2 grid-rows-2" },
  six: { name: "Six pockets", pockets: 6, grid: "grid-cols-2 grid-rows-3" },
};

type Layout = keyof typeof layouts;
type Photo = { src: string; name: string };
type AlbumPage = { layout: Layout; photos: (Photo | null)[] };

const firstPages: AlbumPage[] = [{ layout: "pair", photos: [] }, { layout: "six", photos: [] }];

function readPhoto(file: File): Promise<Photo> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ src: String(reader.result), name: file.name });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function isAlbum(value: unknown): value is AlbumPage[] {
  return Array.isArray(value) && value.length > 0 && value.every((page) =>
    page && Object.hasOwn(layouts, page.layout) && Array.isArray(page.photos) &&
    page.photos.every((photo: Photo | null) => photo === null ||
      (photo && typeof photo.name === "string" && typeof photo.src === "string" &&
        /^data:image\/(jpeg|png|webp|gif|avif);base64,/i.test(photo.src))),
  );
}

export function PhotoAlbum() {
  const [pages, setPages] = useState(firstPages);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [editing, setEditing] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const reducedMotion = useReducedMotion();
  const importInput = useRef<HTMLInputElement>(null);
  const page = pages[index];
  const layout = layouts[page.layout];

  function turn(delta: number) {
    if (busy || index + delta < 0 || index + delta >= pages.length) return;
    setDirection(delta);
    setIndex(index + delta);
  }

  async function pickPhoto(slot: number, file?: File) {
    if (!file || busy) return;
    if (!/^image\/(jpeg|png|webp|gif|avif)$/i.test(file.type)) {
      setError("Choose a JPG, PNG, WebP, GIF, or AVIF photo.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const photo = await readPhoto(file);
      setPages((current) => current.map((item, offset) => offset === index
        ? { ...item, photos: Array.from({ length: Math.max(slot + 1, item.photos.length) }, (_, position) =>
            position === slot ? photo : item.photos[position] ?? null) }
        : item));
    } catch {
      setError("That photo couldn’t be opened. Try choosing it again.");
    } finally {
      setBusy(false);
    }
  }

  function saveDraft() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(pages)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "us-lately-album.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function openDraft(file?: File) {
    if (!file) return;
    try {
      const draft: unknown = JSON.parse(await file.text());
      if (!isAlbum(draft)) throw new Error("Invalid draft");
      setPages(draft);
      setIndex(0);
      setError("");
    } catch {
      setError("Choose an album draft saved from this editor.");
    }
  }

  return (
    <section className="mx-auto max-w-2xl" aria-label="Photo album">
      <div className="mb-5 flex flex-wrap items-center justify-center gap-3 text-sm text-dusk-900">
        <button type="button" onClick={() => setEditing(!editing)} className="rounded-full bg-butter-200 px-4 py-2 font-semibold">
          {editing ? "Preview album" : "Edit album"}
        </button>
        {editing && <>
          <button type="button" onClick={saveDraft} className="underline underline-offset-4" disabled={busy}>Save draft</button>
          <button type="button" onClick={() => importInput.current?.click()} className="underline underline-offset-4" disabled={busy}>Open draft</button>
          <input ref={importInput} type="file" accept=".json,application/json" hidden onChange={(event) => {
            void openDraft(event.target.files?.[0]);
            event.currentTarget.value = "";
          }} />
        </>}
      </div>
      {editing && <p className="mb-5 text-center text-sm text-dusk-700">Choose a layout, then select a photo for each pocket. Save a draft to keep your arrangement.</p>}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-dusk-900">
        <button type="button" className="min-h-11 px-2 font-semibold disabled:opacity-40" disabled={busy || index === 0} onClick={() => turn(-1)}>← Previous</button>
        <p aria-live="polite" className="font-serif text-xl">Page {index + 1} of {pages.length}</p>
        <button type="button" className="min-h-11 px-2 font-semibold disabled:opacity-40" disabled={busy || index === pages.length - 1} onClick={() => turn(1)}>Next →</button>
      </div>
      <div className="rounded-r-xl bg-dusk-900 p-2 pl-3 shadow-xl [perspective:1200px] sm:p-4 sm:pl-5">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={{
              entering: (delta: number) => ({ rotateY: reducedMotion ? 0 : delta * -80, opacity: 0 }),
              visible: { rotateY: 0, opacity: 1 },
              leaving: (delta: number) => ({ rotateY: reducedMotion ? 0 : delta * 80, opacity: 0 }),
            }}
            initial="entering"
            animate="visible"
            exit="leaving"
            transition={{ duration: reducedMotion ? 0 : 0.28 }}
            className="relative aspect-[3/4] origin-left rounded-r-lg bg-[#eeebe2] py-4 pl-9 pr-4 shadow-inner sm:py-7 sm:pl-14 sm:pr-7"
          >
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-[12%] left-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((ring) => <span key={ring} className="h-2 w-6 rounded-full bg-linear-to-b from-[#555b62] via-[#f8f8f4] to-[#697078] shadow-sm sm:w-9" />)}
            </div>
            <div className={`grid h-full gap-3 sm:gap-5 ${layout.grid}`}>
              {Array.from({ length: layout.pockets }, (_, slot) => {
                const photo = page.photos[slot];
                return (
                  <div key={slot} className="relative grid min-h-0 min-w-0 place-items-center overflow-hidden rounded-sm border border-white/80 bg-[#dbd8cb]/50 p-1 shadow-sm after:pointer-events-none after:absolute after:inset-0 after:bg-linear-to-br after:from-white/25 after:via-transparent after:to-white/15 focus-within:ring-2 focus-within:ring-dusk-700 sm:p-2">
                    {photo ? (
                      // Local drafts contain browser data URLs, so no image optimizer is needed.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo.src} alt={photo.name} className="absolute inset-0 size-full object-contain p-1 sm:p-2" />
                    ) : editing && <span className="px-1 text-center text-xs font-semibold text-dusk-700 sm:text-sm">+ Add photo</span>}
                    {editing && <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" aria-label={`Choose photo for pocket ${slot + 1}`} disabled={busy} className="absolute inset-0 z-10 size-full cursor-pointer opacity-0" onChange={(event) => {
                      void pickPhoto(slot, event.target.files?.[0]);
                      event.currentTarget.value = "";
                    }} />}
                    {editing && photo && <button type="button" aria-label={`Remove photo from pocket ${slot + 1}`} disabled={busy} className="absolute right-1 top-1 z-20 grid size-8 place-items-center rounded-full bg-cream text-xl text-dusk-900 shadow-sm focus-visible:outline-2" onClick={() => {
                      setPages((current) => current.map((item, offset) => offset === index
                        ? { ...item, photos: item.photos.map((entry, position) => position === slot ? null : entry) }
                        : item));
                    }}>×</button>}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {editing && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-dusk-900">
          <label className="flex items-center gap-2 font-semibold">
            Layout
            <select value={page.layout} disabled={busy} className="rounded-md border border-dusk-300 bg-white p-2" onChange={(event) => {
              const nextLayout = event.target.value as Layout;
              setPages((current) => current.map((item, offset) => offset === index ? { ...item, layout: nextLayout } : item));
            }}>
              {Object.entries(layouts).map(([id, option]) => <option key={id} value={id}>{option.name}</option>)}
            </select>
          </label>
          <button type="button" disabled={busy} className="min-h-11 rounded-full bg-dusk-100 px-4 font-semibold" onClick={() => {
            setPages((current) => [...current, { layout: "pair", photos: [] }]);
            setDirection(1);
            setIndex(pages.length);
          }}>+ Add page</button>
        </div>
      )}
      {error && <p role="alert" className="mt-4 text-center text-sm text-red-800">{error}</p>}
    </section>
  );
}
