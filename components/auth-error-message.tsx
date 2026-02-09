"use client";

import { useTranslations } from "@/components/locale-provider";

interface AuthErrorMessageProps {
  error?: string | null;
  error_code?: string | null;
}

export function AuthErrorMessage({ error, error_code }: AuthErrorMessageProps) {
  const t = useTranslations().auth;

  const code = error_code || error;
  if (code === "otp_expired") {
    return <p className="text-sm text-muted-foreground">{t.linkExpired}</p>;
  }
  if (code === "access_denied") {
    return <p className="text-sm text-muted-foreground">{t.accessDenied}</p>;
  }
  if (code === "no_token") {
    return <p className="text-sm text-muted-foreground">{t.noToken}</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Code error: {error}
      </p>
    );
  }
  return (
    <p className="text-sm text-muted-foreground">
      An unspecified error occurred.
    </p>
  );
}
