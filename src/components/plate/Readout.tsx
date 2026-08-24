import { useEffect, useRef, useSyncExternalStore } from 'react';
import { prefersReducedMotion } from '../../lib/motion';

const mq = () =>
  typeof window === 'undefined' ? null : window.matchMedia('(prefers-reduced-motion: reduce)');

const subscribe = (cb: () => void) => {
  const m = mq();
  m?.addEventListener('change', cb);
  return () => m?.removeEventListener('change', cb);
};

/** Live `prefers-reduced-motion`, so a mid-session toggle is respected. */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => mq()?.matches ?? false,
    () => false
  );
}

/**
 * A readout states a fact. When that fact is a measured number the interface
 * counts up to it as the plate arrives; when it is not, the fact is simply
 * printed — never dressed up as a metric it isn't.
 *
 * Deliberately NOT on ScrollTrigger. A `once: true` trigger fires only on a
 * downward crossing, so a reader landing mid-page finds every readout above
 * them frozen at zero; and under StrictMode the context revert between the
 * two mount passes killed the tween before its first tick. An
 * IntersectionObserver has neither problem: it reports the element's actual
 * state on observe, whichever side of the fold it starts on.
 */
export function Readout({
  value,
  suffix = '',
  className = '',
}: {
  value: number | string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const numeric = typeof value === 'number';

  useEffect(() => {
    const target = ref.current?.querySelector('[data-count]');
    if (!target || !numeric) return;

    if (prefersReducedMotion()) {
      target.textContent = String(value);
      return;
    }

    let raf = 0;
    const DURATION = 1400;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          const eased = 1 - Math.pow(1 - t, 3); // power3.out
          target.textContent = String(Math.round((value as number) * eased));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(target);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, numeric, reduced]);

  return (
    <span ref={ref} className={className}>
      {numeric ? <span data-count>{reduced ? value : 0}</span> : value}
      {suffix}
    </span>
  );
}
