"use client";

import type { SupabaseClient } from "@supabase/supabase-js";

/** SessionStorage key: set after sign-up before navigating to sign-up-success. */
export const SIGNUP_EMAIL_SESSION_KEY = "mtp_signup_email";

const OAUTH_POST_LOGIN_PATH = "/account";

export async function signInWithGoogle(supabase: SupabaseClient) {
  const qs = new URLSearchParams({ next: OAUTH_POST_LOGIN_PATH }).toString();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback?${qs}`,
    },
  });
}
