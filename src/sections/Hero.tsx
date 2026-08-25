import { useRef } from 'react';
import { HERO, IDENTITY } from '../content';
import { StarChart } from '../components/plate/StarChart';
import { Annotations } from '../components/plate/Annotations';
import { Sparkle } from '../components/plate/Sparkle';
import { gsap, useGsap, prefersReducedMotion } from '../lib/motion';
import VariableProximity from '../components/reactbits/VariableProximity';
import Crosshair from '../components/reactbits/Crosshair';
import DotGrid from '../components/reactbits/DotGrid';
import { useTheme } from '../lib/theme';

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const wordmark = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const paper = theme === 'paper';

  useGsap(
    ({ scope }) => {
      if (prefersReducedMotion()) return;

      gsap
        .timeline({ delay: 0.15 })
        .from('[data-rise]', {
          yPercent: 118,
          duration: 1.25,
          ease: 'expo.out',
          stagger: 0.09,
        })
        .from('[data-fade]', { opacity: 0, duration: 0.8, stagger: 0.06, ease: 'power2.out' }, '-=0.8')
        .from('[data-hairline]', { scaleX: 0, duration: 1, ease: 'power3.inOut' }, '-=1.1');

      // The wordmark sinks as the archive opens beneath it.
      gsap.to('[data-sink]', {
        yPercent: 26,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom top', scrub: true },
      });
    },
    root,
    []
  );

  return (
    <section
      ref={root}
      id="hero"
      className="relative flex min-h-svh flex-col overflow-hidden px-4 pt-5 pb-20 sm:px-8 sm:pb-6 xl:px-24"
      aria-label="Frontispiece"
    >
      {/*
        The archive's own halftone, made interactive: a dot field that parts
        around the pointer and settles back. It is the substrate the plates
        are printed on, so it stays far below the type in contrast.
      */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <DotGrid
          key={theme}
          dotSize={2.2}
          gap={26}
          baseColor={paper ? '#cec5b3' : '#2a2a3c'}
          activeColor={paper ? '#5f5ba8' : '#a9a6f2'}
          proximity={130}
          shockRadius={220}
          shockStrength={4}
          resistance={620}
          returnDuration={1.4}
          className="size-full"
        />
      </div>

      {/* a soft signal bloom sits the wordmark on top of the terrain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(58% 46% at 50% 46%, color-mix(in oklab, var(--color-signal) 14%, transparent) 0%, transparent 70%)',
        }}
      />

      <StarChart />

      {/* the plate's reticle — scoped to this section, clipped by its bounds */}
      <div className="pointer-events-none absolute inset-0 z-[5] hidden lg:block">
        <Crosshair color="#6e6ba8" containerRef={root as React.RefObject<HTMLElement>} />
      </div>

      {/* ── plate header rule ─────────────────────────────────────────── */}
      <header className="relative z-10 flex items-baseline gap-4">
        <span data-fade className="hud text-signal">
          {IDENTITY.plateId}
        </span>
        <span data-hairline className="rule origin-left flex-1" />
        <span data-fade className="hud hidden text-fg-3 sm:block">
          {IDENTITY.locale}
        </span>
        <span data-hairline className="rule origin-right hidden w-16 sm:block" />
        <span data-fade className="hud text-fg-2">
          MMXXVI
        </span>
      </header>

      {/* ── the thesis ────────────────────────────────────────────────── */}
      <div data-sink className="relative z-10 flex flex-1 items-center justify-center">
        <div ref={wordmark} className="relative w-full max-w-[min(92vw,1400px)] py-10">
          <Annotations items={HERO.annotations} className="hidden md:block" />

          <h1 className="relative z-30 text-center">
            <span className="sr-only">{IDENTITY.name}</span>

            <span className="block overflow-hidden">
              <span
                data-rise
                aria-hidden="true"
                className="display block text-[clamp(3.4rem,15.5vw,13.5rem)] tracking-[0.06em] text-fg"
              >
                <VariableProximity
                  label="ARYAN"
                  containerRef={wordmark}
                  radius={220}
                  falloff="gaussian"
                  fromFontVariationSettings="'opsz' 96, 'wght' 400"
                  toFontVariationSettings="'opsz' 6, 'wght' 900"
                  style={{ fontFamily: 'inherit' }}
                />
              </span>
            </span>

            <span className="block overflow-hidden">
              <span
                data-rise
                aria-hidden="true"
                className="display block text-[clamp(3.8rem,17vw,15rem)] text-signal italic"
                style={{ fontVariationSettings: "'opsz' 96, 'wght' 500" }}
              >
                Singh
              </span>
            </span>
          </h1>

          <div className="relative z-30 mx-auto mt-7 flex max-w-5xl items-center gap-6 px-2">
            <span data-hairline className="rule origin-right hidden flex-1 sm:block" />
            <p data-fade className="hud-lg min-w-0 text-center text-balance text-fg-2">
              {IDENTITY.role}
            </p>
            <span data-hairline className="rule origin-left hidden flex-1 sm:block" />
          </div>
        </div>
      </div>

      {/* ── footer: index list + cue ──────────────────────────────────── */}
      <footer className="relative z-10 flex flex-wrap items-end justify-between gap-6">
        {/* pb clears the fixed plate-state pill in the bottom-left gutter */}
        <div data-fade className="pb-12 sm:pb-11">
          <div className="hud mb-2 flex items-center gap-1.5 text-signal">
            <Sparkle size={8} />
            {HERO.kicker}
          </div>
          <ol className="flex flex-wrap gap-x-6 gap-y-1">
            {HERO.index.map((it) => (
              <li key={it.n} className="hud-lg flex items-baseline gap-2 text-fg">
                <span className="hud text-signal-dim">[{it.n}]</span>
                {it.label}
              </li>
            ))}
          </ol>
        </div>

        <a
          data-fade
          href="#manifest"
          className="hud group flex items-center gap-2.5 text-fg-2 transition-colors hover:text-signal-lift"
        >
          {HERO.scrollCue}
          <span className="relative block h-8 w-px bg-line">
            <span className="absolute inset-x-0 top-0 h-3 animate-[cue_1.8s_ease-in-out_infinite] bg-signal" />
          </span>
        </a>
      </footer>

      <style>{`@keyframes cue { 0%,100% { transform: translateY(0); opacity: 1 } 50% { transform: translateY(20px); opacity: .25 } }`}</style>
    </section>
  );
}
