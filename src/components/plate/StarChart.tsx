import { useMemo, useRef } from 'react';
import { Sparkle } from './Sparkle';
import { gsap, useGsap, usePointer, prefersReducedMotion } from '../../lib/motion';

/** Deterministic PRNG so the chart is identical every render. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

type Star = { x: number; y: number; size: number; weight: number; opacity: number };

const LAYERS = [
  { count: 34, depth: 0.16, size: [4, 9], weight: 0.28, opacity: [0.16, 0.34] },
  { count: 18, depth: 0.42, size: [9, 18], weight: 0.36, opacity: [0.3, 0.55] },
  { count: 7, depth: 0.85, size: [22, 46], weight: 0.44, opacity: [0.55, 0.9] },
] as const;

/**
 * Three depth layers of registration stars over a drafted grid — the archive's
 * ground. Drifts on scroll and pointer; the big crosses sit on grid nodes so
 * the parallax reads as depth rather than noise.
 */
export function StarChart({ className = '' }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const pointer = usePointer(1);

  const layers = useMemo(
    () =>
      LAYERS.map((cfg, li) => {
        const rand = seeded(9973 + li * 517);
        const stars: Star[] = [];
        for (let i = 0; i < cfg.count; i++) {
          // Big stars snap to a 12.5% lattice; small ones scatter freely.
          const snap = li === 2;
          stars.push({
            x: snap ? (Math.floor(rand() * 8) + 0.5) * 12.5 : rand() * 100,
            y: snap ? (Math.floor(rand() * 6) + 0.5) * 16.6 : rand() * 100,
            size: cfg.size[0] + rand() * (cfg.size[1] - cfg.size[0]),
            weight: cfg.weight,
            opacity: cfg.opacity[0] + rand() * (cfg.opacity[1] - cfg.opacity[0]),
          });
        }
        return { ...cfg, stars };
      }),
    []
  );

  useGsap(
    ({ scope }) => {
      const nodes = gsap.utils.toArray<HTMLElement>('[data-layer]', scope);

      if (!prefersReducedMotion()) {
        // Scroll depth — deeper layers travel further.
        nodes.forEach((n, i) => {
          gsap.to(n, {
            yPercent: -14 * LAYERS[i].depth * 3,
            ease: 'none',
            scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom top', scrub: true },
          });
        });

        // Pointer depth, applied on the same ticker as the smooth scroll.
        const setters = nodes.map((n) => ({
          x: gsap.quickSetter(n, 'x', 'px'),
          y: gsap.quickSetter(n, 'y', 'px'),
        }));
        const tick = () => {
          setters.forEach((s, i) => {
            s.x(-pointer.current.x * 26 * LAYERS[i].depth);
            s.y(-pointer.current.y * 18 * LAYERS[i].depth);
          });
        };
        gsap.ticker.add(tick);

        // Slow twinkle on the foreground crosses only.
        gsap.to(gsap.utils.toArray('[data-layer="2"] > *', scope), {
          opacity: 0.25,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          stagger: { each: 0.7, from: 'random' },
        });

        return () => void gsap.ticker.remove(tick);
      }
    },
    root,
    []
  );

  return (
    <div ref={root} aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* drafted ground */}
      <div className="plate-grid absolute -inset-x-8 -inset-y-16 opacity-45" />
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          background:
            'radial-gradient(120% 80% at 50% 40%, transparent 30%, var(--color-ground) 78%)',
        }}
      />
      {layers.map((layer, li) => (
        <div key={li} data-layer={li} className="absolute inset-0 will-change-transform">
          {layer.stars.map((s, i) => (
            <span
              key={i}
              className="absolute text-signal"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                opacity: s.opacity,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Sparkle size={s.size} weight={s.weight} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
