"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};
const readKey = () => new URLSearchParams(window.location.search).get("k") ?? "";

/** The ?k= access key from the page URL: null during server render, "" if the link has none. */
export function useUrlKey(): string | null {
  return useSyncExternalStore(noSubscribe, readKey, () => null);
}

/**
 * Image URL for a photo id. Stable, so the browser can cache it.
 * thumb: small preview. download: save instead of show. admin: photo admin (can see hidden photos).
 */
export function photoSrc(id: string, k: string | null, opts: { thumb?: boolean; download?: boolean; admin?: boolean } = {}) {
  let url = `/api/photos/img?id=${encodeURIComponent(id)}`;
  if (k) url += `&k=${encodeURIComponent(k)}`;
  if (opts.thumb) url += "&size=thumb";
  if (opts.download) url += "&download=1";
  if (opts.admin) url += "&admin=1";
  return url;
}

/** "?k=..." to add to a link, or "" when there is no key. */
export function keyQuery(k: string | null) {
  return k ? `?k=${encodeURIComponent(k)}` : "";
}

// ---- admin key: from ?k= or remembered on this device ----

const ADMIN_STORE = "photo-admin-key";
const listeners = new Set<() => void>();
const subscribeAdmin = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

function readAdminKey() {
  const fromUrl = readKey();
  if (fromUrl) return fromUrl;
  try {
    return localStorage.getItem(ADMIN_STORE) ?? "";
  } catch {
    return "";
  }
}

/** Admin key: null while loading, "" if none yet (show the password box). */
export function useAdminKey(): string | null {
  return useSyncExternalStore(subscribeAdmin, readAdminKey, () => null);
}

/** Drop a rejected admin key quietly (no re-render), so a reload asks again. */
export function forgetAdminKey() {
  try {
    localStorage.removeItem(ADMIN_STORE);
  } catch {}
  if (new URLSearchParams(window.location.search).has("k")) {
    window.history.replaceState(null, "", window.location.pathname);
  }
}

/** Remember (or forget, with "") the admin key on this device, and take it out of the address bar. */
export function saveAdminKey(k: string) {
  try {
    if (k) localStorage.setItem(ADMIN_STORE, k);
    else localStorage.removeItem(ADMIN_STORE);
  } catch {}
  if (new URLSearchParams(window.location.search).has("k")) {
    window.history.replaceState(null, "", window.location.pathname);
  }
  listeners.forEach((f) => f());
}
