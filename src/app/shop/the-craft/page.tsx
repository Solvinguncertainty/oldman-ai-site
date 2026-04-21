import { createClient } from "@/lib/supabase/server";
import type { Product, ProductImage } from "@/lib/products/types";
import { formatPrice, publicImageUrl } from "@/lib/products/types";

export const revalidate = 60;

export default async function ShopPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const productList = (products ?? []) as Product[];

  let imagesByProduct: Map<string, ProductImage[]> = new Map();
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
      {/* Navigation */}
      <nav className="craft-nav">
        <div className="craft-nav__inner">
          <a href="/shop/the-craft" className="craft-nav__brand">
            <img
              src="/craft-mark.svg"
              alt=""
              className="craft-nav__mark"
            />
            <span className="craft-nav__brand-text">The Craft</span>
          </a>
          <div className="craft-nav__links">
            <a href="/shop/the-craft">Shop</a>
            <a href="/shop/the-craft/about">About</a>
            <a href="/">Oldman AI Solutions</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="craft-hero">
        <img
          src="/craft-logo.svg"
          alt="The Craft — a workshop of Oldman AI Solutions"
          className="craft-hero__logo"
        />
        <p className="craft-hero__tagline">
          Small batches. Real objects. Made by hand in a single workshop.
        </p>
        <p className="craft-hero__meta">
          BUILT IN <span>LETHBRIDGE, ALBERTA</span>
        </p>
      </header>

      {/* Products */}
      <section className="craft-section">
        <div className="craft-section__label">The Catalogue</div>
        <h1 className="craft-section__title">
          Objects designed and printed one at a time.
        </h1>

        {productList.length === 0 ? (
          <div className="craft-empty">
            <img
              src="/craft-mark.svg"
              alt=""
              className="craft-empty__mark"
            />
            <h2 className="craft-empty__title">The shelves are being stocked.</h2>
            <p className="craft-empty__desc">
              The first run of products is being prepared. If you&rsquo;d like to
              know when they&rsquo;re ready, drop a line from the Oldman AI
              Solutions site.
            </p>
          </div>
        ) : (
          <div className="craft-products">
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
                  href={`/shop/the-craft/${p.slug}`}
                  className="craft-product-card"
                >
                  <div className="craft-product-card__image">
                    {imgUrl ? (
                      <img src={imgUrl} alt={primary?.alt_text ?? p.name} />
                    ) : (
                      <svg
                        className="craft-product-card__image--placeholder"
                        viewBox="0 0 24 24"
                        width="32"
                        height="32"
                        fill="none"
                        stroke="currentColor"
                      >
                        <polygon points="12,4 20,12 12,20 4,12" strokeWidth="1" />
                      </svg>
                    )}
                  </div>
                  <div className="craft-product-card__name">{p.name}</div>
                  <div className="craft-product-card__price">
                    {formatPrice(p.price_cents, p.currency)}
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="craft-footer">
        <div className="craft-footer__rule" />
        <p>A workshop of <a href="/">Oldman AI Solutions</a>.</p>
        <p className="craft-footer__copy">&copy; 2026 The Craft</p>
      </footer>
    </>
  );
}
