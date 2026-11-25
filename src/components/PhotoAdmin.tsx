"use client";

import { useCallback, useEffect, useState } from "react";
import { site } from "@/content";
import { forgetAdminKey, keyQuery, photoSrc, saveAdminKey, useAdminKey } from "@/lib/urlKey";

type P = { id: string; name: string; ts: number; hidden: boolean };
type Links = { shareUrl: string; liveUrl: string };

const timeFmt = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });

/**
 * For PJ and Jedah: every uploaded photo, with a one-tap hide from the slideshow.
 * Open /photo-admin. If PHOTO_ADMIN_KEY is set, it asks for it once and this device remembers it.
 */
export function PhotoAdmin() {
  const k = useAdminKey();
  if (k === null) return <main className="min-h-svh bg-cream" />;
  return <Dashboard key={k} k={k} />;
}

function SignIn({ error = "" }: { error?: string }) {
  const [value, setValue] = useState("");
  return (
    <main className="flex min-h-svh items-center justify-center bg-cream px-4">
      <form
        className="w-full max-w-sm text-center"
        onSubmit={(e) => {
          e.preventDefault();
          if (!value.trim()) return;
          saveAdminKey(value.trim());
        }}
      >
        <p className="font-serif text-4xl text-dusk-950">
          {site.coupleA} <span className="italic text-butter-500">&amp;</span> {site.coupleB}
        </p>
        <h1 className="mt-2 text-dusk-700">Guest photos admin</h1>
        <input
          type="password"
          autoComplete="current-password"
          aria-label="Admin password"
          placeholder="Admin password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-6 w-full rounded-2xl border border-dusk-100 bg-white px-4 py-3 text-base text-dusk-950 outline-none placeholder:text-dusk-300 focus:border-dusk-500 focus:ring-4 focus:ring-dusk-100"
        />
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
        <button type="submit" className="mt-4 w-full rounded-full bg-dusk-700 px-6 py-3 font-semibold text-cream hover:bg-dusk-900">
          Open
        </button>
        <p className="mt-3 text-xs text-dusk-500">This device will remember it.</p>
      </form>
    </main>
  );
}

function Dashboard({ k }: { k: string }) {
  const [list, setList] = useState<P[] | null>(null);
  const [links, setLinks] = useState<Links | null>(null);
  const [error, setError] = useState("");
  const [denied, setDenied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/photos/list?admin=1${k ? `&k=${encodeURIComponent(k)}` : ""}`, { cache: "no-store" }).catch(() => null);
    if (!res) return setError("Can't reach the site. Retrying...");
    const data = await res.json().catch(() => ({}));
    if (res.status === 403 || (res.ok && !data.admin)) {
      forgetAdminKey();
      setDenied(true);
      return;
    }
    if (!res.ok) return setError("Couldn't load photos. Retrying...");
    setError("");
    setList((data.photos as P[]).slice().reverse());
  }, [k]);

  // Remember a working password on this device (also tidies ?k= out of the address bar).
  useEffect(() => {
    if (list && k) saveAdminKey(k);
  }, [list, k]);

  useEffect(() => {
    const first = setTimeout(load, 0);
    fetch(`/api/photos/info${keyQuery(k)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setLinks(d))
      .catch(() => {});
    const t = setInterval(load, 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [k, load]);

  // Wrong (or missing) password: ask for it. A blank key means "no password tried yet", so no error then.
  if (denied) return <SignIn error={k ? "That password isn't right." : ""} />;

  async function toggle(p: P) {
    setBusy(p.id);
    const res = await fetch("/api/photos/hide", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ k, id: p.id, hidden: !p.hidden }),
    }).catch(() => null);
    setBusy(null);
    if (res?.ok) setList((l) => l?.map((x) => (x.id === p.id ? { ...x, hidden: !p.hidden } : x)) ?? null);
    else setError("Couldn't change that photo. Try again.");
  }

  const hiddenCount = list?.filter((p) => p.hidden).length ?? 0;
  const btn = "rounded-full border border-dusk-300 px-4 py-2 font-semibold text-dusk-900 hover:bg-dusk-50";

  return (
    <main className="min-h-svh bg-cream px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="font-serif text-4xl text-dusk-950">Guest photos</h1>
          {k && <button type="button" onClick={() => saveAdminKey("")} className="text-sm text-dusk-500 underline-offset-4 hover:underline">
            Sign out on this device
          </button>}
        </div>
        <p className="mt-1 text-dusk-700">
          {list
            ? `${list.length} uploaded${hiddenCount ? `, ${hiddenCount} hidden from the slideshow` : ""}. Updates every 15 seconds.`
            : "Loading photos..."}{" "}
          Hiding only takes a photo off the big screen. The file is kept.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <a
            className={`rounded-full bg-dusk-700 px-4 py-2 font-semibold text-cream hover:bg-dusk-900 ${links ? "" : "pointer-events-none opacity-50"}`}
            href={links?.liveUrl}
            target="_blank"
          >
            Open slideshow
          </a>
          <a className={btn} href="/photo-cards" target="_blank">
            Print table cards
          </a>
          <a className={`${btn} ${links ? "" : "pointer-events-none opacity-50"}`} href={links?.shareUrl} target="_blank">
            Guest upload page
          </a>
        </div>
        {error && <p className="mt-4 text-red-700">{error}</p>}

        {list && list.length === 0 && (
          <p className="mt-10 rounded-2xl border border-dashed border-dusk-300 p-10 text-center text-dusk-500">
            No photos yet. They&apos;ll show up here as guests share them.
          </p>
        )}

        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list?.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
              <a href={photoSrc(p.id, k)} target="_blank" className="block aspect-square bg-dusk-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoSrc(p.id, k)}
                  alt=""
                  loading="lazy"
                  className={`h-full w-full object-cover ${p.hidden ? "opacity-30 grayscale" : ""}`}
                />
              </a>
              <div className="flex items-center justify-between gap-2 p-2 text-sm">
                <span className="min-w-0 truncate text-dusk-700">
                  {timeFmt.format(p.ts)}
                  {p.name ? ` · ${p.name}` : ""}
                </span>
                <button
                  type="button"
                  disabled={busy === p.id}
                  onClick={() => toggle(p)}
                  className={`shrink-0 rounded-full px-3 py-1 font-semibold ${
                    p.hidden ? "bg-butter-200 text-dusk-950" : "bg-dusk-100 text-dusk-900"
                  }`}
                >
                  {p.hidden ? "Show" : "Hide"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
