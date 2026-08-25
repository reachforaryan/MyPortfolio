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
