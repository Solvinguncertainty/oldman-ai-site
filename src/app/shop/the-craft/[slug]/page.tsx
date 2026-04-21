import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  formatPrice,
  publicImageUrl,
  type Product,
  type ProductImage,
} from "@/lib/products/types";
import BuyButton from "./BuyButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .eq("status", "active")
    .single();
  if (!data) return { title: "Not found — The Craft" };
  return {
    title: `${data.name} — The Craft`,
    description:
      (data.description ?? "").slice(0, 180) ||
      "A small-batch object from The Craft, a workshop of Oldman AI Solutions.",
  };
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single<Product>();

  if (!product) notFound();

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("position", { ascending: true });

  const imageList = (images ?? []) as ProductImage[];
  const primary = imageList.find((i) => i.is_primary) ?? imageList[0] ?? null;
  const galleryImages = imageList.filter((i) => i.id !== primary?.id);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  const inStock = product.inventory_count > 0;

  return (
    <>
      {/* Navigation */}
      <nav className="craft-nav">
        <div className="craft-nav__inner">
          <a href="/shop/the-craft" className="craft-nav__brand">
            <img src="/craft-mark.svg" alt="" className="craft-nav__mark" />
            <span className="craft-nav__brand-text">The Craft</span>
          </a>
          <div className="craft-nav__links">
            <a href="/shop/the-craft">Shop</a>
            <a href="/shop/the-craft/about">About</a>
            <a href="/">Oldman AI Solutions</a>
          </div>
        </div>
      </nav>

      {/* Hero image */}
      <div className="craft-product-hero">
        {primary ? (
          <img
            src={publicImageUrl(supabaseUrl, primary.storage_path)}
            alt={primary.alt_text ?? product.name}
          />
        ) : (
          <svg
            className="craft-product-hero--empty"
            viewBox="0 0 24 24"
            width="64"
            height="64"
            fill="none"
            stroke="currentColor"
          >
            <polygon points="12,4 20,12 12,20 4,12" strokeWidth="1" />
          </svg>
        )}
      </div>

      {/* Main */}
      <section className="craft-product-main">
        <a href="/shop/the-craft" className="craft-back">Back to shop</a>

        <div className="craft-product-main__top">
          <h1 className="craft-product-title">{product.name}</h1>
          <div className="craft-product-price">
            <span>{formatPrice(product.price_cents, product.currency)}</span>
            <span
              className={`craft-product-price__status${inStock ? "" : " craft-product-price__status--out"}`}
            >
              {inStock ? `${product.inventory_count} in stock` : "Sold out"}
            </span>
          </div>
        </div>

        {product.description ? (
          <div className="craft-product-description">
            {product.description.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ) : null}

        <div className="craft-product-actions">
          <BuyButton
            slug={product.slug}
            inStock={inStock}
            label="Buy now"
          />
        </div>

        {(product.materials ||
          product.dimensions ||
          product.weight_grams ||
          product.lead_time_days) && (
          <div className="craft-specs">
            {product.materials && (
              <div className="craft-specs__item">
                <span className="craft-specs__label">Materials</span>
                <span className="craft-specs__value">{product.materials}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="craft-specs__item">
                <span className="craft-specs__label">Dimensions</span>
                <span className="craft-specs__value">{product.dimensions}</span>
              </div>
            )}
            {product.weight_grams != null && (
              <div className="craft-specs__item">
                <span className="craft-specs__label">Weight</span>
                <span className="craft-specs__value">
                  {product.weight_grams}&nbsp;g
                </span>
              </div>
            )}
            {product.lead_time_days != null && (
              <div className="craft-specs__item">
                <span className="craft-specs__label">Lead time</span>
                <span className="craft-specs__value">
                  {product.lead_time_days}&nbsp;days
                </span>
              </div>
            )}
          </div>
        )}

        {galleryImages.length > 0 && (
          <div className="craft-gallery">
            {galleryImages.map((img) => (
              <div key={img.id} className="craft-gallery__img">
                <img
                  src={publicImageUrl(supabaseUrl, img.storage_path)}
                  alt={img.alt_text ?? product.name}
                />
              </div>
            ))}
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
