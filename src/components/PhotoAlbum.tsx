"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState, useSyncExternalStore } from "react";

const layouts = {
  cover: { name: "Cover photo and text", pockets: 1, grid: "grid-cols-1 grid-rows-1" },
  horizontal: { name: "Three horizontal photos", pockets: 3, grid: "grid-cols-1 grid-rows-3" },
  single: { name: "One full-page photo", pockets: 1, grid: "grid-cols-1 grid-rows-1" },
  pair: { name: "Two stacked photos", pockets: 2, grid: "grid-cols-1 grid-rows-2" },
  trio: { name: "One wide, two small", pockets: 3, grid: "grid-cols-2 grid-rows-2 [&>*:first-child]:col-span-2" },
  four: { name: "Four pockets", pockets: 4, grid: "grid-cols-2 grid-rows-2" },
  six: { name: "Six pockets", pockets: 6, grid: "grid-cols-2 grid-rows-3" },
};

type Layout = keyof typeof layouts;
type Photo = { src: string; name: string };
type AlbumPage = { layout: Layout; photos: (Photo | null)[]; title?: string; caption?: string };

const firstPages: AlbumPage[] = [{ layout: "cover", photos: [], title: "Before we say I do", caption: "PJ & Jedah" }, { layout: "pair", photos: [] }, { layout: "six", photos: [] }];

const spreadQuery = "(min-width: 768px) and (orientation: landscape)";

function subscribeToSpread(change: () => void) {
  const media = window.matchMedia(spreadQuery);
  media.addEventListener("change", change);
  return () => media.removeEventListener("change", change);
}

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
    [page.title, page.caption].every((text) => text === undefined || typeof text === "string") &&
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
  const isSpread = useSyncExternalStore(subscribeToSpread, () => window.matchMedia(spreadQuery).matches, () => false);
  const page = pages[index];
  const first = isSpread ? index - index % 2 : index;
  const visiblePages = pages.slice(first, first + (isSpread ? 2 : 1));

  function updatePage(at: number, update: (item: AlbumPage) => AlbumPage) {
    setPages((current) => current.map((item, offset) => offset === at ? update(item) : item));
  }

  function movePage(delta: number) {
    const next = index + delta;
    if (busy || next < 0 || next >= pages.length) return;
    const ordered = [...pages];
    [ordered[index], ordered[next]] = [ordered[next], ordered[index]];
    setDirection(delta);
    setPages(ordered);
    setIndex(next);
  }

  function turn(delta: number) {
    const next = first + delta * (isSpread ? 2 : 1);
    if (busy || next < 0 || next >= pages.length) return;
    setDirection(delta);
    setIndex(next);
  }

  async function pickPhotos(at: number, files: File[], slot?: number) {
    if (!files.length || busy) return;
    if (files.some((file) => !/^image\/(jpeg|png|webp|gif|avif)$/i.test(file.type))) {
      setError("Choose JPG, PNG, WebP, GIF, or AVIF photos.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const loaded = await Promise.all(files.map(readPhoto));
      setPages((current) => {
        const selected = [...loaded];
        const next = [...current];
        const item = next[at];
        const photos = [...item.photos];
        if (slot !== undefined) {
          while (photos.length < slot) photos.push(null);
          photos[slot] = selected[0];
        } else {
          for (let pocket = 0; pocket < layouts[item.layout].pockets && selected.length; pocket++) {
            if (!photos[pocket]) photos[pocket] = selected.shift()!;
          }
          const overflowLayout = item.layout === "cover" ? "pair" : item.layout;
          const capacity = layouts[overflowLayout].pockets;
          const extraPages: AlbumPage[] = [];
          while (selected.length) {
            extraPages.push({ layout: overflowLayout, photos: selected.splice(0, capacity) });
          }
          next.splice(at + 1, 0, ...extraPages);
        }
        next[at] = { ...item, photos };
        return next;
      });
    } catch {
      setError("The photos couldn’t be opened. Try choosing them again.");
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
    if (!file || busy) return;
    setBusy(true);
    try {
      const draft: unknown = JSON.parse(await file.text());
      if (!isAlbum(draft)) throw new Error("Invalid draft");
      setPages(draft);
      setIndex(0);
      setError("");
    } catch {
      setError("Choose an album draft saved from this editor.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mx-auto max-w-4xl" aria-label="Photo album">
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
      {editing && <p className="mb-5 text-center text-sm text-dusk-700">Choose a layout and fill the pockets. Adding several photos fills empty pockets first, then creates more pages as needed.</p>}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-dusk-900">
        <button type="button" className="min-h-11 px-2 font-semibold disabled:opacity-40" disabled={busy || first === 0} onClick={() => turn(-1)}>← Previous</button>
        <p aria-live="polite" className="font-serif text-xl">{visiblePages.length > 1 ? `Pages ${first + 1}–${first + visiblePages.length}` : `Page ${first + 1}`} of {pages.length}</p>
        <button type="button" className="min-h-11 px-2 font-semibold disabled:opacity-40" disabled={busy || first + visiblePages.length >= pages.length} onClick={() => turn(1)}>Next →</button>
      </div>
      <div className={`mx-auto rounded-sm border border-[#55796d] bg-[#75978a] p-2 shadow-xl [perspective:1600px] sm:p-3 ${isSpread ? "max-w-4xl" : "max-w-lg"}`}>
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={`${isSpread}-${first}`}
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
            className={`relative grid ${isSpread ? "grid-cols-2 origin-center" : "grid-cols-1 origin-left"}`}
          >
            {visiblePages.map((paper, offset) => {
              const at = first + offset;
              const leftSide = isSpread && offset === 0;
              const layout = layouts[paper.layout];
              return (
                <div key={at} className={`album-paper relative flex aspect-[3/4] min-w-0 flex-col gap-2 overflow-hidden py-4 sm:py-6 ${leftSide ? "pl-4 pr-8 sm:pl-6 sm:pr-11" : "pl-8 pr-4 sm:pl-11 sm:pr-6"}`}>
                  <div aria-hidden="true" className={`pointer-events-none absolute inset-y-[8%] z-20 flex flex-col justify-between ${leftSide ? "right-0" : "left-0"}`}>
                    {Array.from({ length: 9 }, (_, ring) => ring).map((ring) => <span key={ring} className="h-2 w-6 rounded-full bg-linear-to-b from-[#61594b] via-[#fff9e5] to-[#887966] shadow-sm sm:w-8" />)}
                  </div>
                  {paper.layout === "cover" && <p className="shrink-0 whitespace-pre-wrap break-words text-center font-serif text-lg font-semibold uppercase leading-tight text-[#58412e] sm:text-2xl">{paper.title}</p>}
                  <div className={`grid min-h-0 flex-1 gap-3 sm:gap-5 ${layout.grid}`}>
                    {Array.from({ length: layout.pockets }, (_, slot) => {
                      const photo = paper.photos[slot];
                      return (
                        <div key={slot} className="relative grid min-h-0 min-w-0 place-items-center overflow-hidden album-pocket rounded-[2px] p-1 focus-within:ring-2 focus-within:ring-dusk-700 sm:p-2">
                          {photo ? (
                            // Local drafts contain browser data URLs, so no image optimizer is needed.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={photo.src} alt={photo.name} className="absolute inset-0 size-full object-contain p-1 sm:p-2" />
                          ) : editing && <span className="px-1 text-center text-xs font-semibold text-dusk-700 sm:text-sm">+ Add photo</span>}
                          {editing && <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" aria-label={`Choose photo for pocket ${slot + 1}`} disabled={busy} className="absolute inset-0 z-10 size-full cursor-pointer opacity-0" onChange={(event) => {
                            void pickPhotos(at, Array.from(event.target.files ?? []), slot);
                            event.currentTarget.value = "";
                          }} />}
                          {editing && photo && <button type="button" aria-label={`Remove photo from pocket ${slot + 1}`} disabled={busy} className="absolute right-1 top-1 z-20 grid size-8 place-items-center rounded-full bg-cream text-xl text-dusk-900 shadow-sm focus-visible:outline-2" onClick={() => {
                            updatePage(at, (item) => ({ ...item, photos: item.photos.map((entry, position) => position === slot ? null : entry) }));
                          }}>×</button>}
                        </div>
                      );
                    })}
                  </div>
                  {paper.layout === "cover" && <p className="shrink-0 whitespace-pre-wrap break-words text-center font-serif text-sm uppercase text-[#58412e] sm:text-base">{paper.caption}</p>}
                </div>
              );
            })}
            {isSpread && visiblePages.length === 1 && <div aria-hidden="true" className="album-paper aspect-[3/4]" />}
          </motion.div>
        </AnimatePresence>
      </div>
      {editing && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-dusk-900">
          <label className="flex items-center gap-2 font-semibold">Editing page
            <select value={index} disabled={busy} className="rounded-md border border-dusk-300 bg-white p-2" onChange={(event) => {
              const next = Number(event.target.value);
              setDirection(next > index ? 1 : -1);
              setIndex(next);
            }}>
              {pages.map((_, offset) => <option key={offset} value={offset}>{offset + 1}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 font-semibold">
            Layout
            <select value={page.layout} disabled={busy} className="rounded-md border border-dusk-300 bg-white p-2" onChange={(event) => {
              const nextLayout = event.target.value as Layout;
              setPages((current) => current.map((item, offset) => offset === index ? { ...item, layout: nextLayout } : item));
            }}>
              {Object.entries(layouts).map(([id, option]) => <option key={id} value={id}>{option.name}</option>)}
            </select>
          </label>
          <label className="relative flex min-h-11 cursor-pointer items-center rounded-full bg-butter-200 px-4 font-semibold focus-within:outline-2">
            Add photos
            <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={busy} aria-label="Add multiple photos" className="absolute inset-0 size-full cursor-pointer opacity-0" onChange={(event) => {
              void pickPhotos(index, Array.from(event.target.files ?? []));
              event.currentTarget.value = "";
            }} />
          </label>
          <button type="button" disabled={busy || index === 0} className="min-h-11 px-2 underline disabled:opacity-40" onClick={() => movePage(-1)}>Move earlier</button>
          <button type="button" disabled={busy || index === pages.length - 1} className="min-h-11 px-2 underline disabled:opacity-40" onClick={() => movePage(1)}>Move later</button>
          <button type="button" disabled={busy} className="min-h-11 rounded-full bg-dusk-100 px-4 font-semibold" onClick={() => {
            setPages((current) => [...current, { layout: "pair", photos: [] }]);
            setDirection(1);
            setIndex(pages.length);
          }}>+ Add page</button>
        </div>
      )}
      {editing && page.layout === "cover" && (
        <div className="mx-auto mt-4 grid max-w-lg gap-3 text-sm text-dusk-900 sm:grid-cols-2">
          <label className="grid gap-1">Cover title
            <input maxLength={70} disabled={busy} value={page.title ?? ""} className="rounded-md border border-dusk-300 bg-white p-2" onChange={(event) => {
              const title = event.target.value;
              updatePage(index, (item) => ({ ...item, title }));
            }} />
          </label>
          <label className="grid gap-1">Cover caption
            <input maxLength={70} disabled={busy} value={page.caption ?? ""} className="rounded-md border border-dusk-300 bg-white p-2" onChange={(event) => {
              const caption = event.target.value;
              updatePage(index, (item) => ({ ...item, caption }));
            }} />
          </label>
        </div>
      )}
      {error && <p role="alert" className="mt-4 text-center text-sm text-red-800">{error}</p>}
    </section>
  );
}
