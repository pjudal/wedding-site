"use client";

import { useEffect, useRef, useState } from "react";
import { photos, site } from "@/content";
import { useUrlKey } from "@/lib/urlKey";

type Status = "waiting" | "preparing" | "uploading" | "done" | "error";
type Item = { id: number; file: File; preview: string; status: Status; progress: number; error: string };

const MAX_EDGE = 2560; // long edge after resizing: plenty for a projector, much faster to upload
const CONCURRENCY = 2;
const NAME_STORE = "photo-share-name";

const inputCls =
  "w-full rounded-2xl border border-dusk-100 bg-white px-4 py-3 text-base text-dusk-950 outline-none transition placeholder:text-dusk-300 focus:border-dusk-500 focus:ring-4 focus:ring-dusk-100";

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Some browsers (older iOS) only decode certain formats through <img>.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.src = url;
      await img.decode();
      return img;
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

/** Resize to MAX_EDGE and re-encode as JPEG. Re-encoding also drops EXIF data such as GPS location. */
async function prepare(file: File): Promise<Blob> {
  try {
    const src = await decode(file);
    const w0 = "naturalWidth" in src ? src.naturalWidth : src.width;
    const h0 = "naturalHeight" in src ? src.naturalHeight : src.height;
    const scale = Math.min(1, MAX_EDGE / Math.max(w0, h0));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(w0 * scale));
    canvas.height = Math.max(1, Math.round(h0 * scale));
    canvas.getContext("2d")!.drawImage(src, 0, 0, canvas.width, canvas.height);
    if ("close" in src) src.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.85));
    if (blob && blob.size > 0) return blob;
  } catch {}
  if (["image/jpeg", "image/png", "image/webp"].includes(file.type)) return file;
  throw new Error("This photo format isn't supported. Try sharing it as a JPEG.");
}

function put(url: string, blob: Blob, onProgress: (p: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", blob.type);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
    xhr.onerror = () => reject(new Error("Connection lost"));
    xhr.ontimeout = () => reject(new Error("Connection timed out"));
    xhr.timeout = 5 * 60 * 1000;
    xhr.send(blob);
  });
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function ShareUploader() {
  const k = useUrlKey();
  const [name, setName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const running = useRef(0);
  const nameRef = useRef("");

  // Remember the guest's name on this phone so they only type it once.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_STORE) ?? "";
      nameRef.current = saved;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setName(saved);
    } catch {}
  }, []);

  function changeName(v: string) {
    setName(v);
    nameRef.current = v;
    try {
      localStorage.setItem(NAME_STORE, v);
    } catch {}
  }

  const update = (id: number, patch: Partial<Item>) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  async function upload(item: Item) {
    let blob: Blob;
    try {
      blob = await prepare(item.file);
    } catch (err) {
      update(item.id, { status: "error", error: (err as Error).message });
      return;
    }
    for (let attempt = 1; ; attempt++) {
      try {
        update(item.id, { status: "uploading", progress: 0 });
        const res = await fetch("/api/photos/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ k: k ?? "", name: nameRef.current, type: blob.type, size: blob.size }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          // A bad link or a rejected file won't get better by retrying.
          if (res.status === 400 || res.status === 403) {
            update(item.id, { status: "error", error: data.error ?? "Upload refused." });
            return;
          }
          throw new Error(data.error ?? "Upload failed");
        }
        await put(data.uploadUrl, blob, (p) => update(item.id, { progress: p }));
        update(item.id, { status: "done", progress: 1 });
        return;
      } catch (err) {
        if (attempt >= 4) {
          update(item.id, { status: "error", error: `${(err as Error).message}.` });
          return;
        }
        await wait(1500 * attempt * attempt);
      }
    }
  }

  // Simple queue: at most CONCURRENCY uploads at once.
  useEffect(() => {
    const free = CONCURRENCY - running.current;
    if (free <= 0) return;
    const ready = items.filter((it) => it.status === "waiting").slice(0, free);
    if (!ready.length) return;
    running.current += ready.length;
    const ids = new Set(ready.map((it) => it.id));
    setItems((list) => list.map((it) => (ids.has(it.id) ? { ...it, status: "preparing" as const } : it)));
    for (const it of ready) {
      upload(it).finally(() => {
        running.current--;
        setItems((l) => [...l]); // nudge the queue
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const added = files.map<Item>((file) => ({
      id: nextId.current++,
      file,
      preview: URL.createObjectURL(file),
      status: "waiting",
      progress: 0,
      error: "",
    }));
    setItems((list) => [...added.reverse(), ...list]);
  }

  const retry = (it: Item) => it.status === "error" && update(it.id, { status: "waiting", error: "" });

  const done = items.filter((i) => i.status === "done").length;
  const busy = items.some((i) => i.status === "waiting" || i.status === "preparing" || i.status === "uploading");
  const firstError = items.find((i) => i.status === "error")?.error;

  return (
    <main className="min-h-svh bg-cream px-4 pb-16 pt-10">
      <div className="mx-auto max-w-md">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-dusk-500">{site.shortDate}</p>
        <h1 className="mt-2 text-center font-serif text-5xl text-dusk-950">
          {site.coupleA} <span className="italic text-butter-500">&amp;</span> {site.coupleB}
        </h1>
        <h2 className="mt-6 text-center font-serif text-3xl text-dusk-700">{photos.shareTitle}</h2>
        <p className="mt-2 text-center text-dusk-700">{photos.shareIntro}</p>

        <label className="mt-8 block text-sm font-semibold text-dusk-900" htmlFor="share-name">
          {photos.namePrompt}
        </label>
        <input
          id="share-name"
          className={`${inputCls} mt-2`}
          value={name}
          maxLength={40}
          autoComplete="name"
          placeholder={photos.namePlaceholder}
          onChange={(e) => changeName(e.target.value)}
        />

        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={onPick} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 w-full rounded-full bg-dusk-700 px-6 py-4 text-lg font-semibold text-cream shadow-lg shadow-dusk-700/20 transition hover:bg-dusk-900 active:scale-[0.98]"
        >
          {items.length ? photos.pickMore : photos.pickButton}
        </button>

        {items.length > 0 && (
          <p className="mt-4 text-center text-sm text-dusk-700" aria-live="polite">
            {busy ? `Sending ${done} of ${items.length}... keep this page open.` : done ? photos.thanks : ""}
          </p>
        )}

        <ul className="mt-4 grid grid-cols-3 gap-2">
          {items.map((it) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => retry(it)}
                disabled={it.status !== "error"}
                className="relative block aspect-square w-full overflow-hidden rounded-xl bg-dusk-100"
                aria-label={it.status === "error" ? "Retry this photo" : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.preview} alt="" className="h-full w-full object-cover" />
                {it.status !== "done" && (
                  <span className="absolute inset-0 flex items-end bg-dusk-950/40 p-1.5">
                    {it.status === "error" ? (
                      <span className="w-full rounded-md bg-white/90 px-1 py-0.5 text-xs font-semibold text-red-700">Retry</span>
                    ) : (
                      <span className="h-1.5 w-full overflow-hidden rounded-full bg-white/40">
                        <span
                          className="block h-full rounded-full bg-butter-400 transition-[width]"
                          style={{ width: `${Math.round((it.status === "uploading" ? Math.max(it.progress, 0.05) : 0.05) * 100)}%` }}
                        />
                      </span>
                    )}
                  </span>
                )}
                {it.status === "done" && (
                  <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-butter-400 text-sm font-bold text-dusk-950">
                    ✓
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        {firstError && (
          <p className="mt-3 text-center text-sm text-red-700">
            {firstError} Tap a photo marked Retry to send it again.
          </p>
        )}
      </div>
    </main>
  );
}
