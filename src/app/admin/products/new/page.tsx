import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../../admin.css";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";
import { createProductAction } from "../actions";

export const metadata: Metadata = {
  title: "New product — Admin",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

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
        <p className="admin-breadcrumb">
          <a href="/admin">Dashboard</a> &rsaquo;{" "}
          <a href="/admin/products">Products</a> &rsaquo; New
        </p>
        <h1>New product</h1>
        <p className="lead">
          Save as <strong>Draft</strong> while you work; switch to{" "}
          <strong>Active</strong> when it&rsquo;s ready to go public.
        </p>

        <ProductForm mode="create" action={createProductAction} />
      </main>
    </div>
  );
}
