"use client";

import { messages } from "@/lib/messages";

interface AuthErrorMessageProps {
  error?: string | null;
  error_code?: string | null;
}

export function AuthErrorMessage({ error, error_code }: AuthErrorMessageProps) {
  const t = messages.auth;

  if (error_code === "otp_expired") {
    return <p className="text-sm text-muted-foreground">{t.linkExpired}</p>;
  }
  if (error_code === "access_denied") {
    return <p className="text-sm text-muted-foreground">{t.accessDenied}</p>;
  }
  if (error_code === "no_token") {
    return <p className="text-sm text-muted-foreground">{t.noToken}</p>;
  }
  if (error) {
    return <p className="text-sm text-muted-foreground">{error}</p>;
  }
  if (error_code) {
    return <p className="text-sm text-muted-foreground">{t.errorOccurred}</p>;
  }
  return <p className="text-sm text-muted-foreground">{t.errorOccurred}</p>;
}
