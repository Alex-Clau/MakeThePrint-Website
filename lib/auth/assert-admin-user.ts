import { createClient } from "@/lib/supabase/server";

export type AdminGuardResult = { ok: true } | { ok: false; status: 401 | 403 };

export async function assertAdminUser(): Promise<AdminGuardResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, status: 401 };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return { ok: false, status: 403 };
  }

  return { ok: true };
}
