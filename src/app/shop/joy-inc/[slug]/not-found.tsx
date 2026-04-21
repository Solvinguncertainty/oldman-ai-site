export default function JoyNotFound() {
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
        <p className="joy-notfound__code">&#9728; 404</p>
        <h1 className="joy-notfound__title">Not in the collection.</h1>
        <p className="joy-notfound__desc">
          This piece doesn&rsquo;t exist yet, isn&rsquo;t ready to show, or
          has already found its home.
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
