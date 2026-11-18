# Handoff: PJ & Jedah wedding site

For the AI coding agent helping **Jedah** edit this site. Read all of this before changing anything.
Written 2026-11-19 by PJ's agent. If something here conflicts with what Jedah asks, ask her before acting.

## 1. What this is

- A one-page wedding website with an RSVP form, for PJ and Jedah's wedding.
- **Live site:** https://pj-jedah-wedding.vercel.app
- **Repo:** https://github.com/pjudal/wedding-site (**public**). PJ owns it; Jedah is a collaborator.
- **Launch plan:** guests get the link in **December 2026**. Until then the site is live but unannounced.

### Confirmed facts (do not change without Jedah saying so)

| Fact | Value |
| --- | --- |
| Wedding date | Sunday, March 21, 2027 (one day) |
| Venue | Bulod, La Union |
| Accommodation | The couple pays for guests' rooms on the wedding day |
| Night before | Optional, Saturday March 20, Php 2,000 |
| Plus ones | **None.** Only guests named on the invite |
| RSVP deadline | January 15, 2027 (tentative) |
| RSVP style | Guests look up their own name (no invite codes) |
| Colors | Dusty blue + pastel yellow |
| Guest count | About 30, list still changing |

### Not decided yet (shown as "TBA" or marked `TODO` in `src/content.ts`)

The order and form of the couple's names, schedule times, dress code, whether the Php 2,000 is per person or per room and how guests pay it, and the venue's exact Google Maps link.
**Never invent these.** Leave "TBA" until Jedah gives you the real value.

## 2. How it fits together

```
Guest's browser
   |  (page)                         (RSVP lookup / submit)
   v                                        v
Vercel (PJ's free Hobby account)  ->  /api/rsvp/*  ->  Google Apps Script web app  ->  Google Sheet "Guests" tab
   ^                                  (server side,      (checks a shared secret)        + "Log" tab (history)
   |  auto-deploys every push          holds secret)
GitHub main branch
```

- **Stack:** Next.js 16.4 (App Router), React 19.3, Tailwind CSS 4, `motion` (animations), TypeScript.
- **Next.js 16 is newer than most training data.** `AGENTS.md` explains this. Check `node_modules/next/dist/docs/` before using an API you're unsure of. Example: `next/image` uses `preload`, not the deprecated `priority`.
- **The guest list is not in the repo.** It lives only in the Google Sheet. The site reads it server side and only ever returns the one guest's own party to the browser.

### File map

| File | What it does |
| --- | --- |
| `src/content.ts` | **All guest-facing text and facts**: names, date, venue, deadline, price, schedule, dress code, palette, FAQ. Most edits happen here. |
| `src/app/page.tsx` | Section order and the wave dividers between sections |
| `src/app/layout.tsx` | Fonts (Cormorant Garamond + Manrope), page title, `noindex` (keeps the site out of Google) |
| `src/app/globals.css` | Color tokens (`dusk-*` = blues, `butter-*` = yellows, `cream`), text highlight color |
| `src/components/Hero.tsx` | Full-screen photo, names, date, countdown |
| `src/components/Details.tsx` | "The Day" cards: when, where, schedule, dress code + color swatches |
| `src/components/Stay.tsx` | Accommodation cards |
| `src/components/Rsvp.tsx` | RSVP form (name search, then per-person answers, then thank-you) |
| `src/components/Faq.tsx` | Expandable questions |
| `src/components/Nav.tsx` | Sticky top menu (links point to section ids) |
| `src/components/Reveal.tsx`, `SectionHeading.tsx`, `Wave.tsx`, `Countdown.tsx` | Small shared pieces |
| `src/app/api/rsvp/lookup/route.ts` | Finds a guest by name and returns only their party |
| `src/app/api/rsvp/submit/route.ts` | Validates and saves answers, refuses after the deadline |
| `src/lib/match.ts` | Name matching rules |
| `src/lib/store.ts` | Reads and writes RSVPs: Google Sheet in production, local JSON file in dev |
| `src/app/calendar.ics/route.ts` | "Add to calendar" file (all-day event) |
| `src/assets/hero.jpg` | Hero background photo |
| `google/Code.gs` | Copy of the Apps Script inside the Google Sheet (the Sheet holds the real one) |
| `scripts/seed-local.mjs` | Builds local test data (`npm run seed`) |

## 3. Safety rules (non-negotiable)

1. **The repo is public.** Never commit guest names, emails, RSVP answers, the Apps Script URL, or the secret.
   `data/` and `.env*` are git-ignored on purpose. Don't weaken `.gitignore`. Before every commit, run `git status` and read the list.
2. **Don't make the repo private.** On Vercel's free plan, collaborators' commits to a private repo don't deploy, so Jedah's edits would stop going live.
3. **Every push to `main` goes live in about a minute.** If the build fails, Vercel keeps the previous version up. A build that passes but says something wrong does go live; **only PJ can roll back** (Vercel > Deployments > Instant Rollback).
4. **Keep the Google Sheet structure as it is.** The tab must be named `Guests`, and these headers must exist with these exact names:
   `ID | Name | Party | Side | Role | Relationship | Attending | Night Before | Dietary | Message | Updated At`.
   The script finds columns by header name, so column order doesn't matter. Never edit or reuse an `ID`.
5. **Don't loosen the privacy of the RSVP lookup.** Don't add autocomplete, guest-list endpoints, or "did you mean" suggestions that reveal other guests' names. A surname alone matching nobody is intentional.
6. **Keep `robots: noindex`** in `layout.tsx`. It's a private event.
7. **No trackers or analytics** that collect guest data unless Jedah and PJ both agree.
8. **No force-pushes to `main`**, and never rewrite published history.
9. **Facts:** never make up dates, times, prices, addresses or policies. Ask Jedah.

## 4. Workflow

### Setup (once)

```bash
git clone https://github.com/pjudal/wedding-site.git
cd wedding-site
npm install
npm run seed        # no guest list locally -> uses data/guest-list.example.csv (Juan Dela Cruz, etc.)
npm run dev         # http://localhost:3000
```

Locally, RSVPs go to `data/guests.local.json` (git-ignored). Test with the example names, for example "Juan Dela Cruz", who shares a party with Maria.
`npm run seed -- --reset` clears local test answers.

**Testing against the real Sheet locally** (rarely needed): create `.env.local` from `.env.example`.
Jedah is an editor of the Sheet, so she can find both values herself in Extensions > Apps Script:
the URL is under Deploy > Manage deployments (ends in `/exec`), and the secret is under Project Settings > Script properties > `SECRET`.
Any test RSVP you send this way lands in the real Sheet, so clear the test row afterwards and tell Jedah.

### Before every push

```bash
npm run lint && npx tsc --noEmit && npm run build
```

Then look at the change in `npm run dev`, at both desktop width and a phone width (about 390px).
Vercel preview links for branches may need PJ's Vercel login, so **local testing is the review step**.
Small text edits can go straight to `main`. For bigger changes, work on a branch, test locally, then merge.

### Git

- Commit as Jedah, with her own name and email. To keep her email out of the public history, use her GitHub no-reply address and turn on "Keep my email addresses private" in GitHub settings.
- Write clear, plain commit messages.

## 5. Common tasks

### Change wording, schedule, dress code, FAQ, deadline or price
Edit `src/content.ts` only.
- `schedule`: replace `"TBA"` with a time, like `"3:00 PM"`. Add or remove `{ label, time }` items.
- `dressCode`: set a string to replace "Details coming soon".
- `faqs`: add or edit `{ q, a }` entries.
- **Deadline:** change **both** `rsvpDeadline` (ISO, keep `+08:00` for Philippine time; both the form and the server check it) and `rsvpDeadlineLabel` (the text shown).
- **Exact venue:** paste the Google Maps share link into `mapsUrl`.
- Once there's a ceremony time, consider updating `src/app/calendar.ics/route.ts` from an all-day event to a timed one (`DTSTART;TZID=Asia/Manila:20270321T150000`, for example).

### Manage guests (no code, no deploy)
In the Google Sheet `Guests` tab:
- **Add:** type the name in a new row. The `ID` fills in automatically the first time anyone searches the site.
- **People who RSVP together:** give them the same `Party` value (`P01`, `P02`, ...). Blank means they RSVP alone.
- **Remove:** delete the row. Their past answers stay in the `Log` tab.
- Changes take effect on the site immediately.

### Replace the hero photo
Swap `src/assets/hero.jpg`, keeping the same filename. Use landscape, about 3000px wide, under about 1.5 MB.
If the couple sits off-center, adjust `object-[56%_70%]` in `Hero.tsx` (that's horizontal % and vertical %).
The text sits over the top of the photo, so photos with a light, plain top area (like sky) work best.

### Add a new section (photo gallery, "Our story", travel tips, entourage, ...)
1. Create `src/components/MySection.tsx`. Copy the structure of `Stay.tsx` or `Faq.tsx`: `<section id="...">`, then `SectionHeading`, then content wrapped in `Reveal`.
2. Add it to `src/app/page.tsx` in the order you want.
3. Add a nav link in `Nav.tsx` (the `links` array) if guests should be able to jump to it.
4. Put the text in `src/content.ts`, not in the component.
5. Gallery images go in `src/assets/`. Use `next/image` with a static import so you get automatic resizing and blur placeholders.

### Change colors or fonts
Colors are tokens in `globals.css` (`@theme`). Change a value there and it updates everywhere.
Fonts are set in `layout.tsx` through `next/font/google`.
Keep text readable: dark text (`dusk-900`/`dusk-950`) on light backgrounds, `cream` on the blue section.

### Add a question to the RSVP form (needs care: four places, in this order)
Example: a "song request" field.
1. **Sheet:** add the column header, for example `Song`.
2. **Apps Script** (in the Sheet): add `song: 'Song'` to `FIELD_TO_HEADER`, add a `setValue` line for it in `save_`, then **Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy**. The URL stays the same.
   If you skip the new version, the live site keeps running the old script.
   Mirror the change in `google/Code.gs` so the repo copy stays in sync.
3. **Site:** add the field to the `Guest` and `ResponseUpdate` types in `src/lib/store.ts` (and `clean()`), validate and trim it in `src/app/api/rsvp/submit/route.ts` (cap the length), return it from `lookup/route.ts`, and add the input in `Rsvp.tsx`.
4. Test locally (`npm run seed -- --reset`, then submit), then push.

Why this order: the script refuses to run if a header listed in `FIELD_TO_HEADER` is missing from the Sheet, and that would break every RSVP until it's fixed.

## 6. How the RSVP matching works (`src/lib/match.ts`)

The site checks a typed name against the guest list in this order, and only returns a result if exactly one guest matches:
1. Exact full name. Case, accents and punctuation are ignored.
2. All typed words appear in the name ("Maria Santos" finds "Maria Clara Reyes Santos"). A single word only matches someone whose whole name is one word.
3. Small typo allowance, measured on what the guest typed: 1 letter off for 6 to 11 characters, 2 letters for 12 or more, and none for shorter input.

If two guests could match, the guest is asked to type their full name. When a match is found, the browser gets that guest's party only: ids, names and their previous answers, so they can edit until the deadline.

## 7. People

- **PJ:** owns the GitHub repo, the Vercel account (domain, environment variables, rollback, preview access), and the Google Sheet.
- **Jedah:** collaborator on GitHub and editor on the Sheet. She decides wording and content.

## 8. Known open items (as of 2026-11-19)

- [ ] The `TODO`s in `src/content.ts` (see section 1)
- [ ] Final guest list and `Party` groupings in the Sheet
- [ ] The Sheet's `Log` tab has test rows from setup that can be deleted
- [ ] Before launch: a full RSVP test on a phone against the live site, then clear the test answers in the Sheet
- [ ] Optional: custom domain (PJ, through Vercel)
