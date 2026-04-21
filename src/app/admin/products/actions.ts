"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, type Currency, type ProductStatus, type StoreSlug } from "@/lib/products/types";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return supabase;
}

type ActionResult = { error: string | null };

function extractForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const priceStr = String(formData.get("price") ?? "0").trim();
  const inventoryStr = String(formData.get("inventory_count") ?? "0").trim();
  const currency = (String(formData.get("currency") ?? "CAD").trim() ||
    "CAD") as Currency;
  const status = (String(formData.get("status") ?? "draft").trim() ||
    "draft") as ProductStatus;
  const storeInput = String(formData.get("store_slug") ?? "the-craft").trim();
  const store_slug = (
    storeInput === "joy-inc" ? "joy-inc" : "the-craft"
  ) as StoreSlug;
  const materials = String(formData.get("materials") ?? "").trim() || null;
  const dimensions = String(formData.get("dimensions") ?? "").trim() || null;

  const weightStr = String(formData.get("weight_grams") ?? "").trim();
  const leadTimeStr = String(formData.get("lead_time_days") ?? "").trim();

  const priceFloat = Number.parseFloat(priceStr);
  const price_cents = Number.isFinite(priceFloat)
    ? Math.round(priceFloat * 100)
    : 0;
  const inventory_count = Number.parseInt(inventoryStr, 10) || 0;
  const weight_grams = weightStr ? Number.parseInt(weightStr, 10) : null;
  const lead_time_days = leadTimeStr ? Number.parseInt(leadTimeStr, 10) : null;

  const slug = slugify(slugInput || name);

  return {
    name,
    slug,
    store_slug,
    description,
    price_cents,
    currency,
    inventory_count,
    status,
    materials,
    dimensions,
    weight_grams,
    lead_time_days,
  };
}

async function uploadImages(
  productId: string,
  files: File[]
): Promise<{ path: string; is_primary: boolean }[]> {
  const admin = createAdminClient();
  const uploaded: { path: string; is_primary: boolean }[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!file || file.size === 0) continue;
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${productId}/${randomUUID()}.${ext}`;

    const { error } = await admin.storage
      .from("product-images")
      .upload(path, file, {
        contentType: file.type || "image/jpeg",
        upsert: false,
      });

    if (error) {
      console.error("Image upload failed:", error);
      continue;
    }

    uploaded.push({ path, is_primary: i === 0 });
  }

  return uploaded;
}

export async function createProductAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth();
  } catch {
    return { error: "Not authenticated." };
  }

  const data = extractForm(formData);
  if (!data.name) return { error: "Name is required." };
  if (!data.slug) return { error: "Slug is required." };

  const admin = createAdminClient();

  const { data: product, error: insertError } = await admin
    .from("products")
    .insert(data)
    .select()
    .single();

  if (insertError || !product) {
    return { error: insertError?.message ?? "Failed to create product." };
  }

  // Handle images if any were uploaded
  const imageFiles = formData.getAll("images") as File[];
  const filesWithContent = imageFiles.filter((f) => f && f.size > 0);
  if (filesWithContent.length > 0) {
    const uploads = await uploadImages(product.id, filesWithContent);
    if (uploads.length > 0) {
      await admin.from("product_images").insert(
        uploads.map((u, idx) => ({
          product_id: product.id,
          storage_path: u.path,
          is_primary: u.is_primary,
          position: idx,
        }))
      );
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop/the-craft"); revalidatePath("/shop/joy-inc");
  redirect(`/admin/products/${product.id}`);
}

export async function updateProductAction(
  productId: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth();
  } catch {
    return { error: "Not authenticated." };
  }

  const data = extractForm(formData);
  if (!data.name) return { error: "Name is required." };
  if (!data.slug) return { error: "Slug is required." };

  const admin = createAdminClient();

  const { error: updateError } = await admin
    .from("products")
    .update(data)
    .eq("id", productId);

  if (updateError) return { error: updateError.message };

  // Handle new image uploads (appended, not replaced)
  const imageFiles = formData.getAll("images") as File[];
  const filesWithContent = imageFiles.filter((f) => f && f.size > 0);
  if (filesWithContent.length > 0) {
    const uploads = await uploadImages(productId, filesWithContent);
    if (uploads.length > 0) {
      // Figure out if there's already a primary image
      const { data: existing } = await admin
        .from("product_images")
        .select("id")
        .eq("product_id", productId)
        .eq("is_primary", true)
        .limit(1);
      const hasPrimary = (existing?.length ?? 0) > 0;

      await admin.from("product_images").insert(
        uploads.map((u, idx) => ({
          product_id: productId,
          storage_path: u.path,
          is_primary: !hasPrimary && idx === 0,
          position: idx + 100, // append
        }))
      );
    }
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop/the-craft"); revalidatePath("/shop/joy-inc");
  return { error: null };
}

export async function deleteProductAction(productId: string): Promise<void> {
  try {
    await requireAuth();
  } catch {
    throw new Error("Not authenticated");
  }

  const admin = createAdminClient();

  // Delete associated storage files
  const { data: imgs } = await admin
    .from("product_images")
    .select("storage_path")
    .eq("product_id", productId);

  if (imgs && imgs.length > 0) {
    await admin.storage
      .from("product-images")
      .remove(imgs.map((i) => i.storage_path));
  }

  await admin.from("products").delete().eq("id", productId);

  revalidatePath("/admin/products");
  revalidatePath("/shop/the-craft"); revalidatePath("/shop/joy-inc");
  redirect("/admin/products");
}

export async function deleteImageAction(
  imageId: string,
  productId: string
): Promise<void> {
  try {
    await requireAuth();
  } catch {
    throw new Error("Not authenticated");
  }

  const admin = createAdminClient();

  const { data: img } = await admin
    .from("product_images")
    .select("storage_path")
    .eq("id", imageId)
    .single();

  if (img?.storage_path) {
    await admin.storage.from("product-images").remove([img.storage_path]);
  }

  await admin.from("product_images").delete().eq("id", imageId);

  revalidatePath(`/admin/products/${productId}`);
  revalidatePath("/shop/the-craft"); revalidatePath("/shop/joy-inc");
}
