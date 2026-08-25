import { useEffect, useRef, useState } from 'react';
import { IDENTITY } from '../content';
import { Sparkle } from './plate/Sparkle';
import { gsap, useGsap, prefersReducedMotion } from '../lib/motion';

/**
 * Plate registration: the four corner marks converge, the counter runs, and
 * the sheet lifts. Also the honest place to wait for the display face — the
 * hero's whole idea is a variable Bodoni, and it must not pop in.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, []);

  useGsap(
    ({ scope }) => {
      const finish = () => {
        document.documentElement.style.overflow = '';
        onDone();
      };

      if (prefersReducedMotion()) {
        gsap.to(scope, { autoAlpha: 0, duration: 0.25, onComplete: finish });
        return;
      }

      const counter = { v: 0 };
      const intro = new Promise<void>((resolve) => {
        gsap
          .timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => resolve() })
          .from('[data-reg]', { scale: 2.6, opacity: 0, duration: 0.7, stagger: 0.06 })
          .to(
            counter,
            {
              v: 100,
              duration: 1.5,
              ease: 'power2.inOut',
              onUpdate: () => setCount(Math.round(counter.v)),
            },
            0.15
          )
          .from('[data-pl-rule]', { scaleX: 0, duration: 1.4 }, 0.2)
          .from('[data-pl-word]', { yPercent: 110, duration: 1, ease: 'expo.out' }, 0.5);
      });

      // The hero is a variable Bodoni; the sheet does not lift until it exists.
      const fonts = document.fonts?.ready ?? Promise.resolve();
      const bail = new Promise((r) => setTimeout(r, 4000)); // never trap the page
      Promise.race([Promise.all([intro, fonts]), bail]).then(() => {
        // StrictMode tears the first mount down before this resolves; building
        // a timeline against its detached scope only warns about lost targets.
        if (!scope.isConnected) return;
        gsap
          .timeline({ onComplete: finish })
          .to('[data-pl-word], [data-pl-meta]', { opacity: 0, duration: 0.4, ease: 'power2.in' })
          .to('[data-reg]', { scale: 0.2, opacity: 0, duration: 0.45, stagger: 0.04 }, '-=0.3')
          .to(scope, { yPercent: -100, duration: 0.95, ease: 'expo.inOut' }, '-=0.15');
      });
    },
    root,
    []
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ground px-4 py-5 sm:px-8"
    >
      {/* corner registration */}
      {[
        'top-4 left-4 sm:top-6 sm:left-6',
        'top-4 right-4 sm:top-6 sm:right-6',
        'bottom-4 left-4 sm:bottom-6 sm:left-6',
        'bottom-4 right-4 sm:bottom-6 sm:right-6',
      ].map((pos) => (
        <span key={pos} data-reg className={`absolute ${pos} text-signal`}>
          <Sparkle size={16} weight={0.3} />
        </span>
      ))}

      <div data-pl-meta className="hud flex justify-between text-fg-3">
        <span>{IDENTITY.plateId}</span>
        <span>registering plate</span>
      </div>

      <div className="mx-auto w-full max-w-4xl">
        <div className="overflow-hidden text-center">
          <div data-pl-word className="display text-[clamp(2rem,7vw,5rem)] text-fg">
            {IDENTITY.first} <span className="text-signal italic">{IDENTITY.last}</span>
          </div>
        </div>
        <div data-pl-rule className="rule mt-6 origin-left" />
      </div>

      <div data-pl-meta className="hud flex items-end justify-between text-fg-3">
        <span>specimen archive</span>
        <span className="display text-[clamp(2rem,7vw,4rem)] leading-none text-signal tabular-nums">
          {String(count).padStart(3, '0')}
        </span>
      </div>
    </div>
  );
}
