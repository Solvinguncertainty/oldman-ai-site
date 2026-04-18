export type ProductStatus = "draft" | "active" | "archived";
export type Currency = "CAD" | "USD";

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_cents: number;
  currency: Currency;
  inventory_count: number;
  status: ProductStatus;
  materials: string | null;
  dimensions: string | null;
  weight_grams: number | null;
  lead_time_days: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  position: number;
  is_primary: boolean;
  created_at: string;
};

export type ProductWithImages = Product & {
  images: ProductImage[];
  primary_image_url: string | null;
};

export function formatPrice(cents: number, currency: Currency = "CAD"): string {
  const dollars = (cents / 100).toFixed(2);
  return `$${dollars} ${currency}`;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 80);
}

export function publicImageUrl(
  supabaseUrl: string,
  storagePath: string
): string {
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/product-images/${storagePath}`;
}
