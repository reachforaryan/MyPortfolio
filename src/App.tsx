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
import Noise from './components/reactbits/Noise';
import ClickSpark from './components/reactbits/ClickSpark';

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
      <div className="pointer-events-none fixed inset-0 z-[80] mix-blend-soft-light">
        <Noise patternSize={190} patternAlpha={11} patternRefreshInterval={3} />
      </div>

      <ClickSpark sparkColor="#c7c4ff" sparkSize={9} sparkRadius={22} sparkCount={4} duration={520} />
    </>
  );
}
