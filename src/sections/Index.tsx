import { useRef, useState } from 'react';
import { PROJECTS } from '../content';
import { SectionHead } from '../components/plate/SectionHead';
import { Registration } from '../components/plate/PlateFrame';
import { Sparkle } from '../components/plate/Sparkle';
import { gsap, useGsap, prefersReducedMotion } from '../lib/motion';

export function Index() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  useGsap(
    ({ scope }) => {
      if (prefersReducedMotion()) return;

      /* Elements resolved up front and the trigger pinned to the section
         itself. The selector-string form — gsap.from('[data-row]') with a
         scrollTrigger pointing at a different selector — created its
         ScrollTrigger during another section's refresh pass and corrupted
         ScrollTrigger's internal trigger list, taking the whole tree down. */
      const rows = gsap.utils.toArray<HTMLElement>('[data-row]', scope);
      if (rows.length) {
        gsap
          .timeline({ scrollTrigger: { trigger: scope, start: 'top 70%', once: true } })
          .from(rows, {
            opacity: 0,
            yPercent: 60,
            duration: 0.8,
            stagger: 0.07,
            ease: 'expo.out',
          });
      }

      // The preview plate trails the pointer across the list.
      const el = preview.current;
      if (!el) return;
      const setX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      const setY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
      const onMove = (e: PointerEvent) => {
        const box = scope.getBoundingClientRect();
        // sits beside the pointer, never on the row being read
        setX(e.clientX - box.left + 230);
        setY(e.clientY - box.top);
      };
      scope.addEventListener('pointermove', onMove, { passive: true });
      return () => scope.removeEventListener('pointermove', onMove);
    },
    root,
    []
  );

  const active = hover === null ? null : PROJECTS[hover];

  return (
    <section
      ref={root}
      id="index"
      className="relative isolate border-t border-line bg-surface px-4 py-20 sm:px-8 xl:px-24 sm:py-24 lg:py-32"
      aria-label="Index of plates"
    >
      <div aria-hidden="true" className="halftone pointer-events-none absolute inset-0 -z-10 text-line opacity-25" />
      <SectionHead n="04" kicker="**not an exhaustive list" right="Five plates catalogued" />

      <ol data-list className="mt-10 lg:mt-14" onPointerLeave={() => setHover(null)}>
        {PROJECTS.map((p, i) => (
          <li key={p.n} data-row className="overflow-hidden">
            <a
              href={`#plate-${p.n}`}
              onPointerEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              className="group relative flex items-baseline gap-4 border-t border-line py-5 transition-colors duration-500 last:border-b hover:border-signal-dim focus-visible:border-signal sm:gap-8 sm:py-7"
            >
              {/* wash that fills the row on approach */}
              <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-signal transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100" />

              <span className="hud w-8 shrink-0 text-signal-dim transition-colors duration-300 group-hover:text-signal">
                [{p.n}]
              </span>

              <span className="display min-w-0 flex-1 text-[clamp(1.6rem,5.6vw,3.6rem)] leading-[0.95] text-fg transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-2 group-focus-visible:translate-x-2">
                {p.title}
              </span>

              <span className="hud hidden shrink-0 text-fg-2 transition-colors duration-300 group-hover:text-fg md:block">
                {p.kind}
              </span>
              <span className="hud hidden w-56 shrink-0 text-right whitespace-nowrap text-fg-3 xl:block">
                {p.field}
              </span>
              <span className="hidden shrink-0 text-signal opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
                <Sparkle size={11} />
              </span>
            </a>
          </li>
        ))}
      </ol>

      {/* ── pointer-trailing preview plate ──────────────────────────── */}
      <div
        ref={preview}
        aria-hidden="true"
        className={`pointer-events-none absolute top-0 left-0 z-40 hidden w-64 -translate-x-1/2 -translate-y-1/2 lg:block ${
          active ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-300`}
      >
        <div className="relative border border-signal-dim/70 bg-surface p-4">
          <Registration className="text-signal" inset={-1} size={10} />
          {active && (
            <>
              <div className="display display-sm mb-3 text-[3.4rem] leading-none text-signal/35">{active.n}</div>
              <div className="hud mb-3 text-fg-2">{active.kind}</div>
              <dl className="mb-4 space-y-1.5">
                {active.readouts.map((m) => (
                  <div key={m.label} className="flex items-baseline justify-between gap-3">
                    <dt className="hud shrink-0 text-fg-3">{m.label}</dt>
                    <dd className="hud-lg text-right text-fg">
                      {m.value}
                      {m.suffix ?? ''}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="rule-dotted mb-2.5" />
              <div className="hud flex flex-wrap gap-x-2 gap-y-1 text-signal-dim">
                {active.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
