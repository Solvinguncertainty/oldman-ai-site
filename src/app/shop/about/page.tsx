import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — The Craft",
  description:
    "The Craft is the workshop side of Oldman AI Solutions. Small-batch 3D printed objects, designed and printed in Lethbridge, Alberta.",
};

export default function ShopAboutPage() {
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

      <section className="craft-about">
        <a href="/shop" className="craft-back">Back to shop</a>

        <div className="craft-section__label" style={{ marginTop: 32 }}>
          The Workshop
        </div>
        <h1 className="craft-product-title">A workshop. Not a factory.</h1>

        <p className="craft-about__lead">
          Small batches. Real objects. Made by hand, in a single room, in
          Lethbridge, Alberta.
        </p>

        <div className="craft-about__prose">
          <p>
            The Craft is the workshop side of Oldman AI Solutions. Where the
            parent firm builds custom AI solutions for businesses and teaches
            people to build their own, this is where we make real, physical
            things you can hold.
          </p>

          <p>
            Every object in the catalogue is designed and printed one at a time.
            We use 3D printing not because it&rsquo;s fast &mdash; it isn&rsquo;t
            &mdash; but because it lets us make things that matter to specific
            people. Things that don&rsquo;t need to exist in warehouses before
            they exist in your hands.
          </p>

          <p>
            &ldquo;Master your craft&rdquo; is a line we keep coming back to at
            Oldman AI Solutions. It&rsquo;s what we tell people we&rsquo;re training,
            what we ask ourselves when we sit down to build, and what we aim for
            in every consulting engagement. This shop is that line, made into
            objects.
          </p>

          <p>
            When you buy something here, it isn&rsquo;t pulled off a shelf.
            It&rsquo;s printed, finished, and shipped from a single workshop by
            the same person who designed it. That&rsquo;s the whole point.
          </p>
        </div>

        <div className="craft-about__sig">
          Designed &amp; made in <span>Lethbridge, Alberta</span>
        </div>
      </section>

      <footer className="craft-footer">
        <div className="craft-footer__rule" />
        <p>A workshop of <a href="/">Oldman AI Solutions</a>.</p>
        <p className="craft-footer__copy">&copy; 2026 The Craft</p>
      </footer>
    </>
  );
}
