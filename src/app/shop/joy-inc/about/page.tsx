import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Joy Inc.",
  description:
    "Joy Inc. is the workshop of Bethany — handmade resin art, knickknacks, and gifts that bring joy.",
};

export default function JoyAboutPage() {
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

      <section className="joy-about">
        <a href="/shop/joy-inc" className="joy-back">Back to shop</a>

        <div className="joy-section__label" style={{ marginTop: 32 }}>
          The Maker
        </div>
        <h1 className="joy-section__title" style={{ fontStyle: "italic" }}>
          Hello, I&rsquo;m Bethany.
        </h1>

        <p className="joy-about__lead">
          I&rsquo;ve always loved making things. The kind of things that make
          someone&rsquo;s day a little brighter.
        </p>

        <div className="joy-about__prose">
          <p>
            Joy Inc. is my workshop. I pour resin, I arrange little worlds, I
            make objects you won&rsquo;t find anywhere else. Some of them are
            gifts. Some of them are keepsakes. All of them are made one at a
            time, by hand, with a lot of care and usually more joy than is
            strictly necessary.
          </p>

          <p>
            The word <em>joy</em> shows up a lot in my life, and I wanted my
            workshop to carry it. Not as a slogan &mdash; as the actual point
            of the thing. If a piece makes you smile when you unbox it, if it
            sits on your shelf and makes a room feel a little warmer, if it
            lands as the right gift for the right person at the right moment
            &mdash; that&rsquo;s the whole goal.
          </p>

          <p>
            Every object is finished, photographed, packaged, and shipped by
            me. No factory, no third party, no mystery. If something feels off
            when it arrives, tell me. If something turns out to be exactly
            what you needed, I&rsquo;d love to hear about that too.
          </p>

          <p>
            Joy Inc. is part of the <a href="/">Oldman AI Solutions</a>{" "}
            family of workshops &mdash; a home for makers doing their own kind
            of real work.
          </p>
        </div>

        <div className="joy-about__sig">
          Made with <span>joy</span> by Bethany
        </div>
      </section>

      <footer className="joy-footer">
        <div className="joy-footer__rule" />
        <p>A workshop of <a href="/">Oldman AI Solutions</a>.</p>
        <p className="joy-footer__copy">&copy; 2026 Joy Inc.</p>
      </footer>
    </>
  );
}
