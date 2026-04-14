"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductFormData } from "./admin-product-form-types";
import type { KeychainConfig } from "@/types/product";
import { messages } from "@/lib/messages";

function inquireFormValues(
  custom_config: ProductFormData["custom_config"]
): KeychainConfig {
  if (
    custom_config &&
    typeof custom_config === "object" &&
    "whatsappNumber" in custom_config
  ) {
    const c = custom_config as KeychainConfig;
    return {
      whatsappNumber: c.whatsappNumber,
      whatsappMessage: typeof c.whatsappMessage === "string" ? c.whatsappMessage : "",
    };
  }
  return { whatsappNumber: "", whatsappMessage: "" };
}

interface AdminInquireConfigCardProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function AdminInquireConfigCard({ formData, setFormData }: AdminInquireConfigCardProps) {
  const t = messages.admin;
  const inquire = inquireFormValues(formData.custom_config);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.inquireWhatsAppTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">{t.whatsAppNumberLabel}</Label>
          <Input
            id="whatsappNumber"
            type="tel"
            value={inquire.whatsappNumber}
            onChange={(e) =>
              setFormData({
                ...formData,
                custom_config: {
                  ...inquire,
                  whatsappNumber: e.target.value,
                },
              })
            }
            placeholder={t.whatsAppNumberPlaceholder}
          />
          <p className="text-xs text-muted-foreground">
            {t.whatsAppNumberHint}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappMessage">{t.customMessageTemplateLabel}</Label>
          <Textarea
            id="whatsappMessage"
            value={inquire.whatsappMessage ?? ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                custom_config: {
                  ...inquire,
                  whatsappMessage: e.target.value,
                },
              })
            }
            placeholder={t.whatsAppMessagePlaceholder}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            {t.whatsAppMessageHint}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
