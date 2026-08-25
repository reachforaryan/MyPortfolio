import { useRef, useState } from 'react';
import { gsap, useGsap, prefersReducedMotion } from '../../lib/motion';

export type Callout = {
  id: string;
  /** Anchor point as a percentage of the annotated box. */
  x: number;
  y: number;
  label: string;
  value: string;
};

/**
 * The archive's signature behaviour: hairline leader lines that draw
 * themselves from an anchor point out to a tethered label, and light when
 * the pointer comes near. Absolutely fills its nearest positioned ancestor.
 * Decorative — every fact it shows is also in the section's prose.
 */
export function Annotations({
  items,
  className = '',
  backdrop = false,
}: {
  items: Callout[];
  className?: string;
  /** Ink plate behind each label — for annotating a busy image. */
  backdrop?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useGsap(
    ({ scope }) => {
      if (prefersReducedMotion()) return;
      const marks = gsap.utils.toArray<HTMLElement>('[data-mark]', scope);
      const runs = gsap.utils.toArray<HTMLElement>('[data-run]', scope);
      const tags = gsap.utils.toArray<HTMLElement>('[data-tag]', scope);

      gsap.set(marks, { scale: 0, opacity: 0 });
      gsap.set(runs, { scaleX: 0 });
      gsap.set(tags, { opacity: 0 });

      const tl = gsap
        .timeline({ paused: true })
        .to(marks, { scale: 1, opacity: 1, duration: 0.45, stagger: 0.1, ease: 'back.out(2.2)' })
        .to(runs, { scaleX: 1, duration: 0.55, stagger: 0.1, ease: 'power3.inOut' }, '-=0.4')
        .to(tags, { opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, '-=0.35');

      /*
       * Deliberately NOT on ScrollTrigger — the same trap Readout documents. A
       * `once: true` trigger fires only on a downward crossing, so arriving at
       * a plate from a #plate link and scrolling back up left every callout
       * above stuck at opacity 0, drawn but invisible. An IntersectionObserver
       * reports the element's real state on observe, whichever side it starts.
       */
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          tl.play();
        },
        { rootMargin: '0px 0px -12% 0px' }
      );
      io.observe(scope);
      return () => io.disconnect();
    },
    root,
    [items]
  );

  const onMove = (e: React.PointerEvent) => {
    const box = root.current?.getBoundingClientRect();
    if (!box) return;
    const px = ((e.clientX - box.left) / box.width) * 100;
    const py = ((e.clientY - box.top) / box.height) * 100;
    const aspect = box.height / box.width;
    let best: string | null = null;
    let bestD = 22;
    for (const it of items) {
      const d = Math.hypot(it.x - px, (it.y - py) * aspect);
      if (d < bestD) {
        bestD = d;
        best = it.id;
      }
    }
    setActive(best);
  };

  return (
    <div
      ref={root}
      aria-hidden="true"
      onPointerMove={onMove}
      onPointerLeave={() => setActive(null)}
      className={`pointer-events-auto absolute inset-0 z-20 ${className}`}
    >
      {items.map((it) => {
        const toLeft = it.x > 50;
        const on = active === it.id;
        const markCls = `block size-[7px] shrink-0 rounded-full border transition-colors duration-300 ${
          on ? 'border-signal-lift bg-signal-lift' : 'border-signal bg-ground'
        }`;
        const runCls = `block h-px min-w-0 flex-1 transition-colors duration-300 ${
          on ? 'bg-signal-lift' : 'bg-signal-dim'
        }`;
        const tag = (
          <div
            data-tag
            className={`shrink-0 ${toLeft ? 'pr-2.5 text-right' : 'pl-2.5'} ${
              backdrop ? 'bg-ground/85 px-2 py-1 backdrop-blur-[2px]' : ''
            }`}
          >
            <div className={`hud transition-colors duration-300 ${on ? 'text-signal-lift' : 'text-fg-3'}`}>
              {it.label}
            </div>
            <div className={`hud-lg transition-colors duration-300 ${on ? 'text-fg' : 'text-fg-2'}`}>
              {it.value}
            </div>
          </div>
        );

        return (
          <div
            key={it.id}
            className="absolute inset-x-0 flex -translate-y-1/2 items-center"
            style={{ top: `${it.y}%` }}
          >
            {toLeft ? (
              <>
                {tag}
                <span data-run className={`${runCls} origin-right`} />
                <span data-mark className={`${markCls} -mr-[3px]`} />
                <span className="shrink-0" style={{ width: `${100 - it.x}%` }} />
              </>
            ) : (
              <>
                <span className="shrink-0" style={{ width: `${it.x}%` }} />
                <span data-mark className={`${markCls} -ml-[3px]`} />
                <span data-run className={`${runCls} origin-left`} />
                {tag}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
