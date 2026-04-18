"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
}

export async function markFulfilled(orderId: string) {
  await requireAuth();
  const admin = createAdminClient();
  await admin
    .from("orders")
    .update({
      status: "fulfilled",
      fulfilled_at: new Date().toISOString(),
    })
    .eq("id", orderId);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function markPaid(orderId: string) {
  await requireAuth();
  const admin = createAdminClient();
  await admin
    .from("orders")
    .update({ status: "paid", fulfilled_at: null })
    .eq("id", orderId);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}
