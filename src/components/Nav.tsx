import { useEffect, useRef, useState } from 'react';
import { SECTIONS, IDENTITY } from '../content';
import { Sparkle } from './plate/Sparkle';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../lib/theme';
import { isJumping, scrollToSection } from '../lib/motion';
import { openContact } from './ContactPlate';

/**
 * The archive's running head: a scroll-progress hairline and a right-edge
 * plate index. Both are real navigation, not decoration.
 */
export function Nav() {
  const { theme, toggle } = useTheme();
  const [active, setActive] = useState('hero');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? window.scrollY / h : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /*
   * Keep the address bar honest: it used to be written only by a nav jump, so
   * it kept claiming a plate long after the reader had scrolled past it. The
   * first run is skipped so arriving at /#work is not rewritten before the
   * browser has finished its own jump to that anchor.
   */
  const settled = useRef(false);
  useEffect(() => {
    if (!settled.current) {
      settled.current = true;
      return;
    }
    if (isJumping()) return; // the jump already wrote its destination
    const top = active === SECTIONS[0].id;
    history.replaceState(null, '', top ? location.pathname + location.search : `#${active}`);
  }, [active]);

  // The Apparatus plate always contradicts the page, so the running head
  // over it has to invert too — in either theme.
  const paper = active === 'stack';
  const dim = paper ? 'text-invert-fg/50' : 'text-fg-3';
  const sig = paper ? 'text-invert-fg' : 'text-signal';
  const rule = paper ? 'bg-invert-fg/30' : 'bg-line';

  return (
    <>
      {/* progress hairline */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-50 h-px origin-left bg-signal"
        style={{ transform: `scaleX(${progress})` }}
      />

      {/* skip link — first tab stop */}
      <a
        href="#main"
        className="hud fixed top-3 left-3 z-[60] -translate-y-24 border border-signal bg-ground px-3 py-2 text-signal transition-transform focus-visible:translate-y-0"
      >
        Skip to content
      </a>

      {/* controls: quick contact + plate state, out of every section's way */}
      <div className="fixed top-3 right-3 z-50 flex items-center gap-2 sm:top-4 sm:right-4">
        <button
          type="button"
          onClick={openContact}
          className="hud group flex items-center gap-2 border border-signal-dim bg-ground px-3 py-2 text-fg-2 transition-colors duration-300 hover:border-signal hover:text-fg"
        >
          <Sparkle size={9} className="text-signal" />
          Contact
        </button>
        <ThemeToggle theme={theme} onToggle={toggle} />
      </div>

      {/* plate index */}
      <nav
        aria-label="Sections"
        className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 xl:block"
      >
        <ul className="group/nav space-y-3.5">
          {SECTIONS.map((s) => {
            const on = active === s.id;
            return (
              <li key={s.id} className="flex items-center justify-end">
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(s.id);
                  }}
                  aria-current={on ? 'true' : undefined}
                  className="group flex items-center justify-end gap-2.5 py-1"
                >
                  {/* labels stay out of the page's way until the nav is asked */}
                  <span
                    className={`hud opacity-0 transition-opacity duration-300 group-hover/nav:opacity-100 ${
                      on ? sig : dim
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className="flex w-14 items-center justify-end gap-2">
                    <span className={`hud transition-colors ${on ? sig : dim}`}>{s.n}</span>
                    <span
                      className={`block h-px transition-all duration-500 ${
                        on
                          ? `w-6 ${paper ? 'bg-invert-fg' : 'bg-signal'}`
                          : `w-2.5 ${rule} group-hover:w-4`
                      }`}
                    />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* running head, left edge */}
      <div
        aria-hidden="true"
        className={`hud marginalia-up fixed top-1/2 left-3 z-40 hidden -translate-y-1/2 items-center gap-3 transition-colors duration-500 xl:flex ${dim}`}
      >
        <Sparkle size={8} className={`rotate-90 ${paper ? 'text-invert-fg/60' : 'text-signal-dim'}`} />
        {IDENTITY.name} — specimen archive
      </div>
    </>
  );
}
