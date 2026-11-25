"use client";

import { useCallback, useEffect, useState } from "react";
import { photoSrc, useUrlKey } from "@/lib/urlKey";

type P = { id: string; name: string; ts: number; hidden: boolean };
type Links = { shareUrl: string; liveUrl: string };

const timeFmt = new Intl.DateTimeFormat("en-PH", { timeZone: "Asia/Manila", hour: "numeric", minute: "2-digit" });

/** For PJ and Jedah: every uploaded photo, with a one-tap hide from the slideshow. /photo-admin?k=<admin key> */
export function PhotoAdmin() {
  const k = useUrlKey();
  const [list, setList] = useState<P[] | null>(null);
  const [links, setLinks] = useState<Links | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!k) return;
    const res = await fetch(`/api/photos/list?k=${encodeURIComponent(k)}`, { cache: "no-store" }).catch(() => null);
    if (!res) return setError("Can't reach the site. Retrying...");
    const data = await res.json().catch(() => ({}));
    if (res.status === 403 || (res.ok && !data.admin)) return setError("This admin link isn't valid.");
    if (!res.ok) return setError("Couldn't load photos. Retrying...");
    setError("");
    setList((data.photos as P[]).slice().reverse());
  }, [k]);

  useEffect(() => {
    if (!k) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    fetch(`/api/photos/info?k=${encodeURIComponent(k)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setLinks(d))
      .catch(() => {});
    const t = setInterval(load, 15_000);
    return () => clearInterval(t);
  }, [k, load]);

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

  return (
    <main className="min-h-svh bg-cream px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-4xl text-dusk-950">Guest photos</h1>
        <p className="mt-1 text-dusk-700">
          {list ? `${list.length} uploaded${hiddenCount ? `, ${hiddenCount} hidden from the slideshow` : ""}.` : "Loading..."} Updates
          every 15 seconds. Hiding only takes a photo off the big screen. The file is kept.
        </p>
        {links && (
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <a className="rounded-full bg-dusk-700 px-4 py-2 font-semibold text-cream" href={links.liveUrl} target="_blank">
              Open slideshow
            </a>
            <a
              className="rounded-full border border-dusk-300 px-4 py-2 font-semibold text-dusk-900"
              href={`/photo-cards?k=${encodeURIComponent(k)}`}
              target="_blank"
            >
              Print table cards
            </a>
            <a className="rounded-full border border-dusk-300 px-4 py-2 font-semibold text-dusk-900" href={links.shareUrl} target="_blank">
              Guest upload page
            </a>
          </div>
        )}
        {error && <p className="mt-4 text-red-700">{error}</p>}

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
