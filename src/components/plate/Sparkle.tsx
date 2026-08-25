import type { CSSProperties } from 'react';

/** The archive's only icon: a four-point registration star (refs #1–#3). */
export function Sparkle({
  size = 12,
  className = '',
  style,
  weight = 0.42,
}: {
  size?: number | string;
  className?: string;
  style?: CSSProperties;
  /** 0 = needle-thin cross, 1 = fat diamond. */
  weight?: number;
}) {
  const c = 50;
  const r = 50;
  const k = c - r * weight;
  const j = 100 - k; // k mirrored past centre — every curve past the first needs it
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ overflow: 'visible', ...style }}
    >
      <path
        d={`M${c} 0 C${c} ${k} ${k} ${c} 0 ${c} C${k} ${c} ${c} ${j} ${c} 100 C${c} ${j} ${j} ${c} 100 ${c} C${j} ${c} ${c} ${k} ${c} 0 Z`}
        fill="currentColor"
      />
    </svg>
  );
}
