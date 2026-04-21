import type { Metadata } from "next";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Thank you — Joy Inc.",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function JoySuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let customerName: string | null = null;
  let customerEmail: string | null = null;
  let total: string | null = null;

  if (isStripeConfigured() && session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      customerName = session.customer_details?.name ?? null;
      customerEmail =
        session.customer_email ?? session.customer_details?.email ?? null;
      const amount = session.amount_total;
      const currency = (session.currency ?? "cad").toUpperCase();
      if (amount != null) {
        total = `$${(amount / 100).toFixed(2)} ${currency}`;
      }
    } catch {
      // swallow
    }
  }

  return (
    <>
      <nav className="joy-nav">
        <div className="joy-nav__inner">
          <a href="/shop/joy-inc" className="joy-nav__brand">
            <img src="/joy-mark.svg" alt="" className="joy-nav__mark" />
            <span className="joy-nav__brand-text">Joy Inc.</span>
          </a>
          <div className="joy-nav__links">
            <a href="/shop/joy-inc">Shop</a>
            <a href="/shop/joy-inc/about">About</a>
            <a href="/shop">All Shops</a>
            <a href="/">Oldman AI Solutions</a>
          </div>
        </div>
      </nav>

      <div className="joy-notfound">
        <p className="joy-notfound__code">&#9728; Order received</p>
        <h1 className="joy-notfound__title">
          {customerName
            ? `Thank you, ${customerName.split(" ")[0]}.`
            : "Thank you."}
        </h1>
        <p className="joy-notfound__desc">
          Your order has been received and payment confirmed.
          {total && (
            <>
              {" "}Total: <strong style={{ color: "var(--joy-rose)" }}>{total}</strong>.
            </>
          )}
          {customerEmail && (
            <>
              {" "}A receipt is on its way to <strong>{customerEmail}</strong>.
            </>
          )}
          <br /><br />
          Bethany will pack it up by hand and get it on its way as soon as
          she can. You&rsquo;ll get an email the moment it ships.
        </p>
        <a href="/shop/joy-inc" className="joy-btn">Back to shop</a>
      </div>

      <footer className="joy-footer">
        <div className="joy-footer__rule" />
        <p>A workshop of <a href="/">Oldman AI Solutions</a>.</p>
        <p className="joy-footer__copy">&copy; 2026 Joy Inc.</p>
      </footer>
    </>
  );
}
