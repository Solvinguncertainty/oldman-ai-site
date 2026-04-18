import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "./admin.css";
import { createClient } from "@/lib/supabase/server";

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
            Manage the catalog for <strong>The Craft</strong>. Add, edit, publish,
            and archive products. Active items appear immediately on{" "}
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
          <h2>Coming next</h2>
          <p>
            Step 4 will add a product detail page (<code>/shop/[slug]</code>) and
            polish the public catalogue. Step 5 wires up Stripe Checkout so
            customers can actually buy.
          </p>
        </div>

        <div className="admin-card">
          <h2>Status</h2>
          <p>
            Supabase: connected. Auth: working. Build phase: Step 3 complete
            (product management).
          </p>
        </div>
      </main>
    </div>
  );
}
