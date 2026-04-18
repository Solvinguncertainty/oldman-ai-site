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

export async function markRead(id: string) {
  await requireAuth();
  const admin = createAdminClient();
  await admin
    .from("contact_submissions")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
}

export async function markUnread(id: string) {
  await requireAuth();
  const admin = createAdminClient();
  await admin
    .from("contact_submissions")
    .update({ read_at: null })
    .eq("id", id);
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
}

export async function deleteSubmission(id: string) {
  await requireAuth();
  const admin = createAdminClient();
  await admin.from("contact_submissions").delete().eq("id", id);
  revalidatePath("/admin/contact");
  revalidatePath("/admin");
}
