"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { updateUserProfileClient } from "@/lib/supabase/user-profiles-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserFriendlyError } from "@/lib/utils/error-messages";
import { messages } from "@/lib/messages";

export function DisplayNameForm({
  initialDisplayName,
  userId,
}: {
  initialDisplayName: string;
  userId: string;
}) {
  const router = useRouter();
  const t = messages.account;
  const a = messages.auth;
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfileClient(userId, { full_name: displayName.trim() || undefined });
      toast.success(t.profileUpdated);
      router.refresh();
    } catch (error: unknown) {
      toast.error(getUserFriendlyError(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          {t.displayName ?? "Nume afișat"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="displayName">{t.displayNameLabel ?? "Numele afișat la recenzii"}</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t.displayNamePlaceholder ?? "ex. Ion Popescu"}
              className="mt-2"
            />
          </div>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? a.saving : t.saveChanges}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
