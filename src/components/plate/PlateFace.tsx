import { useMemo } from 'react';

/** Deterministic PRNG — each plate face is stable across renders. */
function seeded(seed: number) {
  let s = seed * 2654435761;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

/**
 * The face of a plate: an authored technical readout drawn in the archive's
 * own grammar — waveform, block matrix, barcode, tick scale. Generated from
 * the plate's index so it is specific to that plate and never repeats.
 * Decorative; the plate's real facts sit in the prose beside it.
 */
export function PlateFace({ seed, className = '' }: { seed: number; className?: string }) {
  const art = useMemo(() => {
    const r = seeded(seed + 17);
    const W = 400;
    const H = 260;

    // waveform — a filtered signal trace across the full width
    const pts: string[] = [];
    let y = H * 0.55;
    for (let x = 0; x <= W; x += 4) {
      const env = Math.sin((x / W) * Math.PI) ** 0.6;
      y += (r() - 0.5) * 26 * env;
      y = Math.max(H * 0.18, Math.min(H * 0.9, y * 0.86 + H * 0.55 * 0.14));
      pts.push(`${x},${y.toFixed(1)}`);
    }

    // block matrix — 14×5 fill map
    const blocks: { x: number; y: number; on: number }[] = [];
    for (let by = 0; by < 5; by++)
      for (let bx = 0; bx < 14; bx++) blocks.push({ x: bx, y: by, on: r() });

    // barcode strip
    const bars: { x: number; w: number }[] = [];
    let bx = 0;
    while (bx < 128) {
      const w = 1 + Math.floor(r() * 4);
      if (r() > 0.42) bars.push({ x: bx, w });
      bx += w + 1 + Math.floor(r() * 3);
    }

    return { W, H, line: pts.join(' '), blocks, bars };
  }, [seed]);

  return (
    <svg
      viewBox={`0 0 ${art.W} ${art.H}`}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* ground grid */}
      <g stroke="var(--color-line)" strokeWidth="0.5">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={art.H} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 52} x2={art.W} y2={i * 52} />
        ))}
      </g>

      {/* tick scale, left edge */}
      <g stroke="var(--color-signal-dim)" strokeWidth="0.8">
        {Array.from({ length: 21 }, (_, i) => (
          <line key={i} x1={6} y1={8 + i * 12} x2={i % 5 === 0 ? 18 : 11} y2={8 + i * 12} />
        ))}
      </g>

      {/* block matrix */}
      <g transform="translate(232, 22)">
        {art.blocks.map((b, i) => (
          <rect
            key={i}
            x={b.x * 11}
            y={b.y * 11}
            width={9}
            height={9}
            fill={b.on > 0.72 ? 'var(--color-signal)' : 'none'}
            stroke={b.on > 0.72 ? 'none' : 'var(--color-line)'}
            strokeWidth="0.6"
            opacity={b.on > 0.72 ? 0.35 + b.on * 0.6 : 1}
          />
        ))}
      </g>

      {/* signal trace */}
      <polyline
        points={art.line}
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="1.4"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {/* barcode */}
      <g transform="translate(24, 226)" fill="var(--color-fg-3)">
        {art.bars.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={14} />
        ))}
      </g>

      {/* corner reticle */}
      <g stroke="var(--color-signal)" strokeWidth="1" fill="none">
        <path d="M372 214 h16 v-16" />
        <circle cx="380" cy="206" r="3.2" />
      </g>
    </svg>
  );
}
