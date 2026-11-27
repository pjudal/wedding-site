"use client";

import localFont from "next/font/local";
import { motion, useReducedMotion } from "motion/react";
import { type PointerEvent, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { ensureIds, mergeAlbum, newPageId, same } from "@/lib/albumSync";

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
type Photo = { src: string; name: string; zoom?: number; x?: number; y?: number; caption?: string; showCaption?: boolean; captionSize?: number; captionBackground?: boolean; captionColor?: string };

const defaultCaptionColor = "#1d2b39";

const pocketHandwriting = localFont({ src: "../assets/baby-doll.ttf", preload: false, display: "swap", variable: "--font-pocket-handwriting" });
type AlbumPage = { id?: string; layout: Layout; photos: (Photo | null)[]; title?: string; caption?: string };

const firstPages: AlbumPage[] = [{ id: "start-cover", layout: "cover", photos: [], title: "Before we say I do", caption: "PJ & Jedah" }, { id: "start-pair", layout: "pair", photos: [] }, { id: "start-six", layout: "six", photos: [] }];

// Vertical bounds of the six rings in the supplied 245 × 1350 artwork.
const binderRings = [[3, 63], [201, 60], [396, 59], [899, 64], [1088, 64], [1273, 66]] as const;

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
        (photo.zoom === undefined || (Number.isFinite(photo.zoom) && photo.zoom >= 0.5 && photo.zoom <= 3)) &&
        (photo.caption === undefined || typeof photo.caption === "string" && photo.caption.length <= 80) &&
        (photo.showCaption === undefined || typeof photo.showCaption === "boolean") &&
        (photo.captionSize === undefined || Number.isInteger(photo.captionSize) && photo.captionSize >= 60 && photo.captionSize <= 160) &&
        (photo.captionBackground === undefined || typeof photo.captionBackground === "boolean") &&
        (photo.captionColor === undefined || typeof photo.captionColor === "string" && /^#[0-9a-f]{6}$/i.test(photo.captionColor)) &&
        [photo.x, photo.y].every((offset) => offset === undefined || (Number.isFinite(offset) && Math.abs(offset) <= 100)) &&
        (/^data:image\/(jpeg|png|webp|gif|avif);base64,/i.test(photo.src) || /^\/api\/album\?photo=[a-f0-9-]{36}\.jpg$/.test(photo.src) ||
          /^draft:[a-f0-9-]{36}\.jpg$/.test(photo.src)))),
  );
}

function AlbumArrow({ direction, disabled, onClick }: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const previous = direction === "previous";
  return (
    <button
      type="button"
      aria-label={previous ? "Previous pages" : "Next pages"}
      disabled={disabled}
      onClick={onClick}
      className="grid size-12 cursor-pointer place-items-center rounded-full bg-butter-50 text-dusk-700 transition-colors enabled:hover:bg-butter-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dusk-700 disabled:cursor-default disabled:opacity-30 sm:size-14"
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className={`size-9 ${previous ? "-scale-x-100" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 27c10 1 18-2 30-3m-10-8 10 8-9 10" />
        <path d="M15 11v6m-3-3h6M9 34v5m-2.5-2.5h5" className="stroke-dusk-500" />
      </svg>
    </button>
  );
}

function PocketCaption({ photo }: { photo?: Photo | null }) {
  if (!photo?.showCaption || !photo.caption?.trim()) return null;
  const scale = (photo.captionSize ?? 100) / 100;
  return (
    <span style={{ fontSize: `clamp(${0.875 * scale}rem, ${3 * scale}vw, ${1.125 * scale}rem)`, color: photo.captionColor ?? defaultCaptionColor }} className={`pointer-events-none absolute inset-x-2 bottom-2 z-10 mx-auto w-fit max-w-[calc(100%-1rem)] whitespace-pre-wrap rounded-sm px-1.5 py-0.5 text-center leading-tight wrap-anywhere [font-family:var(--font-pocket-handwriting),cursive] ${photo.captionBackground === false ? "" : "bg-cream/95 shadow-sm"}`}>
      {photo.caption}
    </span>
  );
}

function photoDisplayUrl(photo: Photo, cover = false) {
  if (!photo.src.startsWith("/api/album?photo=")) return photo.src;
  const size = (photo.zoom ?? 1) > 1.5 ? 1440 : cover ? 640 : 960;
  return `${photo.src}&size=${size}`;
}

function photoFraming(photo: Photo) {
  return { scale: photo.zoom ?? 1, translate: `${photo.x ?? 0}% ${photo.y ?? 0}%` };
}

const framingControls = [
  { key: "zoom", label: "Zoom", min: 0.5, max: 3, step: 0.05, initial: 1 },
  { key: "x", label: "Left / right", min: -100, max: 100, step: 1, initial: 0 },
  { key: "y", label: "Up / down", min: -100, max: 100, step: 1, initial: 0 },
] as const;

// Keep these identifiers stable across deployments so visual updates can reopen drafts.
const draftStore = "drafts";
const draftKey = "us-lately";
// The last online version this device synced with (its git "base"), and a copy of this device's own draft kept
// the first time it syncs, in case the online copy replaced edits that had never been shared.
const baseKey = "us-lately-base";
const backupKey = "us-lately-backup";
const draftKeyStorage = "album-draft-key";
type SyncBase = { revision: string | null; pages: AlbumPage[] };
type SyncStatus = "starting" | "synced" | "syncing" | "offline" | "locked";

function openAlbumStorage(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("wedding-photo-album", 1);
    request.onupgradeneeded = () => request.result.createObjectStore(draftStore);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readAlbumDraft(db: IDBDatabase, key = draftKey): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const request = db.transaction(draftStore).objectStore(draftStore).get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function writeAlbumStorage(db: IDBDatabase | null, key: string, value: unknown) {
  try {
    db?.transaction(draftStore, "readwrite").objectStore(draftStore).put(value, key);
  } catch {
    // The online draft still has everything; this only speeds up the next visit.
  }
}

function isSyncBase(value: unknown): value is SyncBase {
  const base = value as SyncBase | undefined;
  return !!base && (base.revision === null || typeof base.revision === "string") && isAlbum(base.pages);
}

function readSavedDraftKey() {
  try {
    return localStorage.getItem(draftKeyStorage) ?? "";
  } catch {
    return "";
  }
}

async function loadPublishedAlbum(signal?: AbortSignal): Promise<AlbumPage[] | null> {
  const response = await fetch("/api/album", { cache: "no-store", signal });
  if (!response.ok) throw new Error("Couldn’t load the album.");
  const data: unknown = await response.json();
  if (data === null) return null;
  if (!isAlbum(data)) throw new Error("Couldn’t read the album.");
  return data;
}

async function albumJpeg(src: string): Promise<Blob> {
  const image = new Image();
  image.src = src;
  await image.decode();
  const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Couldn’t prepare a photo.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) => canvas.toBlob(
    (file) => file ? resolve(file) : reject(new Error("Couldn’t prepare a photo.")),
    "image/jpeg", 0.85,
  ));
}

async function postAlbum(action: "photo" | "publish" | "draft-photo" | "draft-save", key: string, body: Blob | string) {
  for (let attempt = 0; ; attempt++) {
    let response: Response;
    try {
      response = await fetch(`/api/album?action=${action}`, {
        method: "POST",
        headers: {
          "x-album-admin": key,
          "Content-Type": action.endsWith("photo") ? "image/jpeg" : "application/json",
        },
        body,
      });
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
      continue;
    }
    if (response.status < 500 || attempt === 2) return response;
    await response.body?.cancel();
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
}

export function PhotoAlbum({ adminKey, initialAlbum }: { adminKey?: string; initialAlbum?: unknown }) {
  const admin = adminKey !== undefined;
  const [published, setPublished] = useState<"loading" | "ready" | "missing" | "failed">(
    initialAlbum === null ? "missing" : isAlbum(initialAlbum) ? "ready" : "loading",
  );
  const [coverSettled, setCoverSettled] = useState(false);
  const uploads = useRef(new Map<string, Promise<string>>());
  const [publishNotice, setPublishNotice] = useState("");
  const [pages, setPages] = useState(() => isAlbum(initialAlbum) ? initialAlbum : firstPages);
  const [draftStatus, setDraftStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const [savedPages, setSavedPages] = useState(firstPages);
  const [saveFailed, setSaveFailed] = useState(false);
  const storage = useRef<IDBDatabase | null>(null);

  // ---- syncing between devices (git style: pull, merge, push) ----
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("starting");
  const [syncNote, setSyncNote] = useState("");
  const [hasBackup, setHasBackup] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [keyTried, setKeyTried] = useState(false);
  const [syncedPages, setSyncedPages] = useState<AlbumPage[] | null>(null);
  const pagesRef = useRef(pages);
  const indexRef = useRef(0);
  const realignTo = useRef<string | null>(null);
  const base = useRef<SyncBase | null>(null);
  const hadLocalDraft = useRef(false);
  const syncKey = useRef("");
  const running = useRef<Promise<boolean> | null>(null);
  const syncAgain = useRef(false);
  // Resolves true once this device and the online draft match (everything pulled, merged and pushed).
  const syncNow = useRef<() => Promise<boolean>>(async () => false);
  const pushOnLeave = useRef<() => void>(() => {});
  useLayoutEffect(() => { pagesRef.current = pages; }, [pages]);

  function setBase(next: SyncBase) {
    base.current = next;
    setSyncedPages(next.pages);
    writeAlbumStorage(storage.current, baseKey, next);
  }

  // Replace pages that came from the other devices, keeping the page that's open in view.
  function takePages(next: AlbumPage[]) {
    realignTo.current = pagesRef.current[indexRef.current]?.id ?? null;
    pagesRef.current = next;
    setPages(next);
  }

  function uploadPhoto(src: string) {
    let pending = uploads.current.get(src);
    if (!pending) {
      pending = (async () => {
        const blob = src.startsWith("draft:")
          // Photos saved by the first version of online drafts: move them to the shared photo store.
          ? await fetch(`/api/album?draft=${encodeURIComponent(src.slice(6))}`, { headers: { "x-album-admin": syncKey.current }, cache: "no-store" })
            .then((response) => { if (!response.ok) throw new Error("Couldn’t load a photo from the online draft."); return response.blob(); })
          : await albumJpeg(src);
        const response = await postAlbum("photo", syncKey.current, blob);
        const result = await response.json().catch(() => ({}));
        if (!response.ok || typeof result.src !== "string") throw new Error(result.error ?? "Photo upload failed.");
        return result.src as string;
      })();
      uploads.current.set(src, pending);
      pending.catch(() => uploads.current.delete(src));
    }
    return pending;
  }

  // Upload any photo that only exists on this device, and return the pages pointing at the uploaded copies.
  async function withUploadedPhotos(list: AlbumPage[], progress?: (page: number) => void) {
    const swaps = new Map<string, string>();
    for (const [position, item] of list.entries()) {
      for (const photo of item.photos) {
        if (!photo || photo.src.startsWith("/api/album?photo=") || swaps.has(photo.src)) continue;
        progress?.(position + 1);
        swaps.set(photo.src, await uploadPhoto(photo.src));
      }
    }
    const swap = (items: AlbumPage[]) => swaps.size ? items.map((item) => ({
      ...item,
      photos: item.photos.map((photo) => photo && swaps.has(photo.src) ? { ...photo, src: swaps.get(photo.src)! } : photo),
    })) : items;
    return { pages: swap(list), swap };
  }

  async function syncStep(): Promise<"synced" | "locked" | "again"> {
    const headers = { "x-album-admin": syncKey.current };
    // Pull.
    const response = await fetch("/api/album?draft", { headers, cache: "no-store" });
    if (response.status === 403) {
      setSyncStatus("locked");
      return "locked";
    }
    if (!response.ok) throw new Error("Online draft unavailable");
    const remote: { revision: string | null; pages: unknown } = await response.json();
    const known = base.current;
    if (remote.revision !== null && remote.revision !== known?.revision) {
      if (!isAlbum(remote.pages)) throw new Error("Unreadable online draft");
      const theirs = ensureIds(remote.pages);
      const { pages: ready } = await withUploadedPhotos(theirs);
      if (!known) {
        // First sync on this device: the online copy wins, and this device's own copy is kept as a backup.
        const mine = pagesRef.current;
        if (hadLocalDraft.current && !same(mine, ready)) {
          writeAlbumStorage(storage.current, backupKey, mine);
          setHasBackup(true);
          setSyncNote("Opened the latest version from your other devices. This device had its own older copy, so it was kept as a backup below.");
        }
        takePages(ready);
      } else {
        const merged = mergeAlbum(known.pages, pagesRef.current, ready);
        if (!same(merged, pagesRef.current)) {
          takePages(merged);
          setSyncNote("Brought in changes made on another device.");
        }
      }
      setBase({ revision: remote.revision, pages: theirs });
      return "again";
    }
    // Online copy is what this device last saw. Push if there's anything new here.
    const snapshot = pagesRef.current;
    if (known && known.revision === remote.revision && same(snapshot, known.pages)) {
      setSyncStatus("synced");
      return "synced";
    }
    setSyncStatus("syncing");
    const { pages: ready, swap } = await withUploadedPhotos(snapshot);
    if (ready !== snapshot) {
      pagesRef.current = swap(pagesRef.current);
      setPages(swap);
    }
    const saved = await postAlbum("draft-save", syncKey.current, JSON.stringify({ pages: ready, revision: remote.revision }));
    if (saved.status === 409) {
      // Another device saved in between: pull and merge again.
      return "again";
    }
    if (saved.status === 403) {
      setSyncStatus("locked");
      return "locked";
    }
    if (!saved.ok) throw new Error("Online draft save failed");
    const { revision } = await saved.json();
    setBase({ revision, pages: ready });
    return "again";
  }

  useEffect(() => {
    syncNow.current = () => {
      if (running.current) {
        // Already syncing: ask it to go round once more so it also picks up whatever just changed.
        syncAgain.current = true;
        return running.current;
      }
      const run = (async () => {
        try {
          let rounds = 0;
          let result: Awaited<ReturnType<typeof syncStep>>;
          do {
            syncAgain.current = false;
            result = await syncStep();
          } while (result !== "locked" && (result === "again" || syncAgain.current) && ++rounds < 8);
          return result === "synced";
        } catch {
          setSyncStatus("offline");
          return false;
        } finally {
          running.current = null;
        }
      })();
      running.current = run;
      return run;
    };

    // Leaving the page (switching apps, locking the phone, closing the tab): send the latest edits straight away in one
    // request the browser finishes even if the page is frozen or closed. If another device saved in the meantime the
    // server refuses it (409) and nothing is lost: the edits stay on this device and merge the next time it opens.
    pushOnLeave.current = () => {
      const known = base.current;
      const snapshot = pagesRef.current;
      if (!known || same(snapshot, known.pages)) return;
      const pendingPhotos = snapshot.some((item) => item.photos.some((photo) => photo && !photo.src.startsWith("/api/album?photo=")));
      const body = JSON.stringify({ pages: snapshot, revision: known.revision });
      // Browsers cap these requests at 64 KB, and new photos have to upload first: fall back to a normal sync.
      if (pendingPhotos || body.length > 60_000) {
        void syncNow.current();
        return;
      }
      fetch("/api/album?action=draft-save", {
        method: "POST",
        keepalive: true,
        headers: { "x-album-admin": syncKey.current, "Content-Type": "application/json" },
        body,
      }).then(async (response) => {
        if (!response.ok) return;
        const { revision } = await response.json();
        if (base.current === known) setBase({ revision, pages: snapshot });
      }).catch(() => {});
    };
  });


  useEffect(() => {
    if (!admin) {
      if (initialAlbum === null || isAlbum(initialAlbum)) return;
      const controller = new AbortController();
      void loadPublishedAlbum(controller.signal).then((album) => {
        if (!controller.signal.aborted) {
          if (album) setPages(album);
          setPublished(album ? "ready" : "missing");
        }
      }).catch(() => {
        if (!controller.signal.aborted) setPublished("failed");
      });
      return () => controller.abort();
    }
    let active = true;
    let connection: IDBDatabase | undefined;
    async function restoreDraft() {
      try {
        connection = await openAlbumStorage();
        if (!active) {
          connection.close();
          return;
        }
        const draft = await readAlbumDraft(connection);
        const savedBase = await readAlbumDraft(connection, baseKey).catch(() => undefined);
        const backup = await readAlbumDraft(connection, backupKey).catch(() => undefined);
        if (!active) return;
        if (draft !== undefined && !isAlbum(draft)) throw new Error("Unreadable album draft");
        hadLocalDraft.current = isAlbum(draft);
        if (isSyncBase(savedBase)) {
          base.current = { ...savedBase, pages: ensureIds(savedBase.pages) };
          setSyncedPages(base.current.pages);
        }
        setHasBackup(isAlbum(backup));
        const restored = isAlbum(draft) ? draft : await loadPublishedAlbum().catch(() => null);
        if (!active) return;
        if (restored) {
          const withIds = ensureIds(restored);
          pagesRef.current = withIds;
          setPages(withIds);
          setSavedPages(withIds);
        }
        storage.current = connection;
        setDraftStatus("ready");
      } catch {
        connection?.close();
        if (active) setDraftStatus("unavailable");
      }
    }
    syncKey.current = readSavedDraftKey();
    void restoreDraft();
    return () => {
      active = false;
      connection?.close();
      storage.current = null;
    };
  }, [admin, initialAlbum]);

  useEffect(() => {
    if (!admin || draftStatus !== "ready" || pages === savedPages || !storage.current) return;
    let active = true;
    try {
      const transaction = storage.current.transaction(draftStore, "readwrite");
      transaction.objectStore(draftStore).put(pages, draftKey);
      transaction.oncomplete = () => {
        if (active) {
          setSavedPages(pages);
          setSaveFailed(false);
        }
      };
      transaction.onabort = () => {
        if (active) setSaveFailed(true);
      };
    } catch {
      queueMicrotask(() => { if (active) setSaveFailed(true); });
    }
    return () => { active = false; };
  }, [admin, draftStatus, pages, savedPages]);

  // Sync a moment after each edit stops, every 20 seconds, and whenever this tab comes back into focus or online.
  useEffect(() => {
    if (!admin || draftStatus === "loading") return;
    const timer = window.setTimeout(() => void syncNow.current(), 1500);
    return () => window.clearTimeout(timer);
  }, [admin, draftStatus, pages]);

  useEffect(() => {
    if (!admin || draftStatus === "loading") return;
    const sync = () => {
      if (document.visibilityState === "visible") void syncNow.current();
      else pushOnLeave.current();
    };
    const leave = () => pushOnLeave.current();
    const timer = window.setInterval(sync, 20_000);
    window.addEventListener("focus", sync);
    window.addEventListener("online", sync);
    window.addEventListener("pagehide", leave);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", sync);
      window.removeEventListener("online", sync);
      window.removeEventListener("pagehide", leave);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [admin, draftStatus]);
  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const [index, setIndex] = useState(0);
  useLayoutEffect(() => { indexRef.current = index; }, [index]);
  useLayoutEffect(() => {
    if (realignTo.current === null) return;
    const at = pages.findIndex((item) => item.id === realignTo.current);
    realignTo.current = null;
    setIndex((current) => at >= 0 ? at : Math.min(current, pages.length - 1));
  }, [pages]);
  const [flip, setFlip] = useState<{ from: number; to: number; delta: number; angle: number; phase: "drag" | "finish" | "return" } | null>(null);
  const pageDrag = useRef<{ pointer: number; x: number; y: number; width: number; delta?: number } | null>(null);
  const [editMode, setEditing] = useState(true);
  const editing = admin && editMode;
  const [error, setError] = useState("");
  const [loading, setBusy] = useState(false);
  const busy = loading || flip !== null;
  const reducedMotion = useReducedMotion();
  const importInput = useRef<HTMLInputElement>(null);
  const isSpread = useSyncExternalStore(subscribeToSpread, () => window.matchMedia(spreadQuery).matches, () => false);
  const page = pages[Math.min(index, pages.length - 1)];
  const cover = pages[0].layout === "cover" ? pages[0] : undefined;
  const firstInside = cover ? 1 : 0;
  const activeIndex = Math.max(firstInside, index);
  const first = isSpread ? activeIndex - (activeIndex - firstInside) % 2 : activeIndex;
  const visiblePages = pages.slice(first, first + (isSpread ? 2 : 1));

  const preloadedPhotos = useRef(new Set<string>());
  useEffect(() => {
    if (admin || published !== "ready" || (!opened && cover?.photos[0] && !coverSettled) || !opened &&
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const count = isSpread ? 2 : 1;
    const nextPage = opened ? first + count : firstInside;
    for (const paper of pages.slice(nextPage, nextPage + count)) {
      for (const photo of paper.photos.slice(0, layouts[paper.layout].pockets)) {
        if (!photo) continue;
        const src = photoDisplayUrl(photo);
        if (preloadedPhotos.current.has(src)) continue;
        const image = new Image();
        image.fetchPriority = "low";
        preloadedPhotos.current.add(src);
        image.onerror = () => preloadedPhotos.current.delete(src);
        image.src = src;
      }
    }
  }, [admin, published, opened, first, firstInside, isSpread, pages, cover, coverSettled]);

  function updatePage(at: number, update: (item: AlbumPage) => AlbumPage) {
    setPages((current) => current.map((item, offset) => offset === at ? update(item) : item));
  }

  function movePage(delta: number) {
    const next = index + delta;
    if (busy || next < 0 || next >= pages.length) return;
    const ordered = [...pages];
    [ordered[index], ordered[next]] = [ordered[next], ordered[index]];
    setPages(ordered);
    setIndex(next);
    setOpened(next > 0 || !cover);
  }

  function openAlbum() {
    setIndex(firstInside);
    setOpening(false);
    setOpened(true);
  }

  function turn(delta: number) {
    const next = first + delta * (isSpread ? 2 : 1);
    if (busy || pageDrag.current || next < firstInside || next >= pages.length) return;
    if (reducedMotion) setIndex(next);
    else setFlip({ from: first, to: next, delta, angle: -delta * (isSpread ? 180 : 92), phase: "finish" });
  }

  function startPageDrag(event: PointerEvent<HTMLDivElement>) {
    if (editing || busy || pageDrag.current || !event.isPrimary || event.button !== 0) return;
    const { left, width } = event.currentTarget.getBoundingClientRect();
    pageDrag.current = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      width: isSpread ? width / 2 : width,
      delta: isSpread ? (event.clientX < left + width / 2 ? -1 : 1) : undefined,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function dragPage(event: PointerEvent<HTMLDivElement>) {
    const drag = pageDrag.current;
    if (!drag || drag.pointer !== event.pointerId) return;
    const distance = event.clientX - drag.x;
    if (!flip && (Math.abs(distance) < 8 || Math.abs(event.clientY - drag.y) > Math.abs(distance))) return;
    const delta = flip?.delta ?? drag.delta ?? (distance < 0 ? 1 : -1);
    const to = first + delta * (isSpread ? 2 : 1);
    if (to < firstInside || to >= pages.length || (!flip && distance * delta >= 0)) return;
    const progress = Math.min(0.98, Math.max(0.0001, -distance * delta / drag.width));
    if (!reducedMotion) {
      const angle = Math.acos(1 - progress * (isSpread ? 2 : 1)) * 180 / Math.PI;
      setFlip({ from: first, to, delta, angle: -delta * angle, phase: "drag" });
    }
  }

  function endPageDrag(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const drag = pageDrag.current;
    if (!drag || drag.pointer !== event.pointerId) return;
    pageDrag.current = null;
    const distance = event.clientX - drag.x;
    const delta = flip?.delta ?? drag.delta ?? (distance < 0 ? 1 : -1);
    const complete = !cancelled && -distance * delta >= drag.width * 0.22 &&
      Math.abs(distance) > Math.abs(event.clientY - drag.y);
    if (flip?.phase === "drag") {
      setFlip({ ...flip, angle: complete ? -delta * (isSpread ? 180 : 92) : 0, phase: complete ? "finish" : "return" });
    } else if (complete) {
      turn(delta);
    }
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
          photos[slot] = {
            ...selected[0],
            caption: photos[slot]?.caption,
            showCaption: photos[slot]?.showCaption,
            captionSize: photos[slot]?.captionSize,
            captionBackground: photos[slot]?.captionBackground,
            captionColor: photos[slot]?.captionColor,
          };
        } else {
          for (let pocket = 0; pocket < layouts[item.layout].pockets && selected.length; pocket++) {
            if (!photos[pocket]) photos[pocket] = selected.shift()!;
          }
          const overflowLayout = item.layout === "cover" ? "pair" : item.layout;
          const capacity = layouts[overflowLayout].pockets;
          const extraPages: AlbumPage[] = [];
          while (selected.length) {
            extraPages.push({ id: newPageId(), layout: overflowLayout, photos: selected.splice(0, capacity) });
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

  async function publishAlbum() {
    if (adminKey === undefined || busy) return;
    setBusy(true);
    setError("");
    setPublishNotice("");
    try {
      // Pull, merge and push first, so the album includes work saved from her other devices.
      setPublishNotice("Bringing in changes from your other devices…");
      if (!await syncNow.current()) {
        throw new Error("Couldn’t sync with your other devices, so nothing was published (guests still see the last version). Check your connection and try again.");
      }
      const snapshot = pagesRef.current;
      const { pages: manifest, swap } = await withUploadedPhotos(snapshot, (page) => {
        setPublishNotice(`Uploading photos from page ${page} of ${snapshot.length}…`);
      });
      if (manifest !== snapshot) {
        pagesRef.current = swap(pagesRef.current);
        setPages(swap);
      }
      setPublishNotice("Saving album layout…");
      const result = await postAlbum("publish", syncKey.current, JSON.stringify(manifest));
      if (!result.ok) {
        const failure = await result.json().catch(() => ({}));
        throw new Error(failure.error ?? "Couldn’t save the album layout.");
      }
      setPublishNotice("Album published. Guests can now see it on any device.");
    } catch (err) {
      setPublishNotice("");
      setError(err instanceof Error ? err.message : "Couldn’t publish. Your draft is still here.");
    } finally {
      setBusy(false);
    }
  }

  function downloadJson(data: unknown, name: string) {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data)], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function saveDraft() {
    downloadJson(pages, "us-lately-album.json");
  }

  async function downloadBackup() {
    if (!storage.current) return;
    const backup = await readAlbumDraft(storage.current, backupKey).catch(() => undefined);
    if (isAlbum(backup)) downloadJson(backup, "us-lately-album-this-device-backup.json");
  }

  function unlockSync() {
    syncKey.current = keyInput;
    try {
      localStorage.setItem(draftKeyStorage, keyInput);
    } catch {
      // Remembered for this visit only.
    }
    setKeyInput("");
    setKeyTried(true);
    setSyncStatus("starting");
    void syncNow.current();
  }

  async function openDraft(file?: File) {
    if (!file || busy) return;
    setBusy(true);
    try {
      const draft: unknown = JSON.parse(await file.text());
      if (!isAlbum(draft)) throw new Error("Invalid draft");
      setPages(ensureIds(draft));
      setIndex(0);
      setOpened(false);
      setError("");
    } catch {
      setError("Choose an album draft saved from this editor.");
    } finally {
      setBusy(false);
    }
  }

  function renderPaper(at: number, leftSide: boolean, editable = editing) {
    const paper = pages[at];
    if (!paper) return <div className="album-paper aspect-[3/4]" />;
    const layout = layouts[paper.layout];
    return (
      <div className={`album-paper relative flex aspect-[3/4] min-w-0 flex-col gap-2 overflow-hidden py-4 sm:py-6 ${leftSide ? "pl-4 pr-8 sm:pl-6 sm:pr-11" : "pl-8 pr-4 sm:pl-11 sm:pr-6"}`}>
        {paper.layout === "cover" && <p className="shrink-0 whitespace-pre-wrap break-words text-center font-serif text-lg font-semibold uppercase leading-tight text-[#58412e] sm:text-2xl">{paper.title}</p>}
        <div className={`grid min-h-0 flex-1 gap-3 sm:gap-5 ${layout.grid}`}>
          {Array.from({ length: layout.pockets }, (_, slot) => {
            const photo = paper.photos[slot];
            return (
              <div key={slot} className="relative grid min-h-0 min-w-0 place-items-center overflow-hidden album-pocket rounded-[2px] p-1 focus-within:ring-2 focus-within:ring-dusk-700 sm:p-2">
                {photo ? (
                  // Local drafts contain browser data URLs, so no image optimizer is needed.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoDisplayUrl(photo)} decoding="async" alt={photo.name} style={photoFraming(photo)} className="absolute inset-0 size-full object-contain p-1 sm:p-2" />
                ) : editable && <span className="px-1 text-center text-xs font-semibold text-dusk-700 sm:text-sm">+ Add photo</span>}
                <PocketCaption photo={photo} />
                {editable && <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" aria-label={`Choose photo for pocket ${slot + 1}`} disabled={busy} className="absolute inset-0 z-10 size-full cursor-pointer opacity-0" onChange={(event) => {
                  void pickPhotos(at, Array.from(event.target.files ?? []), slot);
                  event.currentTarget.value = "";
                }} />}
                {editable && photo && <button type="button" aria-label={`Remove photo from pocket ${slot + 1}`} disabled={busy} className="absolute right-1 top-1 z-20 grid size-8 place-items-center rounded-full bg-cream text-xl text-dusk-900 shadow-sm focus-visible:outline-2" onClick={() => {
                  updatePage(at, (item) => ({ ...item, photos: item.photos.map((entry, position) => position === slot ? null : entry) }));
                }}>×</button>}
              </div>
            );
          })}
        </div>
        {paper.layout === "cover" && <p className="shrink-0 whitespace-pre-wrap break-words text-center font-serif text-sm uppercase text-[#58412e] sm:text-base">{paper.caption}</p>}
      </div>
    );
  }

  if (!admin && published !== "ready") {
    const message = published === "missing" ? "Our photo album is coming soon."
      : published === "failed" ? "The album couldn’t load. Please try refreshing."
      : "Opening the album…";
    return <p role="status" className="text-center text-sm text-dusk-700">{message}</p>;
  }

  if (admin && draftStatus === "loading") {
    return <p role="status" className="text-center text-sm text-dusk-700">Opening your album draft…</p>;
  }

  return (
    <section className={`${pocketHandwriting.variable} mx-auto w-full max-w-[82rem]`} aria-label="Photo album">
      {admin && <div className="mb-5 flex flex-wrap items-center justify-center gap-3 text-sm text-dusk-900">
        <button type="button" onClick={() => setEditing(!editing)} className="rounded-full bg-butter-200 px-4 py-2 font-semibold">
          {editing ? "Preview album" : "Edit album"}
        </button>
        {editing && <>
          <button type="button" disabled={busy} onClick={() => void publishAlbum()} className="rounded-full bg-dusk-700 px-4 py-2 font-semibold text-white">Publish album</button>
          <button type="button" onClick={saveDraft} className="underline underline-offset-4" disabled={busy}>Save draft</button>
          <button type="button" onClick={() => importInput.current?.click()} className="underline underline-offset-4" disabled={busy}>Open draft</button>
          <input ref={importInput} type="file" accept=".json,application/json" hidden onChange={(event) => {
            void openDraft(event.target.files?.[0]);
            event.currentTarget.value = "";
          }} />
        </>}
      </div>}
      {admin && syncStatus === "locked" && <form className="mb-4 flex flex-wrap items-end justify-center gap-3 text-sm text-dusk-900" onSubmit={(event) => {
        event.preventDefault();
        if (keyInput) unlockSync();
      }}>
        <label className="grid gap-1">
          Album draft key (asked once on each device)
          <input type="password" value={keyInput} autoComplete="current-password" className="rounded-md border border-dusk-300 bg-white px-3 py-2" onChange={(event) => setKeyInput(event.target.value)} />
        </label>
        <button type="submit" disabled={!keyInput} className="min-h-10 rounded-full bg-butter-200 px-4 font-semibold disabled:opacity-50">Unlock syncing</button>
      </form>}
      {admin && <p role="status" className="mb-4 text-center text-sm text-dusk-700">
        {syncStatus === "locked"
          ? (keyTried ? "That key didn’t work. " : "") + "Edits are saved on this device and will sync to your other devices once unlocked."
          : syncStatus === "offline"
            ? draftStatus === "unavailable" || saveFailed
              ? "Can’t reach the online draft, and this browser couldn’t save your edits. Use Save draft to keep a copy before refreshing."
              : "Can’t reach the online draft right now. Edits are saved on this device and will sync when you’re back online."
            : syncStatus === "starting"
              ? "Checking for changes from your other devices…"
              : syncStatus === "syncing" || !same(pages, syncedPages)
                ? "Saving and syncing…"
                : "All changes saved and synced to your other devices."}
      </p>}
      {admin && (syncNote || hasBackup) && <p className="mb-4 text-center text-sm text-dusk-700">
        {syncNote}{syncNote && hasBackup && " "}
        {hasBackup && <button type="button" className="underline underline-offset-4" onClick={() => void downloadBackup()}>Download this device’s older copy</button>}
      </p>}
      {publishNotice && <p role="status" className="mb-4 text-center text-sm text-dusk-700">{publishNotice}</p>}
      {editing && <p className="mb-5 text-center text-sm text-dusk-700">Choose a layout and fill the pockets. Adding several photos fills empty pockets first, then creates more pages as needed.</p>}
      {!opened ? (
        <div className="mx-auto w-full max-w-[min(36rem,56svh)] [perspective:1200px]">
          <motion.button
            type="button"
            aria-label="Open album"
            disabled={busy || opening || firstInside >= pages.length}
            animate={opening ? { rotateY: -88, opacity: 0.25 } : { rotateY: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={reducedMotion || opening ? undefined : { rotateY: -7 }}
            onClick={() => reducedMotion ? openAlbum() : setOpening(true)}
            onAnimationComplete={() => { if (opening) openAlbum(); }}
            className="album-cover relative flex aspect-[3/4] w-full origin-left cursor-pointer flex-col items-center justify-center gap-4 rounded-r-lg px-10 py-6 text-center text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-dusk-900 disabled:cursor-default sm:gap-6"
          >
            <span className="whitespace-pre-wrap wrap-anywhere font-serif text-2xl font-semibold uppercase leading-tight sm:text-3xl">{cover ? cover.title : "Us, Lately"}</span>
            <span className="album-pocket relative block aspect-[4/5] w-[63%] max-w-72 overflow-hidden bg-[#f1efe6]">
              {cover?.photos[0] && (
                // Local drafts use data URLs.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoDisplayUrl(cover.photos[0], true)} fetchPriority="high" onLoad={() => setCoverSettled(true)} onError={() => setCoverSettled(true)} alt="" style={photoFraming(cover.photos[0])} className="size-full object-contain p-1" />
              )}
              <PocketCaption photo={cover?.photos[0]} />
            </span>
            {cover?.caption && <span className="wrap-anywhere font-serif text-sm uppercase tracking-wider">{cover.caption}</span>}
            {firstInside < pages.length && <span className="text-sm font-semibold underline underline-offset-4">Open album →</span>}
          </motion.button>
          {editing && cover && (
            <label className="relative mx-auto mt-4 flex min-h-11 w-fit cursor-pointer items-center rounded-full bg-butter-200 px-4 text-sm font-semibold focus-within:outline-2">
              {cover.photos[0] ? "Replace cover photo" : "Choose cover photo"}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" disabled={busy} className="absolute inset-0 size-full cursor-pointer opacity-0" onChange={(event) => {
                void pickPhotos(0, Array.from(event.target.files ?? []), 0);
                event.currentTarget.value = "";
              }} />
            </label>
          )}
        </div>
      ) : (
        <>
          <div className="mx-auto w-full lg:px-18">
            <div className={`relative mx-auto w-full ${isSpread ? "max-w-[min(82rem,max(46rem,123svh))]" : "max-w-2xl"}`}>
              <div className="relative w-full rounded-sm border border-dusk-700 bg-dusk-500 p-2 shadow-xl [perspective:1600px] sm:p-3">
                <div
                  className={`relative grid [perspective:1600px] ${isSpread ? "grid-cols-2" : "grid-cols-1"} ${editing ? "" : "touch-pan-y select-none cursor-grab active:cursor-grabbing"}`}
                  onPointerDown={startPageDrag}
                  onPointerMove={dragPage}
                  onPointerUp={(event) => endPageDrag(event)}
                  onPointerCancel={(event) => endPageDrag(event, true)}
                  onDragStart={(event) => { if (!editing) event.preventDefault(); }}
                >
                  {isSpread ? (
                    <>
                      {renderPaper(flip?.delta === 1 ? flip.from : (flip?.to ?? first), true)}
                      {renderPaper(flip?.delta === -1 ? flip.from + 1 : (flip?.to ?? first) + 1, false)}
                    </>
                  ) : renderPaper(flip?.to ?? first, false)}
                  <div aria-hidden="true" className={`album-binding ${isSpread ? "album-binding-center" : ""}`}>
                    {binderRings.map(([top, height]) => (
                      <svg key={top} viewBox={`0 ${top} 245 ${height}`} className="album-ring" style={{ top: `${(top + height / 2) / 13.5}%` }}>
                        <image href="/album-binder.png" width="245" height="1350" />
                      </svg>
                    ))}
                  </div>
                  {flip && (
                    <motion.div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-y-0 z-20 [transform-style:preserve-3d] ${isSpread ? "w-1/2" : "w-full"} ${isSpread && flip.delta === 1 ? "right-0 origin-left" : isSpread ? "left-0 origin-right" : flip.delta === 1 ? "left-0 origin-left" : "left-0 origin-right"}`}
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: flip.angle }}
                      transition={{ duration: flip.phase === "drag" ? 0 : flip.phase === "return" ? 0.25 : 0.48, ease: [0.4, 0, 0.2, 1] }}
                      onAnimationComplete={() => {
                        if (flip.phase === "drag") return;
                        if (flip.phase === "finish") setIndex(flip.to);
                        setFlip(null);
                      }}
                    >
                      <div className="absolute inset-0 [backface-visibility:hidden]">
                        {renderPaper(flip.from + (isSpread && flip.delta === 1 ? 1 : 0), isSpread && flip.delta === -1, false)}
                      </div>
                      {isSpread && <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        {renderPaper(flip.to + (flip.delta === -1 ? 1 : 0), flip.delta === 1, false)}
                      </div>}
                    </motion.div>
                  )}
                </div>
              </div>
              <div className="mx-auto mt-4 flex max-w-2xl items-center justify-between px-1 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:-inset-x-17 lg:mt-0 lg:max-w-none">
                <div className="pointer-events-auto">
                  <AlbumArrow direction="previous" disabled={busy || first === firstInside} onClick={() => turn(-1)} />
                </div>
                <div className="pointer-events-auto">
                  <AlbumArrow direction="next" disabled={busy || first + visiblePages.length >= pages.length} onClick={() => turn(1)} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p aria-live="polite" className="text-center font-serif text-xl text-dusk-900">{visiblePages.length > 1 ? `Pages ${first + 1}–${first + visiblePages.length}` : `Page ${first + 1}`} of {pages.length}</p>
            <div className="flex justify-center">
              <button type="button" disabled={busy} className="min-h-11 text-sm font-semibold text-dusk-900 underline underline-offset-4" onClick={() => {
                setIndex(0);
                setOpened(false);
              }}>Close album</button>
            </div>
          </div>
        </>
      )}
      {editing && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm text-dusk-900">
          <label className="flex items-center gap-2 font-semibold">Editing page
            <select value={index} disabled={busy} className="rounded-md border border-dusk-300 bg-white p-2" onChange={(event) => {
              const next = Number(event.target.value);
              setIndex(next);
              setOpened(next > 0 || !cover);
            }}>
              {pages.map((_, offset) => <option key={offset} value={offset}>{offset + 1}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 font-semibold">
            Layout
            <select value={page.layout} disabled={busy} className="rounded-md border border-dusk-300 bg-white p-2" onChange={(event) => {
              const nextLayout = event.target.value as Layout;
              if (index === 0 && nextLayout === "cover") setOpened(false);
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
            setPages((current) => [...current, { id: newPageId(), layout: "pair", photos: [] }]);
            setIndex(pages.length);
            setOpened(true);
          }}>+ Add page</button>
        </div>
      )}
      {editing && page.layout === "cover" && (
        <div className="mx-auto mt-4 grid max-w-lg gap-3 text-sm text-dusk-900 sm:grid-cols-2">
          <label className="grid gap-1">Cover title
            <textarea rows={2} maxLength={70} disabled={busy} value={page.title ?? ""} className="rounded-md border border-dusk-300 bg-white p-2" onChange={(event) => {
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
      {editing && page.photos.slice(0, layouts[page.layout].pockets).some(Boolean) && (
        <fieldset className="mx-auto mt-5 grid max-w-lg gap-3 text-sm text-dusk-900">
          <legend className="mb-2 font-semibold">Photo framing and captions · page {index + 1}</legend>
          {page.photos.slice(0, layouts[page.layout].pockets).map((photo, slot) => photo && (
            <fieldset key={slot} className="grid gap-2 rounded-lg border border-dusk-300 px-3 pb-3">
              <legend className="px-1 font-semibold">{page.layout === "cover" ? "Cover photo" : `Pocket ${slot + 1}`}</legend>
              {framingControls.map(({ key, label, min, max, step, initial }) => (
                <label key={key} className="grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-2">
                  {label}
                  <input type="range" min={min} max={max} step={step} disabled={busy} value={photo[key] ?? initial} className="min-w-0 accent-dusk-700" onChange={(event) => {
                    const value = Number(event.target.value);
                    updatePage(index, (item) => ({ ...item, photos: item.photos.map((entry, position) =>
                      position === slot && entry ? { ...entry, [key]: value } : entry) }));
                  }} />
                  <span className="text-right tabular-nums">{Math.round((photo[key] ?? initial) * (key === "zoom" ? 100 : 1))}%</span>
                </label>
              ))}
              <label className="mt-1 flex items-center gap-2">
                <input type="checkbox" checked={photo.showCaption ?? false} disabled={busy} className="accent-dusk-700" onChange={(event) => {
                  const showCaption = event.target.checked;
                  updatePage(index, (item) => ({ ...item, photos: item.photos.map((entry, position) =>
                    position === slot && entry ? { ...entry, showCaption } : entry) }));
                }} />
                Show caption
              </label>
              {photo.showCaption && <>
              <label className="grid gap-1">
                Caption text
                <textarea rows={2} maxLength={80} value={photo.caption ?? ""} disabled={busy} className="rounded-md border border-dusk-300 bg-white p-2 text-lg [font-family:var(--font-pocket-handwriting),cursive]" onChange={(event) => {
                  const caption = event.target.value;
                  updatePage(index, (item) => ({ ...item, photos: item.photos.map((entry, position) =>
                    position === slot && entry ? { ...entry, caption } : entry) }));
                }} />
              </label>
              <label className="grid grid-cols-[5.5rem_minmax(0,1fr)_3rem] items-center gap-2">
                Text size
                <input type="range" min={60} max={160} step={5} value={photo.captionSize ?? 100} disabled={busy} className="min-w-0 accent-dusk-700" onChange={(event) => {
                  const captionSize = Number(event.target.value);
                  updatePage(index, (item) => ({ ...item, photos: item.photos.map((entry, position) =>
                    position === slot && entry ? { ...entry, captionSize } : entry) }));
                }} />
                <span className="text-right tabular-nums">{photo.captionSize ?? 100}%</span>
              </label>
              <label className="flex items-center gap-2">
                Text color
                <input type="color" value={photo.captionColor ?? defaultCaptionColor} disabled={busy} className="h-8 w-11 cursor-pointer rounded border border-dusk-300 bg-white p-0.5" onChange={(event) => {
                  const captionColor = event.target.value;
                  updatePage(index, (item) => ({ ...item, photos: item.photos.map((entry, position) =>
                    position === slot && entry ? { ...entry, captionColor } : entry) }));
                }} />
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={photo.captionBackground !== false} disabled={busy} className="accent-dusk-700" onChange={(event) => {
                  const captionBackground = event.target.checked;
                  updatePage(index, (item) => ({ ...item, photos: item.photos.map((entry, position) =>
                    position === slot && entry ? { ...entry, captionBackground } : entry) }));
                }} />
                Show text background
              </label>
              </>}
            </fieldset>
          ))}
        </fieldset>
      )}
      {error && <p role="alert" className="mt-4 text-center text-sm text-red-800">{error}</p>}
    </section>
  );
}
