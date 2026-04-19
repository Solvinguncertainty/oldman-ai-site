import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import "../../admin.css";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ProductForm from "../ProductForm";
import {
  updateProductAction,
  deleteProductAction,
  deleteImageAction,
} from "../actions";
import type { Product, ProductImage } from "@/lib/products/types";

export const metadata: Metadata = {
  title: "Edit product — Admin",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const admin = createAdminClient();

  const { data: product } = await admin
    .from("products")
    .select("*")
    .eq("id", id)
    .single<Product>();

  if (!product) notFound();

  const { data: images } = await admin
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("position", { ascending: true });

  const imageList = (images ?? []) as ProductImage[];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  // Bind server actions
  const boundUpdate = updateProductAction.bind(null, id);
  const boundDelete = deleteProductAction.bind(null, id);
  const boundDeleteImage = async (imageId: string) => {
    "use server";
    await deleteImageAction(imageId, id);
  };

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
          <a href="/admin">Dashboard</a> &rsaquo;{" "}
          <a href="/admin/products">Products</a> &rsaquo; {product.name}
        </p>

        <div className="admin-page-header">
          <div>
            <h1>{product.name}</h1>
            <p className="lead">
              {product.status === "active" ? (
                <>
                  Live at{" "}
                  <a href={`/shop/${product.slug}`} target="_blank">
                    /shop/{product.slug}
                  </a>
                </>
              ) : (
                <>Not yet published. Set status to Active to show on the shop.</>
              )}
            </p>
          </div>
          <form action={boundDelete}>
            <button
              type="submit"
              className="admin-btn admin-btn--danger"
              onClick={(e) => {
                if (
                  !confirm(
                    `Delete "${product.name}"? This removes all images and cannot be undone.`
                  )
                ) {
                  e.preventDefault();
                }
              }}
            >
              Delete product
            </button>
          </form>
        </div>

        <ProductForm
          mode="edit"
          product={product}
          images={imageList}
          supabaseUrl={supabaseUrl}
          action={boundUpdate}
          onDeleteImage={boundDeleteImage}
        />
      </main>
    </div>
  );
}
