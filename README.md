# Specimen Archive — portfolio

A single-scroll portfolio built as a catalogued archive of technical plates.
Ink ground, periwinkle signal, one inverted paper sheet for pacing.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Structure

```
src/
  content.ts              every string on the site — the only file you edit for content
  index.css               design tokens (@theme) + the plate's component classes
  lib/motion.ts           GSAP + ScrollTrigger + Lenis; useGsap, useInView, usePointer
  components/plate/       the archive's own vocabulary
    Sparkle               the four-point registration star, the site's only icon
    Annotations           the signature interaction — leader lines that draw themselves
    PlateFrame            hairline frame + corner registration marks
    PlateFace             per-project generative readout (waveform, matrix, barcode)
    StarChart             three-layer parallax star field
    SectionHead           the shared plate header
  components/reactbits/   vendored from reactbits.dev, retuned to the palette
  sections/               Hero · Manifest · Trajectory · Index · Work · Stack · Colophon
```

The direction contract is an HTML comment at the top of `<body>` in
`index.html`, and it survives into `dist/`. Read it before changing the design.

## Content

Every string lives in `src/content.ts`, sourced from the LinkedIn profile
export. Readout values are facts, never estimates — see
[REPLACE.md](./REPLACE.md) for the rule and what still needs attention.

## Motion

One engine: GSAP + ScrollTrigger for scroll choreography, Lenis for smooth
scroll, both on the same ticker. `motion` is present only because three of the
vendored ReactBits components require it.

Every scroll animation is behind `prefers-reduced-motion`; content renders
visible by default and motion is the enhancement.

Two deliberate exceptions to "use the GSAP engine":

- `components/plate/Readout.tsx` counts on a plain `IntersectionObserver` and
  `requestAnimationFrame`. A ScrollTrigger `once: true` only fires on a
  downward crossing, so a reader landing mid-page found every readout above
  them stuck at zero.
- `HalftoneReveal` is imported statically. As a lazy chunk it resolved
  mid-mount and re-ran its subtree's ScrollTriggers while a sibling section's
  were still initialising, corrupting ScrollTrigger's internal trigger list and
  taking the whole tree down.

Both are commented at the site of the decision.
