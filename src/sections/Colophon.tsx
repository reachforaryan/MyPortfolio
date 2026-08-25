import { useRef } from 'react';
import { COLOPHON, CONTACT, IDENTITY } from '../content';
import { SectionHead } from '../components/plate/SectionHead';
import { Sparkle } from '../components/plate/Sparkle';
import { gsap, useGsap, prefersReducedMotion } from '../lib/motion';
import Magnet from '../components/reactbits/Magnet';
import { openContact } from '../components/ContactPlate';

export function Colophon() {
  const root = useRef<HTMLElement>(null);

  useGsap(
    ({ scope }) => {
      if (prefersReducedMotion()) return;
      gsap.from('[data-close]', {
        yPercent: 105,
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: { trigger: scope, start: 'top 72%', once: true },
      });
      gsap.from('[data-link]', {
        opacity: 0,
        y: 24,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-links]', start: 'top 88%', once: true },
      });
    },
    root,
    []
  );

  return (
    <footer
      ref={root}
      id="colophon"
      className="relative isolate overflow-hidden border-t border-line bg-surface-2 px-4 pt-20 pb-8 sm:px-8 xl:px-24 sm:pt-24 lg:pt-32"
      aria-label="Colophon"
    >
      <div aria-hidden="true" className="plate-grid pointer-events-none absolute inset-0 -z-10 opacity-25" />
      <SectionHead n="07" kicker="Colophon" right={IDENTITY.plateId} />

      <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)] lg:gap-20">
        <div>
          <h2 className="max-w-2xl">
            <span className="block overflow-hidden">
              <span
                data-close
                className="display block text-[clamp(2.8rem,9vw,6.5rem)] leading-[0.9] text-fg"
              >
                Say
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                data-close
                className="display block text-[clamp(2.8rem,9vw,6.5rem)] leading-[0.9] text-signal italic"
              >
                something
              </span>
            </span>
          </h2>

          <p className="mt-8 max-w-md text-pretty text-[1rem] leading-[1.7] text-fg-2">
            {COLOPHON.body}
          </p>

          <Magnet padding={90} magnetStrength={6} wrapperClassName="mt-10 inline-block">
            <button
              type="button"
              onClick={openContact}
              className="group inline-flex items-center gap-3 border border-signal-dim px-6 py-4 transition-colors duration-300 hover:border-signal hover:bg-signal hover:text-ground"
            >
              <Sparkle size={11} className="text-signal transition-colors group-hover:text-ground" />
              <span className="hud-lg">{CONTACT.cta}</span>
            </button>
          </Magnet>
        </div>

        {/* ── the links, as plate rows ─────────────────────────────── */}
        <ul data-links className="lg:pt-3">
          {COLOPHON.links.map((l) => (
            <li data-link key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                className="group relative flex items-baseline justify-between gap-4 overflow-hidden border-t border-line py-6 last:border-b"
              >
                {/* periwinkle fill rises on approach */}
                <span className="absolute inset-0 origin-bottom translate-y-full bg-signal transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0" />
                <span className="relative z-10 flex items-baseline gap-3 transition-colors duration-300 group-hover:text-ground group-focus-visible:text-ground">
                  <Sparkle
                    size={9}
                    className="translate-y-[-2px] text-signal transition-colors duration-300 group-hover:text-ground"
                  />
                  <span className="display display-sm text-[clamp(1.5rem,3.6vw,2.2rem)] leading-none text-fg transition-colors duration-300 group-hover:text-ground group-focus-visible:text-ground">
                    {l.label}
                  </span>
                </span>
                <span className="hud relative z-10 text-right text-fg-2 transition-colors duration-300 group-hover:text-ground/70 group-focus-visible:text-ground/70">
                  {l.value}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* ── plate footer ─────────────────────────────────────────── */}
      <div className="mt-24 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-line pt-6">
        <p className="hud max-w-sm text-fg-3">{COLOPHON.set}</p>
        <p className="hud flex items-center gap-2 text-signal-dim">
          <Sparkle size={8} />
          {IDENTITY.plateId} · MMXXVI · end of archive
        </p>
      </div>

      {/* the archive signs off */}
      <div
        aria-hidden="true"
        className="pointer-events-none mt-10 flex justify-center text-signal/[0.06] select-none"
      >
        <span className="display text-[clamp(4rem,20vw,17rem)] leading-[0.8] tracking-[0.02em] whitespace-nowrap">
          {IDENTITY.last}
        </span>
      </div>
    </footer>
  );
}
