import type { Theme } from '../lib/theme';

/**
 * A printer's density patch: half the disc inked, half left as paper. Sized
 * to the page's left gutter so it never crowds a section's content column;
 * the state labels slide out on hover rather than living there permanently.
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
      className={`group relative flex size-9 items-center justify-center border border-line bg-ground transition-colors duration-300 hover:border-signal ${className}`}
    >
      <span className="relative block size-4 overflow-hidden rounded-full border border-signal">
        {/* the inked half rotates round as the plate changes state */}
        <span
          className="absolute inset-0 bg-signal transition-transform duration-500 ease-[var(--ease-plate)]"
          style={{
            clipPath: 'inset(0 50% 0 0)',
            transform: paper ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </span>
      <span className="hud pointer-events-none absolute bottom-full left-0 mb-1.5 whitespace-nowrap text-fg-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        {paper ? 'Paper' : 'Ink'}
      </span>
    </button>
  );
}
