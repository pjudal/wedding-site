"use client";

import { useEffect, useState } from "react";
import { photos as copy, site } from "@/content";
import { useAdminKey } from "@/lib/urlKey";
import { QrCode } from "./QrCode";

/*
 * Printable QR table cards: /photo-cards (uses the admin password remembered by /photo-admin), then Ctrl+P.
 * Four A6 cards per A4 sheet (cut along the dashed lines). Print at 100% scale, "Background graphics" on.
 */
export function PrintCards() {
  const k = useAdminKey();
  const [shareUrl, setShareUrl] = useState("");
  const [fetchError, setError] = useState("");
  const [count, setCount] = useState(8);
  const error = k === "" ? "Sign in on the photo admin page first (/photo-admin), then come back here." : fetchError;

  useEffect(() => {
    if (!k) return;
    fetch(`/api/photos/info?k=${encodeURIComponent(k)}`)
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(r.status === 403 ? "This admin link isn't valid." : (d.error ?? "Couldn't load."));
        setShareUrl(d.shareUrl);
      })
      .catch((e) => setError(e.message));
  }, [k]);

  const sheets = Math.ceil(count / 4);

  return (
    <>
      <style>{`@page { size: A4; margin: 0; } @media print { html, body { background: white !important; } }`}</style>
      <div className="mx-auto max-w-3xl px-4 py-6 print:hidden">
        <h1 className="font-serif text-3xl text-dusk-950">QR table cards</h1>
        {error ? (
          <p className="mt-2 text-red-700">{error}</p>
        ) : (
          <>
            <p className="mt-2 text-dusk-700">
              Four cards per A4 sheet. Print at 100% scale (not &quot;fit to page&quot;) with background graphics on, then cut along the
              dashed lines. Test-scan one with your phone before printing the rest.
            </p>
            <p className="mt-2 break-all text-sm text-dusk-500">QR opens: {shareUrl || "..."}</p>
            <div className="mt-4 flex items-center gap-3">
              <label className="text-sm font-semibold text-dusk-900" htmlFor="card-count">
                Cards
              </label>
              <input
                id="card-count"
                type="number"
                min={1}
                max={80}
                value={count}
                onChange={(e) => setCount(Math.min(80, Math.max(1, Number(e.target.value) || 1)))}
                className="w-20 rounded-xl border border-dusk-100 bg-white px-3 py-2"
              />
              <button
                type="button"
                onClick={() => window.print()}
                disabled={!shareUrl}
                className="rounded-full bg-dusk-700 px-5 py-2 font-semibold text-cream disabled:opacity-50"
              >
                Print
              </button>
            </div>
          </>
        )}
      </div>

      {shareUrl &&
        Array.from({ length: sheets }, (_, s) => (
          <div
            key={s}
            className="mx-auto mb-6 grid h-[297mm] w-[210mm] grid-cols-2 grid-rows-2 bg-white shadow-lg print:mb-0 print:shadow-none [break-after:page] last:[break-after:auto]"
          >
            {Array.from({ length: Math.min(4, count - s * 4) }, (_, i) => (
              <Card key={i} url={shareUrl} />
            ))}
          </div>
        ))}
    </>
  );
}

function Card({ url }: { url: string }) {
  return (
    <div className="flex flex-col items-center justify-center border border-dashed border-dusk-300 px-[10mm] text-center text-dusk-950 [print-color-adjust:exact]">
      <p className="text-[8pt] font-semibold uppercase tracking-[0.3em] text-dusk-500">{site.shortDate}</p>
      <p className="mt-[1mm] font-serif text-[22pt] leading-tight">
        {site.coupleA} <span className="italic text-butter-500">&amp;</span> {site.coupleB}
      </p>
      <p className="mt-[5mm] font-serif text-[26pt] italic leading-none text-dusk-700">{copy.cardTitle}</p>
      <div className="mt-[5mm] rounded-[4mm] bg-butter-50 p-[4mm]">
        <QrCode value={url} className="h-[52mm] w-[52mm]" />
      </div>
      <p className="mt-[5mm] max-w-[75mm] text-[10pt] leading-snug text-dusk-900">{copy.cardBody}</p>
      <p className="mt-[2mm] text-[8pt] text-dusk-500">{copy.cardFooter}</p>
    </div>
  );
}
