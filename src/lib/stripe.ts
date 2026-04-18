import Stripe from "stripe";

/**
 * Server-side Stripe client.
 * Reads STRIPE_SECRET_KEY from env. Falls back to a stub in dev if missing,
 * so pages that don't actually touch Stripe still build.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Add it in Vercel → Settings → Environment Variables."
    );
  }
  _stripe = new Stripe(key, {
    apiVersion: "2026-03-25.dahlia",
    typescript: true,
  });
  return _stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function publicAppUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://www.oldmanaisolutions.com"
  );
}
