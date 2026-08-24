import { useCallback, useEffect, useState } from 'react';

export type Theme = 'ink' | 'paper';

const KEY = 'archive-theme';

/** Matches the inline script in index.html, which runs before first paint. */
export function readTheme(): Theme {
  const stored = localStorage.getItem(KEY);
  if (stored === 'ink' || stored === 'paper') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'paper' : 'ink';
}

/**
 * The archive prints in two states: INK, the dark plate, and PAPER, the sheet
 * the Apparatus section always used, promoted to the whole surface. The
 * attribute lives on <html> so tokens flip in CSS and nothing re-renders for
 * a colour change.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('ink');

  useEffect(() => {
    setTheme(readTheme());
    // Colour transitions are armed only after the first paint, so the initial
    // render never animates from the wrong state.
    const id = requestAnimationFrame(() =>
      document.documentElement.setAttribute('data-theme-ready', '')
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'ink' ? 'paper' : 'ink';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(KEY, next);
      return next;
    });
  }, []);

  return { theme, toggle };
}
