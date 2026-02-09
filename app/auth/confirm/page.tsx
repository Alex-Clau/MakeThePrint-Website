"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/components/locale-provider";

export default function AuthConfirmPage() {
  const router = useRouter();
  const t = useTranslations().auth;
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    const confirm = async () => {
      const supabase = createClient();

      // PKCE flow: Supabase puts tokens in the URL hash (not sent to server)
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const params = new URLSearchParams(hash.replace(/^#/, ""));
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const typeFromHash = params.get("type");

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (!error) {
          router.replace("/");
          return;
        }
        setStatus("error");
        router.replace(`/auth/error?error=${encodeURIComponent(error.message)}`);
        return;
      }

      // Legacy flow: token_hash and type in query (server would see these)
      const search = typeof window !== "undefined" ? window.location.search : "";
      const query = new URLSearchParams(search);
      const token_hash = query.get("token_hash");
      const type = query.get("type");

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type: type as "signup" | "email",
          token_hash,
        });
        if (!error) {
          router.replace("/");
          return;
        }
        setStatus("error");
        router.replace(`/auth/error?error=${encodeURIComponent(error.message)}`);
        return;
      }

      setStatus("error");
      router.replace("/auth/error?error=No+token+hash+or+type");
    };

    confirm();
  }, [router]);

  if (status === "error") return null;
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <p className="text-muted-foreground">{t.confirmingEmail}</p>
    </div>
  );
}
