# What's real, and what still needs you

Content is **real**, taken from your LinkedIn profile export (`Profile.pdf`) and
the project list in `../portfoliov2/src/data.ts`. It all lives in one file:
**`src/content.ts`**.

## The one rule when you edit content.ts

Readout **values are facts, never estimates.** Where a real number exists it is
a `number` and the interface counts up to it; where none exists the readout
states a fact instead (`'Transformer'`, `'GTFS'`, `'Route-level'`). The whole
design rests on the claim that these numbers are measured — do not swap a fact
for an invented percentage to make a plate look busier.

## Still worth your attention

| Where | What |
|---|---|
| `PROJECTS` | Six plates. Descriptions of **Transit Demand**, **Sleep-HiT** and **Music Engine** are written from your summary's one-line mentions — check I characterised them right. None carry metrics because none were in the source; add real ones as numbers if you have them. |
| `PROJECTS[].href` | Unset. No repo or demo links existed anywhere — add them and the index rows become real links. |
| `TRAJECTORY[03]` | `VIT_Animation · Vellore`, Design Head. The profile gave no bullets, so the note is my summary of a seven-month design lead role — rewrite it. |
| `MANIFEST.callouts` | Four annotations on the specimen plate, derived from your tool list. Cosmetic; change freely. |
| `IDENTITY.locale` | `Greater Surat Area, IN` from the profile. The hero annotation says `Surat, IN`. |
| `public/specimen-placeholder.webp` | A **generated** abstract specimen (1000×1250, 4:5), clearly labelled as a placeholder in the UI. Drop a real portrait at the same path and aspect — it runs through a halftone shader, so high contrast works best. Then remove the `placeholder` badge in `src/sections/Manifest.tsx`. |
| `public/resume.pdf` | Your LinkedIn export, copied from `Profile.pdf`. Swap for a designed résumé when you have one. |
| `index.html` | `<meta name="description">` — rewrite in your words. Add an OG image for link previews. |

`Profile.pdf` sits at the repo root, not in `public/`, so it is not served.

## The contact form needs a key

The contact plate posts to [Web3Forms](https://web3forms.com) — sign up, then put
the access key in a `.env` at the repo root:

```
VITE_WEB3FORMS_KEY=your-key-here
```

Then add the same variable in **Vercel → Settings → Environment Variables**
(all three environments) and redeploy — Vite bakes it in at build time, so a
deploy without it ships the fallback. The build log warns when it is missing.

`.env` is gitignored. The key is public by design — it names the destination
inbox and authorises nothing — but this repo is public, so it stays out of it.
**Without the key the form still works**: the send button hands the composed
message to the visitor's mail client instead.

## Not built (say the word)

Per-project case-study routes · blog/MDX · CMS · analytics.
