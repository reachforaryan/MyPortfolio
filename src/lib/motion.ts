import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger };

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const easeOutExpo = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/** The live instance, so navigation can drive the same scroll the wheel does. */
let lenis: Lenis | null = null;

/** Smooth scroll, driven off GSAP's ticker so ScrollTrigger stays in phase. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    lenis = new Lenis({
      duration: 1.15,
      easing: easeOutExpo,
      touchMultiplier: 1.6,
    });
    const instance = lenis;

    instance.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);
}

/**
 * Navigate to a plate. Lenis owns the scroll, so an anchor's native jump would
 * snap past its animation — callers preventDefault and come here instead.
 * Without Lenis (reduced motion) it is a plain jump, which is the point.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  if (lenis) lenis.scrollTo(el, { duration: 0.9, easing: easeOutExpo });
  else el.scrollIntoView({ behavior: 'auto' });

  history.replaceState(null, '', `#${id}`);
  // Keyboard users land in the section they asked for, not back at the top.
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
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
  setup: (ctx: { scope: HTMLElement }) => void | (() => void),
  scope: RefObject<HTMLElement | null>,
  deps: unknown[] = []
) {
  useGSAP(
    () => {
      // Returning setup's cleanup: gsap.context collects it and runs it on revert.
      if (scope.current) return setup({ scope: scope.current });
    },
    { scope: scope as RefObject<HTMLElement>, dependencies: deps }
  );
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
