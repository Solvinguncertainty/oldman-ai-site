import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

async function recordOrderFromSession(session: Stripe.Checkout.Session) {
  const admin = createAdminClient();
  const stripe = getStripe();

  // Fetch line items (requires a second API call)
  const lineItemsRes = await stripe.checkout.sessions.listLineItems(
    session.id,
    { limit: 20, expand: ["data.price.product"] }
  );

  const productIdFromMeta = session.metadata?.product_id ?? null;
  const productSlug = session.metadata?.product_slug ?? null;
  const productName = session.metadata?.product_name ?? "Unknown product";
  const storeSlugMeta = session.metadata?.store ?? "the-craft";
  const storeSlug =
    storeSlugMeta === "joy-inc" ? "joy-inc" : "the-craft";

  // The shape of shipping info varies slightly between Stripe API versions.
  // Normalize via an opaque type so both shapes work.
  const shipping = (session as unknown as {
    shipping_details?: {
      name?: string | null;
      address?: {
        line1?: string | null;
        line2?: string | null;
        city?: string | null;
        state?: string | null;
        postal_code?: string | null;
        country?: string | null;
      } | null;
    } | null;
    collected_information?: {
      shipping_details?: {
        name?: string | null;
        address?: {
          line1?: string | null;
          line2?: string | null;
          city?: string | null;
          state?: string | null;
          postal_code?: string | null;
          country?: string | null;
        } | null;
      } | null;
    } | null;
  }).shipping_details ??
    (session as unknown as {
      collected_information?: {
        shipping_details?: {
          name?: string | null;
          address?: {
            line1?: string | null;
            line2?: string | null;
            city?: string | null;
            state?: string | null;
            postal_code?: string | null;
            country?: string | null;
          } | null;
        } | null;
      } | null;
    }).collected_information?.shipping_details ??
    null;
  const customerDetails = session.customer_details;

  // Upsert order
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .upsert(
      {
        stripe_session_id: session.id,
        store_slug: storeSlug,
        stripe_payment_intent:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
        status: session.payment_status === "paid" ? "paid" : "pending",
        customer_email: session.customer_email ?? customerDetails?.email ?? null,
        customer_name: customerDetails?.name ?? null,
        shipping_name: shipping?.name ?? customerDetails?.name ?? null,
        shipping_address_line1: shipping?.address?.line1 ?? null,
        shipping_address_line2: shipping?.address?.line2 ?? null,
        shipping_city: shipping?.address?.city ?? null,
        shipping_state: shipping?.address?.state ?? null,
        shipping_postal_code: shipping?.address?.postal_code ?? null,
        shipping_country: shipping?.address?.country ?? null,
        subtotal_cents: session.amount_subtotal ?? null,
        shipping_cents:
          session.shipping_cost?.amount_total ?? null,
        tax_cents: session.total_details?.amount_tax ?? null,
        total_cents: session.amount_total ?? null,
        currency: (session.currency ?? "cad").toUpperCase(),
        raw_event: session as unknown as Record<string, unknown>,
      },
      { onConflict: "stripe_session_id" }
    )
    .select()
    .single();

  if (orderErr || !order) {
    console.error("Failed to upsert order:", orderErr);
    return;
  }

  // Insert order items (only if we don't already have them)
  const { data: existingItems } = await admin
    .from("order_items")
    .select("id")
    .eq("order_id", order.id)
    .limit(1);

  if (!existingItems || existingItems.length === 0) {
    const items = lineItemsRes.data.map((item) => ({
      order_id: order.id,
      product_id: productIdFromMeta,
      product_snapshot: {
        name: item.description ?? productName,
        slug: productSlug,
        stripe_price: item.price?.id ?? null,
      },
      quantity: item.quantity ?? 1,
      unit_price_cents: item.price?.unit_amount ?? 0,
      line_total_cents: item.amount_total ?? 0,
    }));
    if (items.length > 0) {
      await admin.from("order_items").insert(items);
    }
  }

  // Decrement product inventory
  const quantity = Number(session.metadata?.quantity ?? "1") || 1;
  if (productIdFromMeta) {
    const { data: p } = await admin
      .from("products")
      .select("inventory_count")
      .eq("id", productIdFromMeta)
      .single();
    if (p) {
      const newCount = Math.max(0, (p.inventory_count ?? 0) - quantity);
      await admin
        .from("products")
        .update({ inventory_count: newCount })
        .eq("id", productIdFromMeta);
    }
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "signature verification failed";
    console.error("Webhook signature failed:", msg);
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        await recordOrderFromSession(session);
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const admin = createAdminClient();
        await admin
          .from("orders")
          .update({
            status: event.type.endsWith("failed") ? "failed" : "canceled",
          })
          .eq("stripe_session_id", session.id);
        break;
      }
      default:
        // No-op for other events
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
