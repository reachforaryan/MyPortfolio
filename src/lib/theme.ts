import { useCallback, useEffect, useSyncExternalStore } from 'react';

export type Theme = 'ink' | 'paper';

const KEY = 'archive-theme';

/** Matches the inline script in index.html, which runs before first paint. */
export function readTheme(): Theme {
  const stored = localStorage.getItem(KEY);
  if (stored === 'ink' || stored === 'paper') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'paper' : 'ink';
}

/*
 * One store, not one useState per caller. Every consumer used to hold its own
 * copy seeded at mount, so toggling from the nav left every other reader — the
 * Manifest's halftone inks among them — stuck on the state it mounted with.
 * The inline script in index.html has already stamped <html> by the time this
 * module runs, so the attribute is the honest initial value.
 */
let current: Theme =
  typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'paper'
    ? 'paper'
    : 'ink';

const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

/**
 * The archive prints in two states: INK, the dark plate, and PAPER, the sheet
 * the Apparatus section always used, promoted to the whole surface. The
 * attribute lives on <html> so tokens flip in CSS and nothing re-renders for
 * a colour change — components read this only when they need the value itself.
 */
export function useTheme() {
  const theme = useSyncExternalStore(
    subscribe,
    () => current,
    () => 'ink' as Theme
  );

  useEffect(() => {
    // Colour transitions are armed only after the first paint, so the initial
    // render never animates from the wrong state.
    const id = requestAnimationFrame(() =>
      document.documentElement.setAttribute('data-theme-ready', '')
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = useCallback(() => {
    current = current === 'ink' ? 'paper' : 'ink';
    document.documentElement.setAttribute('data-theme', current);
    localStorage.setItem(KEY, current);
    listeners.forEach((cb) => cb());
  }, []);

  return { theme, toggle };
}
