import type { ReactNode } from 'react';

/** Bracketed corner registration marks — every plate in the archive wears them. */
export function Registration({
  className = '',
  size = 14,
  inset = 0,
}: {
  className?: string;
  size?: number;
  inset?: number;
}) {
  const corners = [
    { k: 'tl', style: { top: inset, left: inset }, d: `M0 ${size} V0 H${size}` },
    { k: 'tr', style: { top: inset, right: inset }, d: `M${size} ${size} V0 H0` },
    { k: 'bl', style: { bottom: inset, left: inset }, d: `M0 0 V${size} H${size}` },
    { k: 'br', style: { bottom: inset, right: inset }, d: `M${size} 0 V${size} H0` },
  ];
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {corners.map((c) => (
        <svg
          key={c.k}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute"
          style={c.style}
        >
          <path d={c.d} fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      ))}
    </div>
  );
}

/** Plate wrapper: hairline border, registration marks, optional index + caption. */
export function Plate({
  children,
  n,
  caption,
  className = '',
  frameClass = 'text-line',
}: {
  children: ReactNode;
  n?: string;
  caption?: string;
  className?: string;
  frameClass?: string;
}) {
  return (
    <figure className={`relative ${className}`}>
      <div className="relative border border-line/70">
        <Registration className={frameClass} inset={-1} />
        {n && (
          <span className="hud absolute -top-px left-3 z-10 -translate-y-1/2 bg-ground px-1.5 text-signal-dim">
            {n}
          </span>
        )}
        {children}
      </div>
      {caption && (
        <figcaption className="hud mt-3 text-fg-3">
          <span className="text-signal-dim">◇</span> {caption}
        </figcaption>
      )}
    </figure>
  );
}
