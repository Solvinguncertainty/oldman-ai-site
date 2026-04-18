export default function NotFound() {
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
            <a href="/">Old Man AI</a>
          </div>
        </div>
      </nav>

      <div className="craft-notfound">
        <p className="craft-notfound__code">◆ 404</p>
        <h1 className="craft-notfound__title">Not in the catalogue.</h1>
        <p className="craft-notfound__desc">
          This product doesn&rsquo;t exist, isn&rsquo;t published yet, or was
          taken off the shelves.
        </p>
        <a href="/shop" className="craft-btn">Back to shop</a>
      </div>

      <footer className="craft-footer">
        <div className="craft-footer__rule" />
        <p>A workshop of <a href="/">Old Man AI Solutions</a>.</p>
        <p className="craft-footer__copy">&copy; 2026 The Craft</p>
      </footer>
    </>
  );
}
