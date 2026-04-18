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
          You&rsquo;re signed in as <strong>{user.email}</strong>. This is your
          admin dashboard. Nothing to manage here yet &mdash; product management,
          orders, and subscriber lists will appear here in upcoming steps.
        </p>

        <div className="admin-card">
          <h2>What&rsquo;s coming next</h2>
          <p>
            Step 3 will add a product manager so you can create, edit, and publish
            your 3D printed products. Step 4 will expose them publicly at{" "}
            <code>/shop</code>. Step 5 wires up Stripe Checkout so customers can
            actually buy them.
          </p>
        </div>

        <div className="admin-card">
          <h2>Status</h2>
          <p>
            Supabase: connected. Auth: working. Build phase: Step 2 of the
            roadmap.
          </p>
        </div>
      </main>
    </div>
  );
}
