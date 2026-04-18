import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client — uses service_role key, full access.
 * Only use inside server-side code (API routes, server actions).
 * NEVER import this file from a Client Component.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
