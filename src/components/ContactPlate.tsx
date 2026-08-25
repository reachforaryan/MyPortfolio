import { useEffect, useRef, useState } from 'react';
import { CONTACT } from '../content';
import { Sparkle } from './plate/Sparkle';
import { Registration } from './plate/PlateFrame';
import { useTheme } from '../lib/theme';
import { gsap, prefersReducedMotion } from '../lib/motion';

/* Our own proxy, not Web3Forms directly — the access key lives on the server
   (api/contact.ts) and never reaches the browser. */
const ENDPOINT = '/api/contact';

/** How long the acknowledgment holds before the plate closes itself. */
const ACK_HOLD = 3.5;

type Status = 'idle' | 'sending' | 'sent' | 'error';

/*
 * One dialog, opened from the top-right control cluster and from the Colophon.
 * The opener is module-scoped rather than threaded through props or a context —
 * the same shape `scrollToSection` uses for the Lenis instance.
 */
let opener: (() => void) | null = null;
export const openContact = () => opener?.();

/**
 * The contact plate. Built on the native <dialog>: modal semantics, focus
 * containment, Esc, and inert background all come from the platform, so the
 * only thing left to write is the animation and the send.
 *
 * Colour comes from the ordinary theme tokens, so the panel flips with the
 * page. Only the entrance differs by state: INK registers like a plate, PAPER
 * is a sheet laid down on the desk. The exits reverse their entrances.
 */
export function ContactPlate() {
  const dialog = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const ack = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [status, setStatus] = useState<Status>('idle');
  const paper = theme === 'paper';
  const done = status === 'sent' || status === 'error';

  const close = () => {
    const el = dialog.current;
    const box = panel.current;
    if (!el || !box) return;
    if (prefersReducedMotion()) {
      el.close();
      return;
    }
    gsap.to(box, {
      ...(paper
        ? { yPercent: 12, opacity: 0, scale: 0.98, duration: 0.28, ease: 'power2.in' }
        : { scaleY: 0.02, opacity: 0, duration: 0.26, ease: 'expo.in' }),
      onComplete: () => el.close(),
    });
  };
  // The acknowledgment's timer fires long after its effect closed over `close`.
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    opener = () => {
      const el = dialog.current;
      const box = panel.current;
      if (!el || el.open || !box) return;
      setStatus('idle');
      el.showModal();

      if (prefersReducedMotion()) {
        gsap.fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.2 });
        return;
      }

      if (paper) {
        // A sheet laid onto the desk.
        gsap.fromTo(
          box,
          { yPercent: 12, opacity: 0, scale: 0.98 },
          { yPercent: 0, opacity: 1, scale: 1, duration: 0.42, ease: 'back.out(1.4)' }
        );
      } else {
        // A plate seating itself: the frame opens from a hairline, marks land.
        gsap
          .timeline()
          .fromTo(box, { scaleY: 0.02, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.34, ease: 'expo.out' })
          .fromTo(
            box.querySelectorAll('[data-reg] svg'),
            { scale: 2.4, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.32, stagger: 0.04, ease: 'power3.out' },
            '-=0.12'
          )
          .fromTo(
            box.querySelectorAll('[data-field]'),
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.34, stagger: 0.05, ease: 'power2.out' },
            '-=0.2'
          );
      }
    };
    return () => {
      opener = null;
    };
  }, [paper]);

  /*
   * The acknowledgment covers the panel rather than replacing the form, so
   * nothing reflows behind it and a failed send keeps every field filled in.
   * On success the rule under the heading unwinds — the hold *is* the rule, so
   * there is no second countdown to keep in sync with it.
   */
  useEffect(() => {
    const box = ack.current;
    if (!box || !done) return;

    const mark = box.querySelector('[data-ack-mark]');
    const lines = box.querySelectorAll('[data-ack-line]');
    const rule = box.querySelector('[data-ack-rule]');

    const tl = gsap.timeline();
    if (prefersReducedMotion()) {
      tl.fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    } else {
      tl.fromTo(
        box,
        { clipPath: 'inset(50% 0% 50% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.42, ease: 'expo.out' }
      )
        .fromTo(
          mark,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.4)' },
          '-=0.2'
        )
        .fromTo(
          lines,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.36, stagger: 0.08, ease: 'power2.out' },
          '-=0.25'
        )
        .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: 'power3.inOut' }, '-=0.3');
    }

    if (status === 'sent') {
      tl.to(rule, {
        scaleX: 0,
        duration: ACK_HOLD,
        ease: 'none',
        onComplete: () => closeRef.current(),
      });
    }

    return () => void tl.kill();
  }, [done, status]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (data.botcheck) return; // honeypot: only a bot fills a hidden field

    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error'); // the fields keep whatever they typed
    }
  }

  const field =
    'hud-lg w-full border border-line bg-transparent px-3 py-3 text-fg outline-none transition-colors placeholder:text-fg-3 focus-visible:border-signal';

  return (
    <dialog
      ref={dialog}
      aria-label={CONTACT.heading}
      onCancel={(e) => {
        e.preventDefault(); // let the exit play before the platform closes it
        close();
      }}
      onClick={(e) => {
        if (e.target === dialog.current) close(); // backdrop
      }}
      className="m-auto w-[min(92vw,34rem)] bg-transparent p-0 text-fg backdrop:bg-ground/85 backdrop:backdrop-blur-[3px]"
    >
      <div
        ref={panel}
        className="relative origin-center overflow-hidden border border-line bg-surface px-6 py-8 sm:px-9 sm:py-10"
      >
        <span data-reg>
          <Registration className="text-signal-dim" inset={8} size={14} />
        </span>

        <div data-field className="flex items-center gap-3">
          <span className="hud flex items-center gap-1.5 text-signal">
            <Sparkle size={8} />
            {CONTACT.kicker}
          </span>
          <span className="h-px flex-1 bg-line" />
          <button
            type="button"
            onClick={close}
            aria-label={CONTACT.close}
            className="hud text-fg-3 transition-colors hover:text-signal"
          >
            ✕
          </button>
        </div>

        <h2
          data-field
          className="display display-sm mt-6 text-[clamp(1.9rem,5vw,2.8rem)] leading-[1] text-fg"
        >
          {CONTACT.heading}
        </h2>
        <p data-field className="mt-3 max-w-sm text-pretty text-[0.95rem] leading-[1.6] text-fg-2">
          {CONTACT.body}
        </p>

        <form onSubmit={submit} className="mt-7 space-y-3">
          {/* honeypot — off-screen, never announced, never filled by a person */}
          <input
            type="text"
            name="botcheck"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute left-[-9999px]"
          />

          <div data-field className="grid gap-3 sm:grid-cols-2">
            <input
              name="name"
              required
              maxLength={80}
              placeholder={CONTACT.fields.name}
              autoComplete="name"
              className={field}
            />
            <input
              name="email"
              type="email"
              required
              maxLength={120}
              placeholder={CONTACT.fields.email}
              autoComplete="email"
              className={field}
            />
          </div>
          <textarea
            data-field
            name="message"
            required
            rows={4}
            maxLength={2000}
            placeholder={CONTACT.fields.message}
            className={`${field} resize-none`}
          />

          <div data-field className="flex items-center justify-end pt-1">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="hud-lg group inline-flex items-center gap-3 border border-signal-dim px-6 py-3 transition-colors duration-300 hover:border-signal hover:bg-signal hover:text-ground disabled:opacity-50"
            >
              <Sparkle size={10} className="text-signal transition-colors group-hover:text-ground" />
              {status === 'sending' ? CONTACT.sending : CONTACT.send}
            </button>
          </div>

          {import.meta.env.DEV && (
            <p className="hud pt-1 text-fg-3">
              Dev: /api/contact is a Vercel function — run `vercel dev` to send for real.
            </p>
          )}
        </form>

        {done && (
          <div
            ref={ack}
            role="status"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-surface px-8 text-center"
          >
            <Sparkle data-ack-mark size={36} className="text-signal" />
            <h3
              data-ack-line
              className="display display-sm text-[clamp(1.6rem,4.4vw,2.3rem)] leading-none text-fg"
            >
              {status === 'sent' ? CONTACT.sentTitle : CONTACT.errorTitle}
            </h3>
            <span data-ack-rule className="block h-px w-28 origin-left bg-signal" />
            <p data-ack-line className="hud max-w-xs text-fg-2">
              {status === 'sent' ? CONTACT.sentNote : CONTACT.error}
            </p>
            {status === 'error' && (
              <button
                data-ack-line
                type="button"
                onClick={() => setStatus('idle')}
                className="hud-lg mt-2 border border-signal-dim px-5 py-2.5 transition-colors duration-300 hover:border-signal hover:bg-signal hover:text-ground"
              >
                {CONTACT.retry}
              </button>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}
