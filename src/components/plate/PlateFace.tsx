import { useMemo } from 'react';
import type { Face } from '../../content';

const W = 400;
const H = 260;

/** Deterministic PRNG — each plate face is stable across renders. */
function seeded(seed: number) {
  let s = (seed * 2654435761) % 4294967296;
  return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
}

type Rand = () => number;

/*
 * One motif per plate, each drawn in the archive's own grammar and coloured
 * only in tokens so it re-inks with the page. The PRNG supplies the jitter, so
 * two plates never draw the same figure — but a reload draws it identically.
 */

/** 01 — a route threading the city grid, stop nodes, demand along the bottom. */
function Route(r: Rand) {
  const stops = Array.from({ length: 7 }, (_, i) => ({
    x: 46 + i * 52,
    y: 60 + Math.round(r() * 4) * 26,
  }));
  const path = stops.map((s) => `${s.x},${s.y}`).join(' ');
  const demand = Array.from({ length: 22 }, () => 6 + r() * 34);

  return (
    <g>
      <polyline
        points={path}
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="1.6"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {stops.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={i === 0 || i === stops.length - 1 ? 4.5 : 2.8}
          fill={i === 0 || i === stops.length - 1 ? 'var(--color-signal)' : 'var(--color-ground)'}
          stroke="var(--color-signal)"
          strokeWidth="1.2"
        />
      ))}
      {/* headway demand, per stop interval */}
      <g transform={`translate(28, ${H - 26})`} fill="var(--color-signal-dim)">
        {demand.map((d, i) => (
          <rect key={i} x={i * 16} y={-d} width={7} height={d} opacity={0.55 + (d / 40) * 0.45} />
        ))}
      </g>
    </g>
  );
}

/** 02 — breathing, interrupted: a periodic trace with one bracketed apnea. */
function Respiration(r: Rand) {
  const mid = H * 0.46;
  const gapStart = 172;
  const gapEnd = 244;
  const pts: string[] = [];
  for (let x = 24; x <= W - 24; x += 3) {
    const inGap = x > gapStart && x < gapEnd;
    const breath = Math.sin(x / 13) * 34 * Math.sin(x / 47) ** 2;
    const y = inGap ? mid + (r() - 0.5) * 3 : mid - breath + (r() - 0.5) * 4;
    pts.push(`${x},${y.toFixed(1)}`);
  }

  return (
    <g>
      <line x1={24} y1={mid} x2={W - 24} y2={mid} stroke="var(--color-line)" strokeDasharray="3 4" />
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {/* the event, bracketed */}
      <g stroke="var(--color-signal-lift)" strokeWidth="1.2" fill="none">
        <path d={`M${gapStart} ${mid - 52} v-10 h${gapEnd - gapStart} v10`} />
        <line x1={gapStart} y1={mid - 40} x2={gapStart} y2={mid + 40} strokeDasharray="2 5" />
        <line x1={gapEnd} y1={mid - 40} x2={gapEnd} y2={mid + 40} strokeDasharray="2 5" />
      </g>
      <text
        x={(gapStart + gapEnd) / 2}
        y={mid - 68}
        textAnchor="middle"
        fill="var(--color-signal-lift)"
        fontSize="9"
        letterSpacing="1.6"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        APNEA
      </text>
      <g transform={`translate(24, ${H - 34})`} fill="var(--color-fg-3)" opacity={0.8}>
        {Array.from({ length: 3 }, (_, i) => (
          <rect key={i} x={i * 26} y={0} width={18} height={3} />
        ))}
      </g>
    </g>
  );
}

/** 03 — latent space: a query, its radius, and what comes back. */
function Embedding(r: Rand) {
  const cx = 168;
  const cy = 124;
  const radius = 62;
  const pts = Array.from({ length: 54 }, () => {
    const x = 30 + r() * (W - 90);
    const y = 26 + r() * (H - 82);
    return { x, y, near: Math.hypot(x - cx, y - cy) < radius };
  });

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="var(--color-signal-dim)"
        strokeWidth="1"
        strokeDasharray="4 5"
      />
      {pts.map((p, i) =>
        p.near ? (
          <g key={i}>
            <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--color-signal-dim)" strokeWidth="0.6" />
            <circle cx={p.x} cy={p.y} r={3} fill="var(--color-signal)" />
          </g>
        ) : (
          <circle key={i} cx={p.x} cy={p.y} r={1.8} fill="var(--color-fg-3)" opacity={0.7} />
        )
      )}
      {/* the query itself */}
      <g stroke="var(--color-signal-lift)" strokeWidth="1.4">
        <line x1={cx - 9} y1={cy} x2={cx + 9} y2={cy} />
        <line x1={cx} y1={cy - 9} x2={cx} y2={cy + 9} />
      </g>
      {/* spectral strip — the audio the vectors came from */}
      <g transform={`translate(300, 40)`}>
        {Array.from({ length: 26 }, (_, i) => {
          const w = 10 + r() * 62;
          return <rect key={i} x={0} y={i * 7} width={w} height={4} fill="var(--color-signal)" opacity={0.18 + (w / 72) * 0.55} />;
        })}
      </g>
    </g>
  );
}

/** 04 — two identical blocks converge on one stored object. */
function Digest(r: Rand) {
  const cells = Array.from({ length: 64 }, () => r() > 0.45);
  const block = (x: number, y: number, label: string) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={78} height={54} fill="none" stroke="var(--color-signal-dim)" strokeWidth="1" />
      {cells.slice(0, 24).map((on, i) => (
        <rect
          key={i}
          x={7 + (i % 8) * 8}
          y={9 + Math.floor(i / 8) * 12}
          width={6}
          height={8}
          fill={on ? 'var(--color-signal)' : 'none'}
          stroke={on ? 'none' : 'var(--color-fg-3)'}
          strokeWidth="0.6"
          opacity={on ? 0.85 : 0.5}
        />
      ))}
      <text x={39} y={68} textAnchor="middle" fill="var(--color-fg-3)" fontSize="8" letterSpacing="1.4" style={{ fontFamily: 'var(--font-mono)' }}>
        {label}
      </text>
    </g>
  );

  return (
    <g>
      {block(30, 34, 'UPLOAD A')}
      {block(30, 138, 'UPLOAD B')}
      {/* both hash to the same digest, so only one object is stored */}
      <g stroke="var(--color-signal)" strokeWidth="1.2" fill="none">
        <path d="M112 61 H168 V161" />
        <path d="M112 165 H168" />
        <path d="M164 155 l4 6 l4 -6" fill="var(--color-signal)" stroke="none" />
        <path d="M168 113 H236" />
        <path d="M230 109 l6 4 l-6 4" fill="var(--color-signal)" stroke="none" />
      </g>
      <g transform="translate(246, 74)">
        <rect width={118} height={78} fill="none" stroke="var(--color-signal)" strokeWidth="1.4" />
        {cells.slice(24).map((on, i) => (
          <rect
            key={i}
            x={8 + (i % 10) * 11}
            y={12 + Math.floor(i / 10) * 13}
            width={8}
            height={9}
            fill={on ? 'var(--color-signal)' : 'none'}
            stroke={on ? 'none' : 'var(--color-fg-3)'}
            strokeWidth="0.6"
            opacity={on ? 0.9 : 0.5}
          />
        ))}
        <text x={59} y={94} textAnchor="middle" fill="var(--color-signal)" fontSize="8" letterSpacing="1.6" style={{ fontFamily: 'var(--font-mono)' }}>
          ONE OBJECT · SHA-256
        </text>
      </g>
    </g>
  );
}

/** 05 — nodes, orthogonal edges, and the one join that contradicts itself. */
function Graph(r: Rand) {
  const nodes = [
    { x: 34, y: 44, w: 84, h: 34, label: 'CLIENT' },
    { x: 158, y: 30, w: 84, h: 34, label: 'API' },
    { x: 158, y: 152, w: 84, h: 34, label: 'CACHE' },
    { x: 286, y: 92, w: 84, h: 34, label: 'STORE' },
  ];

  return (
    <g>
      <g stroke="var(--color-signal-dim)" strokeWidth="1.2" fill="none">
        <path d="M118 61 H138 V47 H158" />
        <path d="M242 47 H262 V109 H286" />
        <path d="M242 169 H264 V126 H286" />
      </g>
      {/* the join whose constraints contradict */}
      <g stroke="var(--color-signal-lift)" strokeWidth="1.3" fill="none" strokeDasharray="5 4">
        <path d="M118 70 H138 V169 H158" />
      </g>
      <g stroke="var(--color-signal-lift)" strokeWidth="1.4" fill="none">
        <circle cx={138} cy={119} r={7} />
        <line x1={134} y1={115} x2={142} y2={123} />
      </g>

      {nodes.map((n, i) => (
        <g key={n.label} transform={`translate(${n.x}, ${n.y})`}>
          <rect
            width={n.w}
            height={n.h}
            fill="var(--color-ground)"
            stroke={i === 3 ? 'var(--color-signal)' : 'var(--color-fg-3)'}
            strokeWidth="1.2"
          />
          <text
            x={n.w / 2}
            y={n.h / 2 + 3}
            textAnchor="middle"
            fill={i === 3 ? 'var(--color-signal)' : 'var(--color-fg-2)'}
            fontSize="9"
            letterSpacing="1.6"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {n.label}
          </text>
          {/* the ports each node exposes */}
          <g fill="var(--color-signal-dim)">
            {Array.from({ length: 2 + Math.floor(r() * 2) }, (_, k) => (
              <rect key={k} x={-2} y={8 + k * 9} width={4} height={4} />
            ))}
          </g>
        </g>
      ))}
    </g>
  );
}

const MOTIFS: Record<Face, (r: Rand) => React.ReactElement> = {
  route: Route,
  respiration: Respiration,
  embedding: Embedding,
  digest: Digest,
  graph: Graph,
};

/**
 * The face of a plate: a technical readout drawn in the archive's own grammar,
 * specific to the project it belongs to — a route, a breath, a latent space, a
 * digest, a graph. The chrome around it (grid, tick scale, barcode, reticle) is
 * shared, so the plates read as one series.
 *
 * Decorative; the plate's real facts sit in the prose beside it.
 */
export function PlateFace({
  seed,
  face,
  className = '',
}: {
  seed: number;
  face: Face;
  className?: string;
}) {
  const art = useMemo(() => {
    const r = seeded(seed + 17);
    const motif = MOTIFS[face](r);

    // barcode strip — the plate's own catalogue mark
    const bars: { x: number; w: number }[] = [];
    let bx = 0;
    while (bx < 128) {
      const w = 1 + Math.floor(r() * 4);
      if (r() > 0.42) bars.push({ x: bx, w });
      bx += w + 1 + Math.floor(r() * 3);
    }

    return { motif, bars };
  }, [seed, face]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* ground grid — present, but far below the figure */}
      <g stroke="var(--color-fg-3)" strokeWidth="0.5" opacity={0.28}>
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={H} />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 52} x2={W} y2={i * 52} />
        ))}
      </g>

      {/* tick scale, left edge */}
      <g stroke="var(--color-signal-dim)" strokeWidth="0.8">
        {Array.from({ length: 21 }, (_, i) => (
          <line key={i} x1={6} y1={8 + i * 12} x2={i % 5 === 0 ? 18 : 11} y2={8 + i * 12} />
        ))}
      </g>

      {art.motif}

      {/* barcode */}
      <g transform={`translate(24, ${H - 16})`} fill="var(--color-fg-3)">
        {art.bars.map((b, i) => (
          <rect key={i} x={b.x} y={0} width={b.w} height={10} />
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
