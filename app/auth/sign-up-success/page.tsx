"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";

export default function Page() {
  const [resent, setResent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  // Get email from URL params
  const [email] = useState(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("email") || "";
    }
    return "";
  });

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    const supabase = createClient();
    
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });
      
      if (error) throw error;
      setResent(true);
      toast.success("Confirmation email resent!");
    } catch (error: any) {
      toast.error(getUserFriendlyError(error));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">
                  Check your email
                </CardTitle>
              </div>
              <CardDescription>
                We&apos;ve sent a confirmation link to your email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in the email to confirm your account. The link will expire in 24 hours.
              </p>
              
              {email && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Email sent to:</p>
                  <p className="text-sm font-medium">{email}</p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or:
                </p>
                {resent ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Email resent! Check your inbox.</span>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResendEmail}
                    disabled={isResending || !email}
                  >
                    {isResending ? "Sending..." : "Resend confirmation email"}
                  </Button>
                )}
              </div>

              <div className="pt-4 border-t">
                <Link href="/auth/login">
                  <Button variant="link" className="w-full">
                    Back to login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
