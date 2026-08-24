import { useEffect, useRef, useState, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smooth scroll, driven off GSAP's ticker so ScrollTrigger stays in phase. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
}

/**
 * Scoped GSAP — every tween and trigger inside is reverted on unmount.
 *
 * This delegates to GSAP's own `useGSAP` rather than a hand-rolled
 * `gsap.context` in `useLayoutEffect`. Under React StrictMode the hand-rolled
 * version reverted one component's context while another was mid-refresh, and
 * ScrollTrigger's internal `_triggers` array was mutated underneath its own
 * loop — surfacing as `Cannot read properties of undefined (reading 'end')`
 * and taking the whole tree down with it. useGSAP exists to sequence exactly
 * this correctly.
 */
export function useGsap(
  setup: (ctx: { scope: HTMLElement }) => void,
  scope: RefObject<HTMLElement | null>,
  deps: unknown[] = []
) {
  useGSAP(
    () => {
      if (scope.current) setup({ scope: scope.current });
    },
    { scope: scope as RefObject<HTMLElement>, dependencies: deps }
  );
}

/** True once the element has entered the viewport — gates expensive canvases. */
export function useInView<T extends Element>(margin = '200px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: margin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return [ref, inView] as const;
}

/** Normalised pointer position (-1..1) with a lerp, for parallax depth. */
export function usePointer(strength = 1) {
  const value = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const target = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2 * strength;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2 * strength;
    };

    const tick = () => {
      value.current.x += (target.x - value.current.x) * 0.06;
      value.current.y += (target.y - value.current.y) * 0.06;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      gsap.ticker.remove(tick);
    };
  }, [strength]);

  return value;
}
