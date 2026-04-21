import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  formatPrice,
  publicImageUrl,
  type Product,
  type ProductImage,
} from "@/lib/products/types";
import JoyBuyButton from "./BuyButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .eq("status", "active")
    .eq("store_slug", "joy-inc")
    .single();
  if (!data) return { title: "Not found — Joy Inc." };
  return {
    title: `${data.name} — Joy Inc.`,
    description:
      (data.description ?? "").slice(0, 180) ||
      "A handmade object from Joy Inc., a workshop of Oldman AI Solutions.",
  };
}

export const revalidate = 60;

export default async function JoyProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .eq("store_slug", "joy-inc")
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

      <div className="joy-product-hero">
        {primary ? (
          <img
            src={publicImageUrl(supabaseUrl, primary.storage_path)}
            alt={primary.alt_text ?? product.name}
          />
        ) : (
          <svg
            className="joy-product-hero--empty"
            viewBox="0 0 24 24"
            width="64"
            height="64"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="5" />
          </svg>
        )}
      </div>

      <section className="joy-product-main">
        <a href="/shop/joy-inc" className="joy-back">Back to shop</a>

        <div className="joy-product-main__top">
          <h1 className="joy-product-title">{product.name}</h1>
          <div className="joy-product-price">
            <span>{formatPrice(product.price_cents, product.currency)}</span>
            <span
              className={`joy-product-price__status${inStock ? "" : " joy-product-price__status--out"}`}
            >
              {inStock ? `${product.inventory_count} in stock` : "Sold out"}
            </span>
          </div>
        </div>

        {product.description ? (
          <div className="joy-product-description">
            {product.description.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ) : null}

        <div className="joy-product-actions">
          <JoyBuyButton
            slug={product.slug}
            storeSlug="joy-inc"
            inStock={inStock}
            label="Add to cart"
          />
        </div>

        {(product.materials ||
          product.dimensions ||
          product.weight_grams ||
          product.lead_time_days) && (
          <div className="joy-specs">
            {product.materials && (
              <div className="joy-specs__item">
                <span className="joy-specs__label">Materials</span>
                <span className="joy-specs__value">{product.materials}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="joy-specs__item">
                <span className="joy-specs__label">Dimensions</span>
                <span className="joy-specs__value">{product.dimensions}</span>
              </div>
            )}
            {product.weight_grams != null && (
              <div className="joy-specs__item">
                <span className="joy-specs__label">Weight</span>
                <span className="joy-specs__value">
                  {product.weight_grams}&nbsp;g
                </span>
              </div>
            )}
            {product.lead_time_days != null && (
              <div className="joy-specs__item">
                <span className="joy-specs__label">Lead time</span>
                <span className="joy-specs__value">
                  {product.lead_time_days}&nbsp;days
                </span>
              </div>
            )}
          </div>
        )}

        {galleryImages.length > 0 && (
          <div className="joy-gallery">
            {galleryImages.map((img) => (
              <div key={img.id} className="joy-gallery__img">
                <img
                  src={publicImageUrl(supabaseUrl, img.storage_path)}
                  alt={img.alt_text ?? product.name}
                />
              </div>
            ))}
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
