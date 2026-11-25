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
