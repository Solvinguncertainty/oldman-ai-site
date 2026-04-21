import type { Metadata } from "next";
import "./hub.css";

export const metadata: Metadata = {
  title: "Shop — Oldman AI Solutions",
  description:
    "Two workshops under one roof. The Craft: small-batch 3D printed goods. Joy Inc.: handmade resin art and gifts that bring joy.",
};

export default function ShopHubPage() {
  return (
    <div className="hub-root">
      <nav className="hub-nav">
        <a href="/" className="hub-nav__brand">
          <img src="/logo-circular.png" alt="Oldman AI Solutions" />
          <span className="hub-nav__brand-text">Oldman AI Solutions</span>
        </a>
        <a href="/" className="hub-nav__back">&larr; Back to site</a>
      </nav>

      <header className="hub-hero">
        <p className="hub-hero__eyebrow">Our Workshops</p>
        <h1 className="hub-hero__title">
          Two workshops.<br />Under one roof.
        </h1>
        <p className="hub-hero__desc">
          Each store is run by a different maker with a different craft. Pick
          the one that calls to you &mdash; both make real things, by hand, one
          at a time.
        </p>
      </header>

      <section className="hub-stores">
        <a href="/shop/the-craft" className="hub-store hub-store--craft">
          <div className="hub-store__content">
            <div className="hub-store__logo">
              <img src="/craft-logo.svg" alt="The Craft" />
            </div>
            <p className="hub-store__label">3D Printed Goods</p>
            <h2 className="hub-store__tagline">
              Small batches.<br />Real objects.
            </h2>
            <p className="hub-store__desc">
              Designed and printed one at a time in Lethbridge, Alberta.
              Functional objects, gifts, and pieces you can&rsquo;t find on a
              shelf somewhere.
            </p>
            <span className="hub-store__cta">Enter The Craft &rarr;</span>
          </div>
        </a>

        <a href="/shop/joy-inc" className="hub-store hub-store--joy">
          <div className="hub-store__content">
            <div className="hub-store__logo">
              <img src="/joy-logo.svg" alt="Joy Inc." />
            </div>
            <p className="hub-store__label">Handmade Resin &amp; Gifts</p>
            <h2 className="hub-store__tagline">
              Little objects.<br />Big joy.
            </h2>
            <p className="hub-store__desc">
              Resin art, knickknacks, and one-of-a-kind gifts made by Bethany.
              Every piece is handmade with the kind of care that only someone
              who genuinely loves making things can bring to it.
            </p>
            <span className="hub-store__cta">Enter Joy Inc. &rarr;</span>
          </div>
        </a>
      </section>

      <footer className="hub-footer">
        <p>
          Both workshops are part of <a href="/">Oldman AI Solutions</a>.
        </p>
      </footer>
    </div>
  );
}
