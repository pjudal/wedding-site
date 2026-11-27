import type { Guest } from "./store";

export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents (e.g. Pena / Peña)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

export type MatchResult =
  | { status: "found"; guest: Guest }
  | { status: "ambiguous" }
  | { status: "none" };

/**
 * Finds exactly one guest for a typed name, or nothing.
 * Order: exact full name, exact sheet nickname, then first + last,
 * then a small typo allowance for names.
 */
export function findGuest(guests: Guest[], query: string): MatchResult {
  const q = normalize(query);
  if (!q) return { status: "none" };

  const pick = (list: Guest[]): MatchResult | null =>
    list.length === 1 ? { status: "found", guest: list[0] } : list.length > 1 ? { status: "ambiguous" } : null;

  const exact = pick(guests.filter((g) => normalize(g.name) === q));
  if (exact) return exact;

  const nickname = pick(guests.filter((g) => normalize(g.nickname ?? "") === q));
  if (nickname) return nickname;

  if (q.length < 2) return { status: "none" };

  const qt = q.split(" ");
  const byWords = pick(
    guests.filter((g) => {
      const nt = normalize(g.name).split(" ");
      if (qt.length < 2 && nt.length > 1) return false;
      return qt.every((t) => nt.includes(t));
    }),
  );
  if (byWords) return byWords;

  const allowed = Math.min(2, Math.floor(q.length / 6));
  if (allowed === 0) return { status: "none" };
  const scored = guests
    .map((g) => ({ g, d: levenshtein(normalize(g.name), q) }))
    .filter((x) => x.d <= allowed)
    .sort((a, b) => a.d - b.d);
  if (scored.length === 0) return { status: "none" };
  if (scored.length > 1 && scored[1].d === scored[0].d) return { status: "ambiguous" };
  return { status: "found", guest: scored[0].g };
}
