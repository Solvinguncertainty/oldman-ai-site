import { createClient } from "@/lib/supabase/server";
import type { Product, ProductImage } from "@/lib/products/types";
import { formatPrice, publicImageUrl } from "@/lib/products/types";

export const revalidate = 60;

export default async function JoyShopPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .eq("store_slug", "joy-inc")
    .order("created_at", { ascending: false });

  const productList = (products ?? []) as Product[];

  const imagesByProduct: Map<string, ProductImage[]> = new Map();
  if (productList.length > 0) {
    const { data: imgs } = await supabase
      .from("product_images")
      .select("*")
      .in(
        "product_id",
        productList.map((p) => p.id)
      );
    if (imgs) {
      for (const img of imgs as ProductImage[]) {
        const arr = imagesByProduct.get(img.product_id) ?? [];
        arr.push(img);
        imagesByProduct.set(img.product_id, arr);
      }
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

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

      <section className="joy-section">
        <div className="joy-section__label">The Collection</div>
        <h1 className="joy-section__title">
          Resin art, knickknacks, and small wonders.
        </h1>

        {productList.length === 0 ? (
          <div className="joy-empty">
            <img src="/joy-mark.svg" alt="" className="joy-empty__mark" />
            <h2 className="joy-empty__title">Something special is being made.</h2>
            <p className="joy-empty__desc">
              Bethany is pouring the first batch right now. If you&rsquo;d like
              to be the first to know when it&rsquo;s ready, drop a line from
              the Oldman AI Solutions site &mdash; we&rsquo;ll let you know the
              moment the shelves are stocked.
            </p>
          </div>
        ) : (
          <div className="joy-products">
            {productList.map((p) => {
              const imgs = imagesByProduct.get(p.id) ?? [];
              const primary =
                imgs.find((i) => i.is_primary) ?? imgs[0] ?? null;
              const imgUrl = primary
                ? publicImageUrl(supabaseUrl, primary.storage_path)
                : null;
              return (
                <a
                  key={p.id}
                  href={`/shop/joy-inc/${p.slug}`}
                  className="joy-product-card"
                >
                  <div className="joy-product-card__image">
                    {imgUrl ? (
                      <img src={imgUrl} alt={primary?.alt_text ?? p.name} />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        width="40"
                        height="40"
                        fill="none"
                        stroke="#D97A7A"
                        opacity="0.5"
                      >
                        <circle cx="12" cy="12" r="4" fill="#F4C95D" stroke="none" />
                        <g strokeWidth="1.5" strokeLinecap="round">
                          <line x1="12" y1="2" x2="12" y2="5" />
                          <line x1="12" y1="19" x2="12" y2="22" />
                          <line x1="2" y1="12" x2="5" y2="12" />
                          <line x1="19" y1="12" x2="22" y2="12" />
                        </g>
                      </svg>
                    )}
                  </div>
                  <div className="joy-product-card__body">
                    <div className="joy-product-card__name">{p.name}</div>
                    <div className="joy-product-card__price">
                      {formatPrice(p.price_cents, p.currency)}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      <footer className="joy-footer">
        <div className="joy-footer__rule" />
        <p>A workshop of <a href="/">Oldman AI Solutions</a>.</p>
        <p className="joy-footer__copy">&copy; 2026 Joy Inc.</p>
      </footer>
    </>
  );
}
