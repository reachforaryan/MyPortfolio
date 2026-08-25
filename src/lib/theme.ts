import { useCallback, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

export type Theme = 'ink' | 'paper';

const KEY = 'archive-theme';

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

  /*
   * The whole page re-inks at once. Transitioning colour on every element was
   * a repaint storm that landed in pieces; a view transition hands the browser
   * one before-and-after snapshot to cross-fade on the compositor instead.
   * flushSync is what puts React's re-render inside the callback, so the
   * "after" snapshot is taken with the new state already applied.
   */
  const toggle = useCallback(() => {
    const apply = () =>
      flushSync(() => {
        current = current === 'ink' ? 'paper' : 'ink';
        document.documentElement.setAttribute('data-theme', current);
        document
          .querySelector('meta[name=theme-color]')
          ?.setAttribute('content', current === 'paper' ? '#ded8cb' : '#0B0B0E');
        localStorage.setItem(KEY, current);
        listeners.forEach((cb) => cb());
      });

    if (document.startViewTransition) document.startViewTransition(apply);
    else apply();
  }, []);

  return { theme, toggle };
}
