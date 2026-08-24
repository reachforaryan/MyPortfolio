/** The archive's only icon: a four-point registration star (refs #1–#3). */
export function Sparkle({
  size = 12,
  className = '',
  weight = 0.42,
}: {
  size?: number | string;
  className?: string;
  /** 0 = needle-thin cross, 1 = fat diamond. */
  weight?: number;
}) {
  const c = 50;
  const r = 50;
  const k = c - r * weight;
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <path
        d={`M${c} 0 C${c} ${k} ${k} ${c} 0 ${c} C${k} ${c} ${c} ${k} ${c} 100 C${c} ${k} ${100 - k} ${c} 100 ${c} C${100 - k} ${c} ${c} ${100 - k} ${c} 0 Z`}
        fill="currentColor"
      />
    </svg>
  );
}
