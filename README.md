# Specimen Archive

My portfolio, built as a catalogued archive of technical plates rather than a
hero section and a card grid. Ink ground, periwinkle signal, one inverted paper
sheet for pacing.

**Live at [reachforaryan.com](https://reachforaryan.com)**

---

## Who

I'm **Aryan Singh** — final-year Computer Science at Vellore Institute of
Technology (2022–2026), based in Surat, India. I work on **RAG and agentic AI
systems, ML/DL, computer vision and applied data science**, and I'm currently
open to work.

- **Email** — [reachforaryan@gmail.com](mailto:reachforaryan@gmail.com)
- **GitHub** — [@reachforaryan](https://github.com/reachforaryan)
- **LinkedIn** — [in/reachforaryan](https://linkedin.com/in/reachforaryan)


## The site itself

A single page, single scroll. No router, no backend, no data fetching — seven
sections in a fixed order, and that's the whole app.

**React 19 · Vite 8 · Tailwind v4 · GSAP/ScrollTrigger · Lenis · OGL**

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

The direction contract is an HTML comment at the top of `<body>` in
`index.html`, and it ships into `dist/` on purpose. It states the design thesis
the whole build is judged against — read it before changing anything visual.

### Structure

```
api/contact.ts            Vercel Edge function — the contact form's server half
src/
  content.ts              every string on the site — the only file you edit for content
  index.css               design tokens (@theme) + the plate's component classes
  lib/motion.ts           GSAP + ScrollTrigger + Lenis; useGsap, usePointer, scrollToSection
  lib/theme.ts            the ink/paper store and the view-transition toggle
  components/plate/       the archive's own vocabulary
    Sparkle               the four-point registration star, the site's only icon
    Annotations           the signature interaction — leader lines that draw themselves
    PlateFrame            hairline frame + corner registration marks
    PlateFace             per-project readout — route, respiration, embedding, digest, graph
    StarChart             three-layer parallax star field
    SectionHead           the shared plate header
  components/ContactPlate the <dialog> contact form
  components/reactbits/   vendored from reactbits.dev, retuned to the palette
  sections/               Hero · Manifest · Trajectory · Index · Work · Stack · Colophon
```

### Content

Every string lives in `src/content.ts`. One rule, stated in the file itself:
**readout values are facts, never estimates.** Where a real measured number
exists it is a `number` and the interface counts up to it; where none exists the
readout prints a fact instead (`'Transformer'`, `'GTFS'`). The design rests on
the claim that those numbers are measured. See [REPLACE.md](./REPLACE.md) for
what's still placeholder.

---

## Decisions worth knowing

**One motion engine.** GSAP + ScrollTrigger for choreography, Lenis for smooth
scroll, both on the same ticker. `scrollToSection` drives Lenis directly,
because an anchor's native hash jump snaps straight past the animation. The URL
hash then tracks the section you're actually in, not the last one you clicked.

Every scroll animation sits behind `prefers-reduced-motion`; content renders
visible by default and motion is the enhancement.

**Two deliberate exceptions to "use the engine"**, both commented at the
decision site:

- `Readout` and `Annotations` reveal on a plain `IntersectionObserver`. A
  ScrollTrigger `once: true` fires only on a *downward* crossing, so arriving at
  a plate from a link and scrolling back up left everything above stuck at
  opacity 0 — drawn, but invisible.
- `HalftoneReveal` is imported statically. As a lazy chunk it resolved mid-mount
  and re-ran its subtree's ScrollTriggers while a sibling's were still
  initialising, corrupting ScrollTrigger's internal trigger list and taking the
  whole tree down.

**Theme is a store, not per-component state.** Two states, `ink` and `paper`,
driven by `data-theme` on `<html>` with semantic tokens redefined underneath.
The toggle runs inside `document.startViewTransition()`, so the browser
cross-fades one composited snapshot instead of transitioning colour on every
element — which was a repaint storm that landed in pieces.

**The contact form has a server half.** `api/contact.ts` is a Vercel Edge
function: the browser posts to `/api/contact`, the function adds the Web3Forms
access key and forwards it. The key is a server-only variable with no `VITE_`
prefix, so Vite structurally cannot inline it into the bundle. Validation,
length caps and the honeypot are all checked server-side. The dialog itself is a
native `<dialog>` — modal semantics, focus containment and Esc come from the
platform.

**Performance is a design decision, not an afterthought.** The film grain is one
tiled `feTurbulence` rather than a canvas redrawing forever. Fonts ship
latin-subset only. Plate faces are deterministic SVG generated from a seeded
PRNG — no images to load, and a reload draws them identically. The Hero
deliberately stacks three pointer-driven layers; that cost is chosen, and it's
the one place it's spent.

---

## Deploying

Hosted on Vercel. Two things to set in the project's environment variables:

```
WEB3FORMS_KEY=…      # server-only, no VITE_ prefix — the contact form's key
```

Web Analytics is enabled in the Vercel dashboard; `@vercel/analytics` is
cookieless and no-ops outside production.

Locally, `npm run dev` serves the site but not `/api` — Vite has no functions.
Use `vercel dev` to exercise the real send path. Without the key the endpoint
answers `500` and the dialog points people at the email address directly.

---

Set in Bodoni Moda, Archivo and Martian Mono.
