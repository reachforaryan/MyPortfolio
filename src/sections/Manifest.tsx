import { useRef } from 'react';
import { MANIFEST } from '../content';
import { Annotations } from '../components/plate/Annotations';
import { Registration } from '../components/plate/PlateFrame';
import { SectionHead } from '../components/plate/SectionHead';
import { Sparkle } from '../components/plate/Sparkle';
import { useTheme } from '../lib/theme';
import { Readout, useReducedMotion } from '../components/plate/Readout';
import { gsap, useGsap, prefersReducedMotion } from '../lib/motion';
/* Imported statically on purpose. As a lazy chunk it resolved mid-mount and
   re-ran this subtree's ScrollTriggers while a sibling section's were still
   initialising, corrupting ScrollTrigger's internal list and taking the whole
   tree down. 17 KB gzip is not worth that race. */
import HalftoneReveal from '../components/reactbits/HalftoneReveal';
import ScrollReveal from '../components/reactbits/ScrollReveal';

export function Manifest() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { theme } = useTheme();

  useGsap(
    ({ scope }) => {
      if (prefersReducedMotion()) return;
      // The plate drifts against the text column — the page's core parallax.
      gsap.to('[data-drift]', {
        yPercent: -13,
        ease: 'none',
        scrollTrigger: { trigger: scope, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
      gsap.from('[data-stat]', {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '[data-stats]', start: 'top 85%', once: true },
      });
    },
    root,
    []
  );

  return (
    <section
      ref={root}
      id="manifest"
      className="relative isolate border-t border-line bg-surface px-4 py-20 sm:px-8 xl:px-24 sm:py-24 lg:py-32"
      aria-label="Manifest"
    >
      <div aria-hidden="true" className="plate-grid pointer-events-none absolute inset-0 -z-10 opacity-30" />
      <SectionHead n="02" kicker="Manifest" right="Fig. 2 — subject, annotated" />

      <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
        {/* ── the annotated specimen ──────────────────────────────────── */}
        <figure data-drift className="relative lg:sticky lg:top-24 lg:self-start">
          <div className="relative aspect-[4/5] w-full border border-line/70 bg-surface">
            <Registration className="text-signal-dim" inset={-1} size={16} />
            <HalftoneReveal
              key={theme}
              src="/specimen-placeholder.webp"
              inkColor={theme === 'paper' ? '#5f5ba8' : '#a9a6f2'}
              paperColor={theme === 'paper' ? '#ded8cb' : '#0b0b0e'}
              mode="mono"
              shape="circle"
              dotDensity={84}
              dotSize={1}
              angle={22}
              contrast={1.5}
              invert
              revealRadius={0.34}
              edge={0.72}
              idleReveal={0.14}
              trigger="hover"
              borderRadius="0px"
              className="absolute inset-0 size-full"
            />
            <Annotations items={MANIFEST.callouts} backdrop className="hidden sm:block" />
            <span className="hud absolute top-3 left-3 z-30 text-signal">{MANIFEST.specimen.fig}</span>
            <span className="hud absolute right-3 bottom-3 z-30 text-fg-3">
              {MANIFEST.specimen.spec}
            </span>
          </div>
          <figcaption className="mt-3 max-w-md">
            <div className="hud-lg mb-1.5 flex items-center gap-2 text-fg-2">
              <Sparkle size={8} className="shrink-0 text-signal" />
              {MANIFEST.specimen.title}
            </div>
            <p className="hud text-fg-3">{MANIFEST.specimen.caption}</p>
          </figcaption>
        </figure>

        {/* ── the manifest ────────────────────────────────────────────── */}
        <div className="max-w-2xl">
          {reduced ? (
            <h2 className="display text-[clamp(1.9rem,4.4vw,3.4rem)] leading-[1.05] text-fg">
              {MANIFEST.heading}
            </h2>
          ) : (
            <ScrollReveal
              baseOpacity={0.08}
              baseRotation={2}
              blurStrength={5}
              containerClassName="!my-0"
              textClassName="display !text-[clamp(1.9rem,4.4vw,3.4rem)] !leading-[1.05] !font-normal text-fg"
            >
              {MANIFEST.heading}
            </ScrollReveal>
          )}

          <div className="mt-10 space-y-6 border-l border-line pl-6 sm:pl-8">
            {MANIFEST.body.map((p, i) => (
              <p key={i} className="text-pretty text-[0.98rem] leading-[1.75] text-fg-2 sm:text-[1.05rem]">
                {p}
              </p>
            ))}
          </div>

          <blockquote className="display display-sm mt-12 max-w-xl text-[clamp(1.15rem,2.1vw,1.6rem)] leading-[1.3] text-balance text-signal italic">
            “{MANIFEST.quote}”
          </blockquote>

          <dl data-stats className="mt-14 grid grid-cols-3 gap-px border border-line bg-line">
            {MANIFEST.stats.map((s) => (
              <div data-stat key={s.label} className="bg-ground px-4 py-5 sm:px-5 sm:py-6">
                <dt className="hud mb-2 text-fg-3">{s.label}</dt>
                <dd className="display display-sm text-[clamp(1.8rem,4vw,2.8rem)] text-fg tabular-nums">
                  {s.raw ? (
                    <>
                      {s.value}
                      {s.suffix}
                    </>
                  ) : (
                    <Readout value={s.value} suffix={s.suffix} className="tabular-nums" />
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
