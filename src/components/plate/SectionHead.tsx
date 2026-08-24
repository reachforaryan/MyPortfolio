import { Sparkle } from './Sparkle';

/** Every plate opens the same way: kicker, drawn rule, index. */
export function SectionHead({
  n,
  kicker,
  right,
  tone = 'dark',
}: {
  n: string;
  kicker: string;
  right?: string;
  tone?: 'dark' | 'paper';
}) {
  const dim = tone === 'paper' ? 'text-invert-fg/45' : 'text-fg-3';
  const sig = tone === 'paper' ? 'text-signal-dim' : 'text-signal';
  const line = tone === 'paper' ? 'bg-invert-fg/20' : 'bg-line';
  return (
    <div className="flex items-center gap-3 sm:gap-5">
      <span className={`hud ${sig} flex items-center gap-1.5`}>
        <Sparkle size={8} />
        {n}
      </span>
      <h2 className={`hud ${dim} whitespace-nowrap`}>{kicker}</h2>
      <span className={`h-px flex-1 ${line}`} />
      {right && <span className={`hud ${dim} hidden whitespace-nowrap sm:block`}>{right}</span>}
    </div>
  );
}
