import type { Theme } from '../lib/theme';

/**
 * A printer's density patch — half the disc inked, half left as paper — set in
 * a labelled pill. Both states are named on the switch so a first-time reader
 * sees what it does without hovering or guessing at an icon.
 */
export function ThemeToggle({
  theme,
  onToggle,
  className = '',
}: {
  theme: Theme;
  onToggle: () => void;
  className?: string;
}) {
  const paper = theme === 'paper';
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={paper}
      aria-label={`Plate state: ${paper ? 'paper' : 'ink'}. Switch to ${paper ? 'ink' : 'paper'}.`}
      title={paper ? 'Paper — switch to ink' : 'Ink — switch to paper'}
      className={`group flex items-center gap-2.5 border border-signal-dim bg-ground px-3 py-2 transition-colors duration-300 hover:border-signal ${className}`}
    >
      <span className="relative block size-4 shrink-0 overflow-hidden rounded-full border border-signal">
        {/* the inked half rotates round as the plate changes state */}
        <span
          className="absolute inset-0 bg-signal transition-transform duration-500 ease-[var(--ease-plate)]"
          style={{
            clipPath: 'inset(0 50% 0 0)',
            transform: paper ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </span>
      <span className="hud flex items-center gap-1.5 whitespace-nowrap">
        <span className={paper ? 'text-fg-3' : 'text-signal'}>Ink</span>
        <span aria-hidden="true" className="text-fg-3">
          ⇄
        </span>
        <span className={paper ? 'text-signal' : 'text-fg-3'}>Paper</span>
      </span>
    </button>
  );
}
