"use client";

import { useSyncExternalStore } from "react";

const noSubscribe = () => () => {};
const readKey = () => new URLSearchParams(window.location.search).get("k") ?? "";

/** The ?k= access key from the page URL ("" during server render). */
export function useUrlKey() {
  return useSyncExternalStore(noSubscribe, readKey, () => "");
}

/** Image URL for a photo id. Stable, so the browser can cache it. */
export function photoSrc(id: string, k: string) {
  return `/api/photos/img?id=${encodeURIComponent(id)}&k=${encodeURIComponent(k)}`;
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
