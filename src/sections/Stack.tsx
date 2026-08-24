import { useRef } from 'react';
import { STACK } from '../content';
import { Sparkle } from '../components/plate/Sparkle';
import { gsap, useGsap, prefersReducedMotion } from '../lib/motion';

/**
 * The contrary plate. Whatever state the archive is printed in, this one
 * sheet is pulled in the opposite — so its job in the scroll survives the
 * theme toggle: a quiet, inverted passage between two dense ones.
 */
export function Stack() {
  const root = useRef<HTMLElement>(null);

  useGsap(
    ({ scope }) => {
      if (prefersReducedMotion()) return;

      // The sheet slides up over the ink as you arrive.
      gsap.from(scope, {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: scope, start: 'top bottom', end: 'top top', scrub: 0.4 },
      });

      gsap.from('[data-row]', {
        opacity: 0,
        y: 26,
        duration: 0.85,
        stagger: 0.12,
        ease: 'expo.out',
        scrollTrigger: { trigger: '[data-sheet]', start: 'top 78%', once: true },
      });

      gsap.from('[data-leader]', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: '[data-sheet]', start: 'top 78%', once: true },
      });
    },
    root,
    []
  );

  return (
    <section
      ref={root}
      id="stack"
      className="relative isolate overflow-hidden bg-invert-ground px-4 py-24 text-invert-fg sm:px-8 xl:px-24 sm:py-28 lg:py-36"
      aria-label="Apparatus"
    >
      {/* printed texture: halftone tooth over the paper */}
      <div
        aria-hidden="true"
        className="halftone pointer-events-none absolute inset-0 -z-10 text-invert-fg opacity-[0.09]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        style={{
          background:
            'radial-gradient(90% 70% at 50% 0%, color-mix(in oklab, var(--color-invert-ground) 78%, #fff) 0%, transparent 62%)',
        }}
      />

      {/* registration strip across the top edge */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-4 text-signal-dim sm:px-8 xl:px-24">
        {Array.from({ length: 9 }, (_, i) => (
          <Sparkle key={i} size={11} weight={0.3} className="-translate-y-1/2" />
        ))}
      </div>

      <div data-sheet className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-invert-fg/25 pb-6">
          <h2 className="display text-[clamp(2.2rem,6.5vw,4.4rem)] leading-none">
            Apparatus
          </h2>
          <p className="hud text-invert-fg/55">
            Plate 06 · the tools, on the one contrary sheet
          </p>
        </header>

        <div className="mt-4">
          {STACK.map((g) => (
            <div
              data-row
              key={g.n}
              className="grid gap-x-8 gap-y-3 border-b border-invert-fg/15 py-8 md:grid-cols-[auto_minmax(0,15rem)_minmax(0,1fr)] md:items-baseline"
            >
              <span className="display display-sm text-[1.6rem] leading-none text-invert-fg/35 md:text-[2rem]">
                {g.n}
              </span>

              <div>
                <h3 className="block-label text-[1.15rem] md:text-[1.35rem]">{g.group}</h3>
                <p className="mt-2 max-w-xs text-[0.86rem] leading-[1.6] text-invert-fg/60">
                  {g.note}
                </p>
              </div>

              <ul className="mt-1 space-y-2.5 md:mt-0">
                {g.items.map((item) => (
                  <li key={item} className="flex items-baseline gap-3">
                    <span className="hud-lg shrink-0 text-invert-fg">{item}</span>
                    <span
                      data-leader
                      className="h-px min-w-0 flex-1 translate-y-[-3px]"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, color-mix(in oklab, var(--color-invert-fg) 42%, transparent) 0 2px, transparent 2px 6px)',
                        backgroundSize: '6px 1px',
                      }}
                    />
                    <Sparkle size={7} className="shrink-0 translate-y-[-3px] text-signal-dim" />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="hud mt-8 max-w-md text-invert-fg/45">
          Pulled once, on the one sheet that contradicts the rest of the
          archive — whichever way round the archive happens to be printed.
        </p>
      </div>
    </section>
  );
}
