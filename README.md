# PJ & Jedah - wedding site

One-page wedding site with an RSVP name lookup. Next.js + Tailwind + Motion, hosted on Vercel (free),
RSVPs saved to a private Google Sheet through a small Apps Script.

**Use personal accounts only** (GitHub, Vercel, Google). Nothing here should touch work accounts.

## Run it locally

```bash
npm install
npm run seed          # builds the local guest list from data/guest-list.csv
npm run dev           # http://localhost:3000
```

Without Google settings, RSVPs are saved to `data/guests.local.json`, so you can test the whole flow offline.
`npm run seed -- --reset` clears test answers.

## Where to change things

| What | Where |
| --- | --- |
| All wording, date, venue, deadline, price, schedule, FAQ | `src/content.ts` (look for `TODO`) |
| Hero photo | replace `src/assets/hero.jpg` (landscape, about 3000px wide) |
| Colors | `src/app/globals.css` (`--color-dusk-*` = dusty blue, `--color-butter-*` = pastel yellow) |
| Sections and layout | `src/components/*`, order in `src/app/page.tsx` |

## Guest list

`data/` is git-ignored, because it holds guests' names and answers. `data/guest-list.csv` is the working list:

- `ID` must be unique and never reused (G01, G02, ...). Rows added straight into the Google Sheet get an ID automatically.
- `Party` groups people who RSVP together (e.g. a couple both get `P01`). Blank = RSVP alone.
- Name lookup needs the full name, or first + last. A surname alone matches no one, on purpose.

## Connect the Google Sheet (needs your Google login)

1. `npm run seed` (also writes `data/sheet-import.csv`).
2. In Google Sheets (personal account), create a blank sheet. File > Import > Upload `data/sheet-import.csv` > "Replace current sheet". Rename the tab to **Guests**.
3. Extensions > Apps Script. Replace the code with `google/Code.gs`. Save.
4. Project Settings (gear) > Script properties > add `SECRET` = a long random string. To make one:
   `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`
5. Deploy > New deployment > type **Web app**. Execute as **Me**, Who has access **Anyone**. Authorize, then copy the URL ending in `/exec`.
   (The URL is public but does nothing without the secret.)
6. Create `.env.local` from `.env.example` with that URL and secret, restart `npm run dev`, and do a test RSVP. It should appear in the sheet, with a history row in the **Log** tab.
7. If you edit `Code.gs` later: Deploy > Manage deployments > edit > Version "New version". The URL stays the same.

## Deploy to Vercel (needs GitHub + Vercel logins)

1. Create a **private** GitHub repo and push this folder.
2. On vercel.com, sign in with GitHub > Add New > Project > import the repo.
3. Add environment variables `GOOGLE_SCRIPT_URL` and `GOOGLE_SCRIPT_SECRET` (same values as `.env.local`). Deploy.
4. You get `https://<project>.vercel.app`. Every push to `main` redeploys. Other branches get private preview links.
5. Optional custom domain later (about $10-15 a year): Vercel > Project > Settings > Domains.

## Before launch (December)

- [ ] Fill every `TODO` in `src/content.ts` (name order, schedule times, dress code, night-before price terms, exact map link, deadline)
- [ ] Final guest list + parties in the sheet
- [ ] Test RSVP on a phone against the real sheet, then clear the test rows
- [ ] Clear test answers in the sheet before sending the link
