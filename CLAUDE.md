# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # vite dev server, http://localhost:5173
npm run build    # tsc -b (project references) then vite build
npm run lint     # oxlint (no eslint config; oxlint runs on defaults)
npm run preview  # serve dist/
```

No test runner is installed — there are no tests to run.

## What this is

A single-page, single-scroll portfolio ("Specimen Archive"): React 19 + Vite 8 +
Tailwind v4 (via `@tailwindcss/vite`, no config file) + GSAP/ScrollTrigger + Lenis.
No router, no backend, no data fetching. `App.tsx` renders seven sections in fixed
order and that is the whole app.

## The direction contract

`index.html` carries an HTML comment at the top of `<body>` stating the design
thesis (ink ground, periwinkle signal, Bodoni/Archivo/Martian Mono, annotated
specimen plates, refusal of the hero/card-grid arrangement). It ships into `dist/`
on purpose. **Read it before changing anything visual** — it is the standard any
design change is judged against.

## Content

Every user-visible string lives in `src/content.ts` — `IDENTITY`, `HERO`,
`MANIFEST`, `PROJECTS`, `STACK`, `TRAJECTORY`, `CERTIFICATIONS`, `COLOPHON`,
`SECTIONS`. Sections import from it; nothing hardcodes copy.

The one content rule, stated in the file itself and in `REPLACE.md`: **readout
values are facts, never estimates.** A real measured number is typed `number` and
the UI counts up to it; where no number exists the readout prints a fact string
(`'Transformer'`, `'GTFS'`). Never invent a percentage to make a plate look busier.

`SECTIONS` is the source of truth for section ids/numbering — `Nav` builds the rail
and scroll-spy from it, so adding a section means adding an entry there.

`REPLACE.md` tracks what is still placeholder (project links, one trajectory entry,
the specimen image, résumé PDF).

## Theming

Two states, `ink` (dark) and `paper` (light), driven by `data-theme` on `<html>`.

- The inline script in `index.html` sets the attribute before first paint; it must
  stay in sync with `readTheme()` in `src/lib/theme.ts` (same `archive-theme` key,
  same fallback logic).
- All colours are semantic `@theme` tokens in `src/index.css` redefined under
  `:root[data-theme='paper']`. Write sections once against tokens (`bg-ground`,
  `text-fg-2`, `text-signal`) — never hardcode a hex. `invert-*` tokens are the
  opposite state, for the one plate that deliberately contradicts its page.
- Colour transitions are armed by a `data-theme-ready` attribute set one frame
  after mount so the first paint never animates.

`src/index.css` also owns the shared typographic classes used everywhere: `.hud` /
`.hud-lg` (mono microcopy), `.block-label`, `.display` / `.display-sm`, `.rule`,
`.rule-dotted`, `.marginalia`, plus `.plate-grid` / `.halftone` / `.scanlines`.
Reach for these before writing new utility soup.

## Motion

One engine, in `src/lib/motion.ts`: GSAP + ScrollTrigger for choreography, Lenis for
smooth scroll, both on GSAP's ticker (`useSmoothScroll`). The module keeps the live
Lenis instance so `scrollToSection(id)` can drive it — anchors `preventDefault` and
call that, since a native hash jump snaps past the animation.

- **Always use `useGsap(setup, ref, deps)`**, not raw `gsap.context` in an effect. It
  delegates to `@gsap/react`'s `useGSAP`, which sequences correctly under StrictMode;
  a hand-rolled version corrupted ScrollTrigger's internal trigger array and crashed
  the tree. Sections address elements inside their scope via `data-*` attributes
  (`data-plate`, `data-plate-line`, `data-mark`) and `gsap.utils.toArray`.
- Every scroll animation is gated on `prefersReducedMotion()`; content renders
  visible by default and motion is the enhancement.
- `App.tsx` calls `ScrollTrigger.refresh()` after the preloader lifts and again on
  `document.fonts.ready` — triggers created while `<html>` is `overflow:hidden`
  measure against an unscrollable page, and Bodoni changes every heading's height.
- Two documented exceptions to "use the engine", both commented at the decision site:
  `Readout.tsx` uses a plain IntersectionObserver + rAF (a `once: true` trigger only
  fires on a downward crossing, freezing readouts above a mid-page landing), and
  `HalftoneReveal` is imported statically rather than lazily (a mid-mount chunk
  resolution re-ran a subtree's ScrollTriggers during a sibling's init).

Do not "clean up" either exception without reproducing the bug it fixes.

## Component layers

- `components/plate/` — the archive's own vocabulary: `Sparkle` (the site's only
  icon), `Annotations` (the signature leader-line interaction), `PlateFrame` /
  `Registration`, `PlateFace`, `StarChart`, `SectionHead`, `Readout`. New visual
  primitives belong here.
- `components/reactbits/` — vendored from reactbits.dev and retuned to the palette.
  Treat as third-party: patch minimally, keep the file recognisable upstream.
- `sections/` — one file per plate, each importing its copy from `content.ts` and
  opening with `<SectionHead n kicker right />`.

The Hero deliberately stacks three pointer-driven layers (`DotGrid`, `StarChart`,
`Crosshair`) plus the page-wide `Noise` grain — that cost is a design decision, not
an oversight.
