/*
 * Contact proxy. The browser posts here; this adds the Web3Forms key
 * server-side and forwards. WEB3FORMS_KEY is a server-only variable — no
 * VITE_ prefix, so Vite never injects it and it never reaches a bundle.
 *
 * Edge runtime: standard Request/Response, no @vercel/node dependency.
 */
export const config = { runtime: 'edge' };

const ENDPOINT = 'https://api.web3forms.com/submit';
const LIMITS = { name: 80, email: 120, message: 2000 };
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** Trim, cap, and reject anything that isn't a string. */
const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

// ponytail: no rate limit — a public endpoint with one key behind it. If it
// gets hammered, put Vercel KV (or the platform's own limiter) in front.
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const key = process.env.WEB3FORMS_KEY;
  if (!key) return json({ error: 'Contact is not configured.' }, 500);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Malformed body.' }, 400);
  }

  // Honeypot: answer as though it worked, forward nothing.
  if (clean(body.botcheck, 1)) return json({ ok: true });

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);

  if (!name || !message || !EMAIL.test(email)) {
    return json({ error: 'Name, a valid email and a message are all required.' }, 400);
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: key,
      from_name: 'Specimen Archive',
      subject: `Archive — ${name}`,
      name,
      email,
      message,
    }),
  });

  if (!res.ok) return json({ error: 'Upstream refused the message.' }, 502);
  return json({ ok: true });
}
