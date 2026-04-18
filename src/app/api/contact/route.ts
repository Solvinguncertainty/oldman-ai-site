import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const name = String(body.firstName ?? body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const organization =
    String(body.org ?? body.organization ?? "").trim() || null;
  const interest = String(body.interest ?? "").trim() || null;
  const message = String(body.message ?? "").trim() || null;

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }

  // Light bot trap: honeypot field
  if (String(body.website ?? "").length > 0) {
    // Silently succeed so bots don't retry
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null;
  const ua = request.headers.get("user-agent")?.slice(0, 500) ?? null;

  const admin = createAdminClient();
  const { error } = await admin.from("contact_submissions").insert({
    name,
    email,
    organization,
    interest,
    message,
    source: "homepage",
    ip_hash: hashIp(ip),
    user_agent: ua,
  });

  if (error) {
    console.error("Contact insert failed:", error);
    return NextResponse.json(
      { error: "Could not save message. Please email greg@oldmanaisolutions.com instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
