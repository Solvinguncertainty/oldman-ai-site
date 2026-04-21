import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../admin.css";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  formatPrice,
  publicImageUrl,
  STORE_LABELS,
  type Product,
  type ProductImage,
} from "@/lib/products/types";

export const metadata: Metadata = {
  title: "Products — Admin — Oldman AI Solutions",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const admin = createAdminClient();

  const { data: products } = await admin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const productList = (products ?? []) as Product[];

  let primaryImageByProduct = new Map<string, ProductImage>();
  if (productList.length > 0) {
    const { data: imgs } = await admin
      .from("product_images")
      .select("*")
      .in(
        "product_id",
        productList.map((p) => p.id)
      );
    if (imgs) {
      for (const img of imgs as ProductImage[]) {
        const existing = primaryImageByProduct.get(img.product_id);
        if (!existing || img.is_primary) {
          primaryImageByProduct.set(img.product_id, img);
        }
      }
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

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
          <a href="/admin">Dashboard</a> &rsaquo; Products
        </p>

        <div className="admin-page-header">
          <div>
            <h1>Products</h1>
            <p className="lead">
              Your catalog for The Craft. Published items appear on the public
              shop immediately.
            </p>
          </div>
          <a href="/admin/products/new" className="admin-btn">
            + New product
          </a>
        </div>

        {productList.length === 0 ? (
          <div className="admin-empty-state">
            <h3>No products yet</h3>
            <p>
              Add your first product to start building out The Craft catalogue.
            </p>
            <a href="/admin/products/new" className="admin-btn">
              Create first product
            </a>
          </div>
        ) : (
          <table className="admin-products-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Store</th>
                <th>Status</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Slug</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((p) => {
                const img = primaryImageByProduct.get(p.id);
                const imgUrl = img
                  ? publicImageUrl(supabaseUrl, img.storage_path)
                  : null;
                return (
                  <tr key={p.id}>
                    <td style={{ width: 60 }}>
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt=""
                          className="admin-thumb"
                        />
                      ) : (
                        <div className="admin-thumb admin-thumb--empty">
                          ◆
                        </div>
                      )}
                    </td>
                    <td>
                      <a
                        href={`/admin/products/${p.id}`}
                        className="name-link"
                      >
                        {p.name}
                      </a>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          color:
                            p.store_slug === "joy-inc" ? "#D97A7A" : "#B88A4E",
                        }}
                      >
                        {STORE_LABELS[p.store_slug] ?? p.store_slug}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status admin-status--${p.status}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>{formatPrice(p.price_cents, p.currency)}</td>
                    <td>{p.inventory_count}</td>
                    <td>
                      <code style={{ fontSize: "0.8rem", color: "#6B7B8D" }}>
                        {p.slug}
                      </code>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
