import { useEffect, useState } from 'react';
import { ScrollTrigger, useSmoothScroll } from './lib/motion';
import { Preloader } from './components/Preloader';
import { Nav } from './components/Nav';
import { Hero } from './sections/Hero';
import { Manifest } from './sections/Manifest';
import { Index } from './sections/Index';
import { Work } from './sections/Work';
import { Stack } from './sections/Stack';
import { Trajectory } from './sections/Trajectory';
import { Colophon } from './sections/Colophon';
import ClickSpark from './components/reactbits/ClickSpark';

/*
 * Film grain: one tiled feTurbulence, no canvas and no rAF loop. Two knobs —
 * opacity is how much grain there is (0.16 lands near the old canvas's
 * patternAlpha of 11/255; higher flattens the ground into a wash), and the
 * matrix scale is how dark it is (0.2667 = flat 1/3 grayscale, 20% darker).
 */
const GRAIN = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='190' height='190'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0.2667 0.2667 0.2667 0 0 0.2667 0.2667 0.2667 0 0 0.2667 0.2667 0.2667 0 0 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.16'/%3E%3C/svg%3E\")",
  backgroundSize: '190px 190px',
};

export default function App() {
  const [ready, setReady] = useState(false);
  useSmoothScroll();

  /*
   * Every trigger is created while the preloader holds <html> at
   * overflow:hidden, so they measure against a page that cannot scroll and
   * their start/end are meaningless — anything high enough on the page never
   * fires. Re-measure once the curtain lifts, and again when the display face
   * lands, since Bodoni changes every heading's height.
   */
  useEffect(() => {
    if (!ready) return;
    // Next frame: refreshing inside a mount pass re-enters ScrollTrigger.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return (
    <>
      {!ready && <Preloader onDone={() => setReady(true)} />}

      <Nav />

      <main id="main">
        <Hero />
        <Manifest />
        <Trajectory />
        <Index />
        <Work />
        <Stack />
        <Colophon />
      </main>

      {/* film grain over the whole archive */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] mix-blend-soft-light"
        style={GRAIN}
      />

      <ClickSpark sparkColor="#c7c4ff" sparkSize={9} sparkRadius={22} sparkCount={4} duration={520} />
    </>
  );
}
