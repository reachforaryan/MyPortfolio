import { useRef } from 'react';
import { CERTIFICATIONS, TRAJECTORY } from '../content';
import { SectionHead } from '../components/plate/SectionHead';
import { Sparkle } from '../components/plate/Sparkle';
import { gsap, useGsap, prefersReducedMotion } from '../lib/motion';

/**
 * Ref #3's atmospheric strata scale, re-read as a career. The axis fills as
 * you descend and each node lights when its stratum is reached — altitude is
 * the metaphor, scroll is the altimeter.
 */
export function Trajectory() {
  const root = useRef<HTMLElement>(null);

  useGsap(
    ({ scope }) => {
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        '[data-axis-fill]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: '[data-scale]', start: 'top 62%', end: 'bottom 78%', scrub: 0.4 },
        }
      );

      gsap.utils.toArray<HTMLElement>('[data-stratum]', scope).forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 76%', once: true } })
          .from(row.querySelector('[data-node]'), {
            scale: 0,
            rotate: -90,
            duration: 0.6,
            ease: 'back.out(2.4)',
          })
          .from(
            row.querySelectorAll('[data-stratum-fade]'),
            { opacity: 0, x: 20, duration: 0.65, stagger: 0.07, ease: 'power3.out' },
            '-=0.4'
          )
          .from(row.querySelector('[data-tick]'), { scaleX: 0, duration: 0.5, ease: 'power3.inOut' }, '-=0.5');
      });
    },
    root,
    []
  );

  return (
    <section
      ref={root}
      id="trajectory"
      className="relative isolate border-t border-line px-4 py-20 sm:px-8 xl:px-24 sm:py-24 lg:py-32"
      aria-label="Trajectory"
    >
      <div aria-hidden="true" className="scanlines pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <SectionHead n="03" kicker="Trajectory" right="Read downward — altitude is time" />

      <div data-scale className="relative mx-auto mt-14 max-w-6xl lg:mt-20">
        {/* the axis */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[calc(var(--spacing)*10)] w-px bg-line sm:left-32"
        >
          <div data-axis-fill className="absolute inset-0 origin-top bg-signal-dim" />
        </div>

        <ol>
          {TRAJECTORY.map((s) => (
            <li
              key={s.n}
              data-stratum
              className="relative grid grid-cols-[minmax(0,1fr)] gap-x-8 py-9 pl-16 sm:grid-cols-[minmax(0,7rem)_minmax(0,1fr)_minmax(0,9.5rem)] sm:pl-0 lg:py-12"
            >
              {/* stratum label, left of the axis */}
              <div className="hidden text-right sm:block">
                <div data-stratum-fade className="hud-lg text-fg">{s.layer}</div>
                <div data-stratum-fade className="hud mt-1.5 text-signal-dim">[{s.n}]</div>
              </div>

              {/* node on the axis */}
              <span
                data-node
                aria-hidden="true"
                className="absolute top-[2.9rem] left-[calc(var(--spacing)*10)] z-10 -translate-x-1/2 -translate-y-1/2 bg-ground text-signal sm:left-32 lg:top-[3.7rem]"
              >
                <Sparkle size={26} weight={0.34} />
              </span>

              {/* the entry */}
              <div className="relative pl-0 sm:pl-10">
                <span
                  data-tick
                  aria-hidden="true"
                  className="absolute top-[1.15rem] left-0 hidden h-px w-7 origin-left bg-signal-dim sm:block"
                />
                <div data-stratum-fade className="hud mb-2 flex items-center gap-3 text-signal">
                  <span>{s.year}</span>
                  <span className="h-px w-6 bg-signal-dim" />
                  <span className="text-fg-3 sm:hidden">{s.layer}</span>
                </div>
                <h3
                  data-stratum-fade
                  className="display display-sm text-[clamp(1.5rem,3.6vw,2.4rem)] leading-[1.05] text-fg"
                >
                  {s.title}
                </h3>
                <p data-stratum-fade className="hud-lg mt-2.5 text-fg-2">
                  {s.org}
                </p>
                <p
                  data-stratum-fade
                  className="mt-4 max-w-xl text-pretty text-[0.95rem] leading-[1.7] text-fg-3"
                >
                  {s.note}
                </p>
              </div>

              {/* right rail: the altitude readout, ref #3's instrument scale */}
              <div data-stratum-fade className="hidden self-start pt-1 sm:block">
                <div className="hud mb-2 text-fg-3">Altitude</div>
                <div className="hud-lg whitespace-nowrap text-fg-2">{s.band}</div>
                <div aria-hidden="true" className="mt-3.5 flex items-start gap-1.5">
                  {Array.from({ length: 15 }, (_, k) => (
                    <span
                      key={k}
                      className={`block w-px ${k % 5 === 0 ? 'h-4 bg-signal' : 'h-2 bg-fg-3'}`}
                    />
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="hud mt-2 pl-16 text-fg-3 sm:pl-[calc(8rem+2.5rem)]">
          Ground level — where the habit started
        </div>

        {/* certifications, filed at the foot of the scale */}
        <div className="mt-16 pl-16 sm:pl-[calc(8rem+2.5rem)]">
          <div className="hud mb-4 flex items-center gap-2 text-signal">
            <Sparkle size={8} />
            Certifications
          </div>
          <ul className="max-w-2xl">
            {CERTIFICATIONS.map((c) => (
              <li
                key={c}
                className="hud-lg flex items-baseline gap-3 border-t border-line py-3.5 text-fg-2 last:border-b"
              >
                <span className="text-signal-dim">◇</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
