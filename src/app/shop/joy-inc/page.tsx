export const revalidate = 60;

export default function JoyShopPage() {
  return (
    <>
      {/* Navigation */}
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

      {/* Hero */}
      <header className="joy-hero">
        <img
          src="/joy-logo.svg"
          alt="Joy Inc. — Little objects. Big joy."
          className="joy-hero__logo"
        />
        <p className="joy-hero__tagline">
          Handmade with heart. One-of-a-kind objects that make people smile.
        </p>
        <p className="joy-hero__meta">
          CRAFTED BY <span>BETHANY</span>
        </p>
      </header>

      {/* Catalog */}
      <section className="joy-section">
        <div className="joy-section__label">The Collection</div>
        <h1 className="joy-section__title">
          Resin art, knickknacks, and small wonders.
        </h1>

        <div className="joy-empty">
          <img src="/joy-mark.svg" alt="" className="joy-empty__mark" />
          <h2 className="joy-empty__title">Something special is being made.</h2>
          <p className="joy-empty__desc">
            Bethany is pouring the first batch right now. If you&rsquo;d like
            to be the first to know when it&rsquo;s ready, drop a line from the
            Oldman AI Solutions site &mdash; we&rsquo;ll let you know the moment
            the shelves are stocked.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="joy-footer">
        <div className="joy-footer__rule" />
        <p>A workshop of <a href="/">Oldman AI Solutions</a>.</p>
        <p className="joy-footer__copy">&copy; 2026 Joy Inc.</p>
      </footer>
    </>
  );
}
