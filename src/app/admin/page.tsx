import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "./admin.css";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin Dashboard — Old Man AI Solutions",
  robots: { index: false, follow: false },
};

export default async function AdminHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware should have already redirected anonymous users,
  // but double-check here as defense in depth.
  if (!user) {
    redirect("/admin/login");
  }

  // Dashboard counts
  const admin = createAdminClient();
  const [{ count: productCount }, { count: unreadCount }] = await Promise.all([
    admin.from("products").select("*", { count: "exact", head: true }),
    admin
      .from("contact_submissions")
      .select("*", { count: "exact", head: true })
      .is("read_at", null),
  ]);

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <strong>Old Man AI Solutions</strong>
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
        <h1>Welcome back, Greg.</h1>
        <p className="lead">
          You&rsquo;re signed in as <strong>{user.email}</strong>. Everything you
          manage across oldmanaisolutions.com and The Craft lives here.
        </p>

        <div className="admin-card">
          <h2>
            <a
              href="/admin/products"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Products &rsaquo;
            </a>
          </h2>
          <p>
            {productCount === 0 || productCount == null
              ? "No products yet. "
              : `${productCount} total product${productCount === 1 ? "" : "s"}. `}
            Manage the catalog for <strong>The Craft</strong>. Active items
            appear immediately on{" "}
            <a href="/shop" target="_blank">/shop</a>.
          </p>
          <p style={{ marginTop: "16px" }}>
            <a href="/admin/products" className="admin-btn">
              Open product manager
            </a>{" "}
            <a
              href="/admin/products/new"
              className="admin-btn admin-btn--ghost"
              style={{ marginLeft: 8 }}
            >
              + New product
            </a>
          </p>
        </div>

        <div className="admin-card">
          <h2>
            <a
              href="/admin/contact"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              Contact submissions &rsaquo;
            </a>
          </h2>
          <p>
            {unreadCount && unreadCount > 0
              ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}. `
              : "No unread messages. "}
            Submissions from the contact form on oldmanaisolutions.com land
            here.
          </p>
          <p style={{ marginTop: "16px" }}>
            <a href="/admin/contact" className="admin-btn">
              View inbox
            </a>
          </p>
        </div>

        <div className="admin-card">
          <h2>Coming next</h2>
          <p>
            Cart + Stripe Checkout is the next big piece. After that: order
            tracking, shipping, and real photography for the About section.
          </p>
        </div>
      </main>
    </div>
  );
}
