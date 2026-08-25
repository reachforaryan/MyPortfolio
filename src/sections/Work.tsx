import { useRef, useState } from 'react';
import { PROJECTS } from '../content';
import { SectionHead } from '../components/plate/SectionHead';
import { Registration } from '../components/plate/PlateFrame';
import { PlateFace } from '../components/plate/PlateFace';
import { Sparkle } from '../components/plate/Sparkle';
import { gsap, useGsap, prefersReducedMotion } from '../lib/motion';
import { Readout } from '../components/plate/Readout';

export function Work() {
  const root = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);

  useGsap(
    ({ scope }) => {
      const plates = gsap.utils.toArray<HTMLElement>('[data-plate]', scope);

      // Which plate owns the rail right now.
      plates.forEach((plate, i) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: plate,
            start: 'top 55%',
            end: 'bottom 55%',
            onToggle: ({ isActive }) => isActive && setCurrent(i),
          },
        });
      });

      if (prefersReducedMotion()) return;

      plates.forEach((plate) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: plate, start: 'top 78%', once: true },
        });
        tl.from(plate.querySelectorAll('[data-plate-line]'), {
          yPercent: 105,
          duration: 1,
          stagger: 0.08,
          ease: 'expo.out',
        })
          .from(
            plate.querySelectorAll('[data-plate-fade]'),
            { opacity: 0, y: 14, duration: 0.7, stagger: 0.06, ease: 'power2.out' },
            '-=0.7'
          )
          .from(
            plate.querySelector('[data-plate-face]'),
            { opacity: 0, clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'power3.inOut' },
            '-=0.9'
          );

        // The face drifts against its own text — depth without motion sickness.
        gsap.to(plate.querySelector('[data-plate-face]'), {
          yPercent: -9,
          ease: 'none',
          scrollTrigger: { trigger: plate, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
        });
      });

      // Rail progress hairline.
      gsap.fromTo(
        '[data-rail-progress]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: scope, start: 'top center', end: 'bottom bottom', scrub: true },
        }
      );
    },
    root,
    []
  );

  return (
    <section ref={root} id="work" className="relative isolate border-t border-line px-4 pb-8 sm:px-8 xl:px-24" aria-label="Plates">
      <div className="pt-10 pb-4">
        <SectionHead n="05" kicker="The plates" right="Ordered by recency" />
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,190px)_minmax(0,1fr)] lg:gap-12 xl:gap-20">
        {/* ── the rail: giant current numeral, ref #3 ────────────────── */}
        <aside className="sticky top-0 z-10 hidden h-svh flex-col justify-between self-start py-14 lg:flex">
          <div className="hud marginalia-up text-fg-3">Plate index</div>

          <div className="relative -ml-1">
            <div
              key={current}
              className="display animate-[railin_.6s_cubic-bezier(.22,1,.36,1)] text-[10rem] leading-[0.78] text-signal/85 xl:text-[13rem]"
            >
              {PROJECTS[current].n}
            </div>
            <div className="hud-lg mt-3 max-w-[10rem] text-fg-2">{PROJECTS[current].kind}</div>
          </div>

          <div className="flex items-end gap-4">
            <div className="relative h-40 w-px bg-line">
              <div data-rail-progress className="absolute inset-x-0 top-0 h-full origin-top bg-signal" />
            </div>
            <div className="hud text-fg-3">
              {PROJECTS[current].n} / {String(PROJECTS.length).padStart(2, '0')}
            </div>
          </div>
        </aside>

        {/* ── the plates ─────────────────────────────────────────────── */}
        <ol>
          {PROJECTS.map((p, i) => (
            <li
              key={p.n}
              id={`plate-${p.n}`}
              data-plate
              className="scroll-mt-16 border-t border-line py-16 first:border-t-0 sm:py-24 lg:py-28"
            >
              <article className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.78fr)] md:gap-12">
                <div className="order-2 md:order-1">
                  <div data-plate-fade className="hud mb-5 flex flex-wrap items-center gap-3 text-fg-3">
                    <span className="text-signal">[{p.n}]</span>
                    <span className="h-px w-8 bg-line" />
                    <span>{p.kind}</span>
                    <span className="text-fg-2">·</span>
                    <span>{p.field}</span>
                  </div>

                  <h3 className="overflow-hidden">
                    <span
                      data-plate-line
                      className="display block text-[clamp(2.4rem,7.5vw,5rem)] leading-[0.92] text-fg"
                    >
                      {p.title}
                    </span>
                  </h3>

                  <p
                    data-plate-fade
                    className="mt-6 max-w-xl text-pretty text-[1rem] leading-[1.7] text-fg-2 sm:text-[1.08rem]"
                  >
                    {p.summary}
                  </p>

                  <p
                    data-plate-fade
                    className="mt-6 max-w-xl border-l border-signal-dim/50 pl-5 text-pretty text-[0.9rem] leading-[1.75] text-fg-3"
                  >
                    {p.detail}
                  </p>

                  <dl data-plate-fade className="mt-9 flex flex-wrap gap-x-10 gap-y-5">
                    {p.readouts.map((m) => (
                      <div key={m.label}>
                        <dd className="display display-sm text-[clamp(1.4rem,3vw,2.1rem)] leading-none text-signal">
                          <Readout value={m.value} suffix={m.suffix} />
                        </dd>
                        <dt className="hud mt-2 text-fg-3">{m.label}</dt>
                      </div>
                    ))}
                  </dl>

                  <ul data-plate-fade className="mt-9 flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <li
                        key={s}
                        className="hud border border-line px-2.5 py-1.5 text-fg-2 transition-colors duration-300 hover:border-signal-dim hover:text-signal"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* the plate's own face */}
                <div data-plate-face className="order-1 md:order-2 md:pt-1">
                  <div className="relative border border-line/70 bg-surface p-5">
                    <Registration className="text-signal-dim" inset={-1} size={13} />
                    <div className="hud mb-4 flex items-center justify-between text-fg-3">
                      <span className="flex items-center gap-1.5 text-signal">
                        <Sparkle size={7} /> FIG. {p.n}
                      </span>
                      <span>readout</span>
                    </div>
                    <PlateFace seed={i * 91 + 7} face={p.face} className="w-full" />
                    <div className="rule-dotted my-4" />
                    <p className="hud text-fg-3">
                      {p.title} · {p.field}
                    </p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>

      <style>{`@keyframes railin { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }`}</style>
    </section>
  );
}
