import type { Metadata } from "next";
import { getStripe, isStripeConfigured } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Thank you — The Craft",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  let customerName: string | null = null;
  let customerEmail: string | null = null;
  let total: string | null = null;

  if (isStripeConfigured() && session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      customerName = session.customer_details?.name ?? null;
      customerEmail = session.customer_email ?? session.customer_details?.email ?? null;
      const amount = session.amount_total;
      const currency = (session.currency ?? "cad").toUpperCase();
      if (amount != null) {
        total = `$${(amount / 100).toFixed(2)} ${currency}`;
      }
    } catch {
      // Session retrieval failed — still show a generic thank-you.
    }
  }

  return (
    <>
      <nav className="craft-nav">
        <div className="craft-nav__inner">
          <a href="/shop" className="craft-nav__brand">
            <img src="/craft-mark.svg" alt="" className="craft-nav__mark" />
            <span className="craft-nav__brand-text">The Craft</span>
          </a>
          <div className="craft-nav__links">
            <a href="/shop">Shop</a>
            <a href="/shop/about">About</a>
            <a href="/">Oldman AI Solutions</a>
          </div>
        </div>
      </nav>

      <div className="craft-notfound">
        <p className="craft-notfound__code">◆ Order received</p>
        <h1 className="craft-notfound__title">
          {customerName ? `Thank you, ${customerName.split(" ")[0]}.` : "Thank you."}
        </h1>
        <p className="craft-notfound__desc">
          Your order has been received and payment confirmed.
          {total && (
            <>
              {" "}Total: <strong style={{ color: "var(--craft-brass)" }}>{total}</strong>.
            </>
          )}
          {customerEmail && (
            <>
              {" "}A receipt is on its way to <strong>{customerEmail}</strong>.
            </>
          )}
          <br /><br />
          Your piece will be printed, finished, and shipped from the workshop
          in Lethbridge, Alberta. Expect an email when it leaves our hands.
        </p>
        <a href="/shop" className="craft-btn">Back to shop</a>
      </div>

      <footer className="craft-footer">
        <div className="craft-footer__rule" />
        <p>A workshop of <a href="/">Oldman AI Solutions</a>.</p>
        <p className="craft-footer__copy">&copy; 2026 The Craft</p>
      </footer>
    </>
  );
}
