import { useCallback, useEffect, useRef } from 'react';

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  extraScale?: number;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  startTime: number;
}

/**
 * Vendored from reactbits.dev, rewritten in two ways.
 *
 * 1. It no longer wraps the app. Upstream renders `<div class="relative
 *    w-full h-full">` around its children with an `absolute inset-0` canvas.
 *    A <canvas> is a replaced element: with `inset-0` its used height comes
 *    from its own width/height ATTRIBUTES, not from the box, so every
 *    ResizeObserver tick fed its own growth back in and the page grew without
 *    bound. The canvas is now `fixed` and viewport-sized — it cannot
 *    participate in layout at all, and there is no observer to loop.
 * 2. Sparks are drawn as four-point stars, matching the archive's glyph.
 */
export default function ClickSpark({
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 4,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1.0,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t);
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();

    const onClick = (e: MouseEvent) => {
      const now = performance.now();
      for (let i = 0; i < sparkCount; i++) {
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / sparkCount + Math.PI / 4,
          startTime: now,
        });
      }
    };

    let raf: number;
    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      sparksRef.current = sparksRef.current.filter((s) => {
        const elapsed = t - s.startTime;
        if (elapsed >= duration) return false;

        const eased = easeFunc(elapsed / duration);
        const distance = eased * sparkRadius * extraScale;
        const len = sparkSize * (1 - eased);
        const cos = Math.cos(s.angle);
        const sin = Math.sin(s.angle);

        ctx.strokeStyle = sparkColor;
        ctx.globalAlpha = 1 - eased;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x + distance * cos, s.y + distance * sin);
        ctx.lineTo(s.x + (distance + len) * cos, s.y + (distance + len) * sin);
        ctx.stroke();
        ctx.globalAlpha = 1;

        return true;
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener('resize', resize);
    window.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('click', onClick);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easeFunc, extraScale]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[90] size-full"
    />
  );
}
