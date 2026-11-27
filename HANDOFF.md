# Handoff: PJ & Jedah wedding site

> **Jedah, start here.** Open **Claude Code** (the desktop app, the VS Code extension, or the terminal; regular claude.ai chat
> can't install or run things), give it this file, and say: **"Set this up for me."** It handles everything else and tells you
> when it's ready. After that, just ask for what you want changed, like "change the dress code to Filipiniana" or "add a photo
> gallery". Every time it changes something, it checks with you before it goes live.

For the AI coding agent helping **Jedah** edit this site. Read all of this before changing anything.
Written 2026-11-19 by PJ's agent. If something here conflicts with what Jedah asks, ask her before acting.

## 0. Agent: first-run setup (do this yourself, end to end)

Jedah is not a developer. Do every step yourself, explain briefly in plain language what you're doing, and only stop for the
things that need her: approving installs, signing in, or choosing a name or folder. Skip any step that's already done.
Work out her operating system first and use the matching commands.

1. **Prerequisites.** Check `git --version`, `node --version` (needs **20 or newer**; 22 LTS is fine) and `npm --version`.
   Install whatever is missing, with her approval:
   - Windows: `winget install Git.Git`, `winget install OpenJS.NodeJS.LTS`
   - macOS: `brew install git node` (if Homebrew is missing, use the installers from git-scm.com and nodejs.org)
   - Also install the **GitHub CLI** (`winget install GitHub.cli` / `brew install gh`). It's the simplest way to sign in.
   Open a new shell after installing so the new commands are found.
2. **GitHub access.** She must have accepted the collaborator invite to `pjudal/wedding-site` (it's in her email, or at
   https://github.com/pjudal/wedding-site/invitations). Then run `gh auth login --web` (GitHub.com, HTTPS, sign in in the
   browser) and `gh auth setup-git`.
   Check: `gh api repos/pjudal/wedding-site --jq .permissions.push` must print `true`. If it prints `false`, she hasn't
   accepted the invite yet.
3. **Get the code.** If you're not already inside a clone of this repo, ask where she'd like it (default: a `wedding-site`
   folder in her home folder), then `git clone https://github.com/pjudal/wedding-site.git` and `cd` into it.
4. **Commit identity, for this repo only** (never `--global`, so you don't touch her other projects):
   - `git config user.name "<her name, ask her how she wants it shown>"`
   - `git config user.email "<id>+<login>@users.noreply.github.com"`. Get the values with `gh api user --jq '"\(.id)+\(.login)"'`.
     This keeps her real email out of the public history.
5. **Install and seed:** `npm install`, then `npm run seed`. With no guest list locally, it uses the made-up example guests,
   which is expected.
6. **Prove it works:** `npm run lint && npx tsc --noEmit && npm run build` must all pass.
   Then start `npm run dev` and do a test RSVP as "Juan Dela Cruz" at http://localhost:3000 (fetch or browser).
   Afterwards run `npm run seed -- --reset` to clear the test answer.
7. **Hand over.** Tell her it's ready, give her the local preview link (http://localhost:3000) and the live site
   (https://pj-jedah-wedding.vercel.app), and suggest 2 or 3 example requests.
   You don't need the Google Sheet secret for any of this; local mode uses test data.

If a step fails in a way you can't fix (for example a corporate laptop blocking installs), explain it simply and suggest she ask PJ.

## Every change request: the routine

1. **Understand it.** If it involves a fact (time, price, place, policy) that isn't confirmed in section 1, ask her. Never guess.
2. **Pull first:** `git pull` (PJ may have pushed changes).
3. **Make the change**, following the rules in section 3 and the how-tos in section 5.
4. **Check it:** `npm run lint && npx tsc --noEmit && npm run build`, then show her in `npm run dev`
   (desktop and phone width). A screenshot or the local link is enough.
5. **Ask before publishing:** "Ready to put this live?" Pushing to `main` updates the real site.
6. **Publish:** `git status` (make sure no `data/` or `.env` files are included), commit with a plain message, `git push`.
7. **Confirm it's live:** after 1-2 minutes, check
   `https://api.github.com/repos/pjudal/wedding-site/commits/<sha>/status` (`state` should be `success`), or fetch
   https://pj-jedah-wedding.vercel.app and confirm the new text is there. If the deploy failed, the old version is still up;
   fix and push again, or tell her to ask PJ.

Guest list changes (adding or removing people, grouping couples) happen in the **Google Sheet**, not in code. Point her there
(section 5, "Manage guests").

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
| `src/app/share`, `src/components/ShareUploader.tsx` | Guest photo upload page (the QR code on the tables opens this) |
| `src/app/live`, `src/components/Slideshow.tsx` | Projector slideshow, auto-refreshing |
| `src/app/photo-admin`, `src/components/PhotoAdmin.tsx` | PJ and Jedah only: all photos, hide from the slideshow |
| `src/app/photo-cards`, `src/components/PrintCards.tsx` | Printable QR table cards |
| `src/app/gallery`, `src/components/Gallery.tsx` | Guest gallery: every non-hidden photo, tap to view and download (linked from `/share`) |
| `src/app/api/photos/*` | Sign an upload, list, image, hide, links for the cards |
| `src/lib/photos.ts` | Photo storage: Cloudflare R2 in production, `data/photos` locally |
| `scripts/download-photos.mjs` | `npm run photos:download`: saves every photo to `data/photos-export` |

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

### Guest photos (QR cards, upload page, guest gallery, projector slideshow)

How it works:

```
QR card on table -> /share (no login) -> phone shrinks each photo to 2560px JPEG (drops GPS/EXIF)
   -> /api/photos/sign gives a 15-minute signed URL -> phone uploads straight to Cloudflare R2 (bucket in PJ's account)
Laptop on projector -> /live -> checks for new photos every 10s, new ones show next, then shuffles through all
Guests -> /gallery (button on /share) -> every non-hidden photo, newest first, tap to view big + Download
PJ / Jedah -> /photo-admin -> Hide (off the big screen + gallery, file kept) or Delete (gone for good), print cards, links
```

- **Passwords are OFF (PJ's choice, 2026-11-25).** `/share`, `/live`, `/photo-admin` and `/photo-cards` open for anyone with the address.
  They can be turned back on with two optional Vercel env vars (never in the repo), then a redeploy:
  `PHOTO_KEY` (guests: added to the QR link as `?k=`, needed for `/share` and `/live`) and `PHOTO_ADMIN_KEY`
  (PJ and Jedah: `/photo-admin` asks for it once per device). Each one is independent; unset = open.
  **Decide before printing the QR cards.** The card holds the link as it was at print time: adding or changing
  `PHOTO_KEY` afterwards breaks every printed card.
- Locally, nothing needs setting up: photos go to `data/photos` (git-ignored) and the pages open at
  http://localhost:3000/share, /live, /photo-admin, /photo-cards. Set `PHOTO_KEY`/`PHOTO_ADMIN_KEY` in `.env.local` to test with passwords.
- Wording on the upload page, cards and slideshow lives in `photos` in `src/content.ts`.
- These pages (`/share`, `/gallery`, `/live`, `/photo-admin`, `/photo-cards`) deliberately have **no site menu or footer**: `src/components/SiteChrome.tsx` hides them there. If you add a page that also should stand alone, add it to the list in that file. They are also not linked from the menu on purpose: guests get in through the QR code.
- Bucket layout: `photos/<timestamp>-<random>--<name, base64url>.jpg`, `thumbs/<id>.jpg` (480px preview made on the phone,
  used by the gallery and admin grid; older uploads have none and fall back to the full photo), plus empty `hidden/<id>` markers.
- **While `PHOTO_ADMIN_KEY` is unset, anyone who finds `/photo-admin` can hide or delete photos.** Setting it only protects the
  admin page and does not affect the printed QR cards, so it can be turned on at any time.
- Photos only, no videos, on purpose. Guests can pick JPEG, PNG, WebP or **HEIC/HEIF** (iPhone, some Samsungs); everything is
  converted to JPEG on the phone before upload. HEIC is converted with `heic-to` (~3 MB), loaded only when someone picks a HEIC
  photo the browser can't read itself, so other guests never download it.

**One-time setup (PJ, needs a Cloudflare login):**
1. Cloudflare dashboard > R2 > create bucket `pj-jedah-wedding-photos` (location: Automatic). Keep public access **off**.
2. Bucket > Settings > CORS policy:
   `[{"AllowedOrigins":["https://pj-jedah-wedding.vercel.app","http://localhost:3000"],"AllowedMethods":["PUT","GET"],"AllowedHeaders":["content-type"],"MaxAgeSeconds":3600}]`
   (add the custom domain here too if you add one later).
3. R2 > Manage API tokens > Create API token: **Object Read & Write**, applied to that one bucket only. Copy the Access Key ID and Secret.
4. Vercel > Project > Settings > Environment Variables (Production): `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
   `R2_BUCKET`. Optional passwords: `PHOTO_KEY` (short random, keeps the QR simple), `PHOTO_ADMIN_KEY` (long random). Redeploy.
5. Open `/photo-admin` > Print table cards. Test-scan one card, upload a photo, check it on `/live`, hide it, then print.

**On the day:** open the slideshow link on the laptop, double-click (or press F) for full screen, plug in the projector, leave it.
Keep the laptop on power and turn off its sleep timer as a backup (the page also asks the browser to keep the screen awake).
A small yellow dot in the top-right corner means the laptop has lost internet; it keeps showing the photos it already has.

**After:** put the four `R2_*` values in `.env.local`, run `npm run photos:download`. Photos land in `data/photos-export/`
named by time and uploader (hidden ones in `hidden/`). Copy them to Google Photos or Drive by hand if you want them there.

### Photo album editor (`/album-admin`): syncing between devices

The editor syncs by itself, git style, so working on a phone and a laptop never overwrites the other device's work.
No key to type and no "save online" button.

- Each device keeps its own copy (IndexedDB) plus the last online version it saw (its "base").
- A moment after each edit, every 20 seconds, and whenever the tab comes back into focus or online, it **pulls** the online
  draft (`album/draft.json` in R2). If another device saved, it **merges**: page by page (pages have a stable `id`), field by
  field, photo slot by photo slot. Whatever only one device changed is kept. If both changed the very same thing, the device
  doing the merge wins. Then it **pushes**. The server refuses a push that isn't based on the latest version (409), and the
  device just pulls, merges and tries again.
- New photos are uploaded as soon as they're added and the draft points at the uploaded copy, so other devices see them.
- The status line under the buttons says "All changes saved and synced", "Saving and syncing…" or "Can't reach the online
  draft" (offline: edits stay on the device and sync later).
- The first time a device syncs, if it had its own older draft that differs from the online one, the online one wins and the
  device's copy is kept as "Download this device's older copy" (open it later with **Open draft** to bring it back).
- `ALBUM_DRAFT_KEY` (Vercel env, optional): unset = open, like `PHOTO_ADMIN_KEY`. Set = each device asks once and remembers it.
- **Publish album** is separate: guests only see what was last published.
- Code: merge logic in `src/lib/albumSync.ts`, sync loop in `src/components/PhotoAlbum.tsx`, storage in `src/lib/photos.ts`.

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
- [ ] Guest photos: Cloudflare R2 setup + Vercel env vars (section 5, "Guest photos"), then test-scan a printed card
- [ ] Guest photos: check mobile signal / wifi at the venue; uploads need internet
