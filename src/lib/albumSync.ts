/*
 * Git-style syncing for the album editor (/album-admin).
 *
 * Every device keeps a "base": the last version of the online draft it saw. When the online draft has moved on
 * (another device saved), the device merges three versions: base, its own pages, and the online pages.
 * Whatever only one side changed is kept from that side. If both sides changed the very same thing
 * (same field of the same photo, say), this device's edit wins, because that's what the person in front of it
 * is looking at. Pages are matched by `id`, so moving or adding pages on one device doesn't scramble the other.
 */

export type SyncPhoto = { src: string; [field: string]: unknown };
export type SyncPage = { id?: string; layout: string; photos: (SyncPhoto | null)[]; [field: string]: unknown };

// Deep equality that ignores key order and treats missing, undefined and null as the same "empty".
export function same(a: unknown, b: unknown): boolean {
  if (a == null || b == null) return (a == null) === (b == null);
  if (typeof a !== "object" || typeof b !== "object") return a === b;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    for (let i = 0; i < Math.max(a.length, b.length); i++) if (!same(a[i], b[i])) return false;
    return true;
  }
  const left = a as Record<string, unknown>;
  const right = b as Record<string, unknown>;
  for (const key of new Set([...Object.keys(left), ...Object.keys(right)])) {
    if (!same(left[key], right[key])) return false;
  }
  return true;
}

function pick<T>(base: T, local: T, remote: T): T {
  if (same(local, base)) return remote;
  if (same(remote, base)) return local;
  return local;
}

function mergeFields<T extends Record<string, unknown>>(base: T, local: T, remote: T, skip: string[]): T {
  const merged: Record<string, unknown> = {};
  for (const key of new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)])) {
    if (skip.includes(key)) continue;
    const value = pick(base[key], local[key], remote[key]);
    if (value !== undefined) merged[key] = value;
  }
  return merged as T;
}

function mergePhoto(base: SyncPhoto | null, local: SyncPhoto | null, remote: SyncPhoto | null) {
  if (same(local, base)) return remote ?? null;
  if (same(remote, base)) return local ?? null;
  // Both devices touched the same photo (say zoom on one, caption on the other): merge field by field.
  if (base && local && remote && local.src === remote.src) return mergeFields(base, local, remote, []);
  return local ?? null;
}

function mergePage<P extends SyncPage>(base: P, local: P, remote: P): P {
  const merged = mergeFields(base, local, remote, ["photos"]) as P;
  const photos: (SyncPhoto | null)[] = [];
  const count = Math.max(local.photos.length, remote.photos.length);
  for (let slot = 0; slot < count; slot++) {
    photos.push(mergePhoto(base.photos[slot] ?? null, local.photos[slot] ?? null, remote.photos[slot] ?? null));
  }
  return { ...merged, photos };
}

function mergeOrder(base: string[], local: string[], remote: string[]) {
  const inBase = new Set(base);
  const removed = new Set(base.filter((id) => !local.includes(id) || !remote.includes(id)));
  // Take the order from the side that reordered pages (this device if both did), then slot in the other side's new pages.
  const localReordered = !same(local.filter((id) => inBase.has(id)), base.filter((id) => local.includes(id)));
  const [primary, secondary] = localReordered || same(remote, base) ? [local, remote] : [remote, local];
  const order = primary.filter((id) => !removed.has(id));
  secondary.forEach((id, position) => {
    if (order.includes(id) || inBase.has(id)) return;
    let after = position - 1;
    while (after >= 0 && !order.includes(secondary[after])) after--;
    order.splice(after < 0 ? 0 : order.indexOf(secondary[after]) + 1, 0, id);
  });
  return order;
}

export function mergeAlbum<P extends SyncPage>(base: P[], local: P[], remote: P[]): P[] {
  const byId = (pages: P[]) => new Map(pages.map((page) => [page.id as string, page]));
  const [b, l, r] = [byId(base), byId(local), byId(remote)];
  const merged = mergeOrder([...b.keys()], [...l.keys()], [...r.keys()]).map((id) => {
    const [mine, theirs, original] = [l.get(id), r.get(id), b.get(id)];
    if (mine && theirs) return original ? mergePage(original, mine, theirs) : mine;
    return (mine ?? theirs)!;
  });
  return merged.length ? merged : local;
}

export function newPageId() {
  return crypto.randomUUID();
}

// Pages saved before syncing existed have no id. Number them by position so every device names them the same way.
export function ensureIds<P extends SyncPage>(pages: P[]): P[] {
  const seen = new Set<string>();
  let changed = false;
  const result = pages.map((page, position) => {
    let id = typeof page.id === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(page.id) ? page.id : `legacy-${position}`;
    if (seen.has(id)) id = newPageId();
    seen.add(id);
    if (id === page.id) return page;
    changed = true;
    return { ...page, id };
  });
  return changed ? result : pages;
}
