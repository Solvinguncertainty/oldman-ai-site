import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../admin.css";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { markFulfilled, markPaid } from "./actions";

export const metadata: Metadata = {
  title: "Orders — Admin",
  robots: { index: false, follow: false },
};

type OrderRow = {
  id: string;
  stripe_session_id: string | null;
  status: string;
  customer_email: string | null;
  customer_name: string | null;
  shipping_name: string | null;
  shipping_address_line1: string | null;
  shipping_address_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  shipping_country: string | null;
  subtotal_cents: number | null;
  shipping_cents: number | null;
  tax_cents: number | null;
  total_cents: number | null;
  currency: string | null;
  fulfilled_at: string | null;
  created_at: string;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  product_snapshot: { name?: string; slug?: string };
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

function fmt(cents: number | null, currency: string | null = "CAD"): string {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(2)} ${currency ?? "CAD"}`;
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatAddress(o: OrderRow): string | null {
  if (!o.shipping_address_line1) return null;
  const parts = [
    o.shipping_name,
    o.shipping_address_line1,
    o.shipping_address_line2,
    [o.shipping_city, o.shipping_state, o.shipping_postal_code]
      .filter(Boolean)
      .join(", "),
    o.shipping_country,
  ].filter(Boolean);
  return parts.join("\n");
}

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const admin = createAdminClient();

  const { data: orders, error: ordersError } = await admin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  const tableMissing =
    !!ordersError && /relation .* does not exist/i.test(ordersError.message);

  if (tableMissing) {
    return (
      <div className="admin-shell">
        <header className="admin-topbar">
          <div className="admin-topbar__brand">
            <strong>Oldman AI Solutions</strong>
            <span>Admin</span>
          </div>
          <div className="admin-topbar__actions">
            <span className="admin-topbar__user">{user.email}</span>
            <form action="/admin/logout" method="post">
              <button type="submit" className="admin-topbar__logout">
                Sign out
              </button>
            </form>
          </div>
        </header>
        <main className="admin-main">
          <p className="admin-breadcrumb">
            <a href="/admin">Dashboard</a> &rsaquo; Orders
          </p>
          <h1>Orders</h1>
          <div className="admin-empty-state">
            <h3>Database table not created yet.</h3>
            <p>
              Open Supabase &rarr; SQL Editor and run migration{" "}
              <code>0003_orders.sql</code>. Then refresh this page.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const orderList = (orders ?? []) as OrderRow[];

  let itemsByOrder = new Map<string, OrderItemRow[]>();
  if (orderList.length > 0) {
    const { data: items } = await admin
      .from("order_items")
      .select("*")
      .in(
        "order_id",
        orderList.map((o) => o.id)
      );
    for (const item of (items ?? []) as OrderItemRow[]) {
      const arr = itemsByOrder.get(item.order_id) ?? [];
      arr.push(item);
      itemsByOrder.set(item.order_id, arr);
    }
  }

  const paidCount = orderList.filter(
    (o) => o.status === "paid"
  ).length;

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <strong>Oldman AI Solutions</strong>
          <span>Admin</span>
        </div>
        <div className="admin-topbar__actions">
          <span className="admin-topbar__user">{user.email}</span>
          <form action="/admin/logout" method="post">
            <button type="submit" className="admin-topbar__logout">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="admin-main">
        <p className="admin-breadcrumb">
          <a href="/admin">Dashboard</a> &rsaquo; Orders
        </p>

        <div className="admin-page-header">
          <div>
            <h1>Orders</h1>
            <p className="lead">
              {orderList.length === 0
                ? "No orders yet."
                : `${orderList.length} order${orderList.length === 1 ? "" : "s"}${paidCount > 0 ? ` — ${paidCount} awaiting fulfillment` : ""}.`}
            </p>
          </div>
        </div>

        {orderList.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No orders yet.</h3>
            <p>
              Orders paid through Stripe Checkout on The Craft will appear
              here.
            </p>
          </div>
        ) : (
          <div>
            {orderList.map((o) => {
              const items = itemsByOrder.get(o.id) ?? [];
              const address = formatAddress(o);
              const boundFulfill = markFulfilled.bind(null, o.id);
              const boundUnfulfill = markPaid.bind(null, o.id);
              return (
                <article key={o.id} className="admin-order">
                  <div className="admin-order__head">
                    <div>
                      <div className="admin-order__id">
                        #{o.id.slice(0, 8)}
                      </div>
                      <div className="admin-order__meta">
                        <span>{fmtDate(o.created_at)}</span>
                        <span
                          className={`admin-status admin-status--${
                            o.status === "paid"
                              ? "active"
                              : o.status === "fulfilled"
                                ? "active"
                                : "archived"
                          }`}
                        >
                          {o.status}
                        </span>
                        {o.customer_name && <span>{o.customer_name}</span>}
                        {o.customer_email && (
                          <a
                            href={`mailto:${o.customer_email}`}
                            style={{ color: "var(--blue)" }}
                          >
                            {o.customer_email}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="admin-order__total">
                      {fmt(o.total_cents, o.currency)}
                    </div>
                  </div>

                  {items.length > 0 && (
                    <div className="admin-order__items">
                      {items.map((item) => (
                        <div key={item.id} className="admin-order__item">
                          <span>
                            <strong>
                              {item.product_snapshot?.name ?? "Product"}
                            </strong>{" "}
                            &times; {item.quantity}
                          </span>
                          <span style={{ fontFamily: "monospace" }}>
                            {fmt(item.line_total_cents, o.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {address && (
                    <div className="admin-order__ship">
                      <strong>Ship to:</strong>
                      <pre
                        style={{
                          margin: "4px 0 0",
                          fontFamily: "inherit",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {address}
                      </pre>
                    </div>
                  )}

                  <div className="admin-order__actions">
                    {o.status === "paid" && (
                      <form action={boundFulfill}>
                        <button type="submit" className="admin-btn">
                          Mark fulfilled
                        </button>
                      </form>
                    )}
                    {o.status === "fulfilled" && (
                      <form action={boundUnfulfill}>
                        <button
                          type="submit"
                          className="admin-btn admin-btn--ghost"
                        >
                          Undo fulfilled
                        </button>
                      </form>
                    )}
                    {o.stripe_session_id && (
                      <a
                        href={`https://dashboard.stripe.com/payments/${o.stripe_session_id}`}
                        target="_blank"
                        rel="noopener"
                        className="admin-btn admin-btn--ghost"
                      >
                        View in Stripe &rarr;
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
