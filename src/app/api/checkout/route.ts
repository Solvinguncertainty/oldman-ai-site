import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, isStripeConfigured, publicAppUrl } from "@/lib/stripe";
import { publicImageUrl, type Product } from "@/lib/products/types";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      {
        error:
          "Checkout is not yet configured. Please email greg@oldmanaisolutions.com to place an order.",
      },
      { status: 503 }
    );
  }

  let body: { slug?: string; quantity?: number } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const slug = String(body.slug ?? "").trim();
  const quantity = Math.max(1, Math.min(99, Number(body.quantity ?? 1) || 1));

  if (!slug) {
    return NextResponse.json({ error: "Missing product slug." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: product, error } = await admin
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .single<Product>();

  if (error || !product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  if (product.inventory_count < quantity) {
    return NextResponse.json(
      { error: "Not enough inventory available." },
      { status: 400 }
    );
  }

  const { data: images } = await admin
    .from("product_images")
    .select("storage_path, is_primary")
    .eq("product_id", product.id)
    .order("position", { ascending: true });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const imageUrls =
    (images ?? [])
      .slice(0, 8)
      .map((i) => publicImageUrl(supabaseUrl, i.storage_path))
      .filter(Boolean) ?? [];

  const stripe = getStripe();
  const appUrl = publicAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        quantity,
        price_data: {
          currency: product.currency.toLowerCase(),
          unit_amount: product.price_cents,
          product_data: {
            name: product.name,
            description: product.description?.slice(0, 350) ?? undefined,
            images: imageUrls.length > 0 ? imageUrls : undefined,
            metadata: {
              product_id: product.id,
              slug: product.slug,
            },
          },
        },
      },
    ],
    metadata: {
      product_id: product.id,
      product_slug: product.slug,
      product_name: product.name,
      quantity: String(quantity),
    },
    shipping_address_collection: {
      allowed_countries: ["CA", "US"],
    },
    phone_number_collection: { enabled: true },
    billing_address_collection: "auto",
    success_url: `${appUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/shop/${product.slug}?canceled=1`,
    allow_promotion_codes: true,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Could not create checkout session." },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: session.url });
}
