"use client";

import { useActionState, useRef } from "react";
import type { Product, ProductImage } from "@/lib/products/types";

type Props = {
  mode: "create" | "edit";
  product?: Product;
  images?: ProductImage[];
  supabaseUrl?: string;
  // `action` is a bound server action: (prevState, formData) => Promise<{error}>
  action: (
    prevState: { error: string | null },
    formData: FormData
  ) => Promise<{ error: string | null }>;
  onDeleteImage?: (imageId: string) => Promise<void>;
};

export default function ProductForm({
  mode,
  product,
  images = [],
  supabaseUrl = "",
  action,
  onDeleteImage,
}: Props) {
  const [state, formAction, isPending] = useActionState(action, {
    error: null,
  });
  const formRef = useRef<HTMLFormElement>(null);

  const defaultPrice =
    product?.price_cents != null ? (product.price_cents / 100).toFixed(2) : "";

  return (
    <form ref={formRef} action={formAction} className="admin-form">
      {state.error ? (
        <div className="admin-form__error">{state.error}</div>
      ) : null}
      {mode === "edit" && state.error === null && !isPending && (
        <div style={{ display: "none" }} />
      )}

      <div className="admin-form__section">
        <h3>Basics</h3>
        <div className="admin-form__grid">
          <div className="admin-form__field admin-form__grid--full">
            <label htmlFor="store_slug">Store</label>
            <select
              id="store_slug"
              name="store_slug"
              defaultValue={product?.store_slug ?? "the-craft"}
              disabled={isPending}
            >
              <option value="the-craft">The Craft — Cory (3D printed goods)</option>
              <option value="joy-inc">Joy Inc. — Bethany (resin &amp; gifts)</option>
            </select>
            <span className="admin-form__help">
              Which workshop this product belongs to. Can be changed later.
            </span>
          </div>

          <div className="admin-form__field admin-form__grid--full">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={product?.name ?? ""}
              required
              disabled={isPending}
            />
          </div>

          <div className="admin-form__field admin-form__grid--full">
            <label htmlFor="slug">URL slug</label>
            <input
              id="slug"
              name="slug"
              type="text"
              defaultValue={product?.slug ?? ""}
              placeholder="auto-generated from name if blank"
              disabled={isPending}
            />
            <span className="admin-form__help">
              Public URL will be /shop/{product?.store_slug ?? "the-craft"}/<strong>{product?.slug ?? "your-slug"}</strong>
            </span>
          </div>

          <div className="admin-form__field admin-form__grid--full">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={product?.description ?? ""}
              disabled={isPending}
              placeholder="Write this like a product story. Materials, inspiration, why it exists."
            />
          </div>
        </div>
      </div>

      <div className="admin-form__section">
        <h3>Price & inventory</h3>
        <div className="admin-form__grid">
          <div className="admin-form__field">
            <label htmlFor="price">Price</label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              defaultValue={defaultPrice}
              required
              disabled={isPending}
            />
            <span className="admin-form__help">Dollars and cents</span>
          </div>

          <div className="admin-form__field">
            <label htmlFor="currency">Currency</label>
            <select
              id="currency"
              name="currency"
              defaultValue={product?.currency ?? "CAD"}
              disabled={isPending}
            >
              <option value="CAD">CAD</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div className="admin-form__field">
            <label htmlFor="inventory_count">Inventory</label>
            <input
              id="inventory_count"
              name="inventory_count"
              type="number"
              min="0"
              step="1"
              defaultValue={product?.inventory_count ?? 0}
              disabled={isPending}
            />
          </div>

          <div className="admin-form__field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              defaultValue={product?.status ?? "draft"}
              disabled={isPending}
            >
              <option value="draft">Draft (hidden)</option>
              <option value="active">Active (visible on shop)</option>
              <option value="archived">Archived (hidden)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="admin-form__section">
        <h3>Specs (optional)</h3>
        <div className="admin-form__grid">
          <div className="admin-form__field admin-form__grid--full">
            <label htmlFor="materials">Materials</label>
            <input
              id="materials"
              name="materials"
              type="text"
              defaultValue={product?.materials ?? ""}
              disabled={isPending}
              placeholder="e.g. PLA, matte black"
            />
          </div>

          <div className="admin-form__field admin-form__grid--full">
            <label htmlFor="dimensions">Dimensions</label>
            <input
              id="dimensions"
              name="dimensions"
              type="text"
              defaultValue={product?.dimensions ?? ""}
              disabled={isPending}
              placeholder="e.g. 120 × 80 × 40 mm"
            />
          </div>

          <div className="admin-form__field">
            <label htmlFor="weight_grams">Weight (grams)</label>
            <input
              id="weight_grams"
              name="weight_grams"
              type="number"
              min="0"
              step="1"
              defaultValue={product?.weight_grams ?? ""}
              disabled={isPending}
            />
          </div>

          <div className="admin-form__field">
            <label htmlFor="lead_time_days">Lead time (days)</label>
            <input
              id="lead_time_days"
              name="lead_time_days"
              type="number"
              min="0"
              step="1"
              defaultValue={product?.lead_time_days ?? ""}
              disabled={isPending}
            />
          </div>
        </div>
      </div>

      <div className="admin-form__section">
        <h3>Images</h3>

        {mode === "edit" && images.length > 0 && (
          <div className="admin-image-gallery">
            {images.map((img) => {
              const url = `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/product-images/${img.storage_path}`;
              return (
                <div key={img.id} className="admin-image-gallery__item">
                  <img src={url} alt={img.alt_text ?? ""} />
                  {img.is_primary && (
                    <span className="admin-image-gallery__primary">
                      Primary
                    </span>
                  )}
                  {onDeleteImage && (
                    <button
                      type="button"
                      className="admin-image-gallery__delete"
                      aria-label="Delete image"
                      onClick={async () => {
                        if (confirm("Delete this image?")) {
                          await onDeleteImage(img.id);
                        }
                      }}
                    >
                      &times;
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="admin-form__field">
          <label htmlFor="images">
            {mode === "edit" ? "Add more images" : "Upload images"}
          </label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            disabled={isPending}
          />
          <span className="admin-form__help">
            First image becomes the primary. Max 5 MB each. JPG, PNG, WebP, AVIF.
          </span>
        </div>
      </div>

      <div className="admin-form__actions">
        <button
          type="submit"
          className="admin-btn"
          disabled={isPending}
        >
          {isPending
            ? "Saving..."
            : mode === "create"
              ? "Create product"
              : "Save changes"}
        </button>
        <a href="/admin/products" className="admin-btn admin-btn--ghost">
          Cancel
        </a>
      </div>
    </form>
  );
}
