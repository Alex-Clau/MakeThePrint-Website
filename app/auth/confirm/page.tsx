"use client";

/**
 * Email confirmation. Expects link from Supabase template:
 * {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup
 * We show a button and only verify on click so prefetchers don't consume the token.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Status = "loading" | "interstitial" | "confirming" | "error";

export default function AuthConfirmPage() {
  const router = useRouter();
  const t = useTranslations().auth;
  const [status, setStatus] = useState<Status>("loading");
  const [pendingToken, setPendingToken] = useState<{ token_hash: string; type: string } | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");

    const errorCode = query.get("error_code");
    const errorParam = query.get("error");
    if (errorCode || errorParam) {
      setStatus("error");
      router.replace(
        errorCode
          ? `/auth/error?error_code=${encodeURIComponent(errorCode)}`
          : `/auth/error?error=${encodeURIComponent(errorParam!)}`
      );
      return;
    }

    const token_hash = query.get("token_hash");
    const type = query.get("type");
    if (token_hash && type) {
      setPendingToken({ token_hash, type });
      setStatus("interstitial");
      return;
    }

    setStatus("error");
    router.replace("/auth/error?error_code=no_token");
  }, [router]);

  const handleConfirmClick = async () => {
    if (!pendingToken) return;
    setStatus("confirming");
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      type: pendingToken.type as "signup" | "email",
      token_hash: pendingToken.token_hash,
    });
    if (error) {
      setStatus("error");
      router.replace(`/auth/error?error=${encodeURIComponent(error.message)}`);
      return;
    }
    router.replace("/");
  };

  if (status === "error") return null;

  if (status === "interstitial") {
    return (
      <div className="flex min-h-svh items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{t.confirmEmailTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{t.confirmEmailClick}</p>
            <Button className="w-full" onClick={handleConfirmClick}>
              {t.confirmEmailButton}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <p className="text-muted-foreground">{t.confirmingEmail}</p>
    </div>
  );
}
