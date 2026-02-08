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
import { ProfileFormProps } from "@/types/account";
import { useTranslations } from "@/components/locale-provider";

export function ProfileForm({ initialData, userId }: ProfileFormProps) {
  const router = useRouter();
  const t = useTranslations().account;
  const a = useTranslations().auth;
  const [formData, setFormData] = useState({
    email: initialData.email || "",
    full_name: initialData.full_name || "",
    phone: initialData.phone || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserProfileClient(userId, formData);
      toast.success(t.profileUpdated);
      router.refresh();
    } catch (error: any) {
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
          {t.profileInfo}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{a.email}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="full_name">{t.fullName}</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
            />
          </div>
          <div>
            <Label htmlFor="phone">{t.phone}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
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

