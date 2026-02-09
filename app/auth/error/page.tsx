import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthErrorMessage } from "@/components/auth-error-message";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_code?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthErrorMessage error={params?.error} error_code={params?.error_code} />
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; error_code?: string }>;
}) {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Sorry, something went wrong.
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Suspense>
                <ErrorContent searchParams={searchParams} />
              </Suspense>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/sign-up">Try signing up again</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
