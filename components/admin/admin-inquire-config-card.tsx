"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductFormData } from "./admin-product-form-types";

interface AdminInquireConfigCardProps {
  formData: ProductFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProductFormData>>;
}

export function AdminInquireConfigCard({ formData, setFormData }: AdminInquireConfigCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inquire – WhatsApp (optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
          <Input
            id="whatsappNumber"
            type="tel"
            value={formData.custom_config?.whatsappNumber || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                custom_config: {
                  ...formData.custom_config,
                  whatsappNumber: e.target.value,
                },
              })
            }
            placeholder="e.g., 40712345678 (country code + number, no spaces)"
          />
          <p className="text-xs text-muted-foreground">
            Enter phone number with country code (e.g., 40712345678 for Romania)
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsappMessage">Custom Message Template (Optional)</Label>
          <Textarea
            id="whatsappMessage"
            value={formData.custom_config?.whatsappMessage || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                custom_config: {
                  ...formData.custom_config,
                  whatsappMessage: e.target.value,
                },
              })
            }
            placeholder="Hi! I'm interested in the {product_name}. Can you provide more details?"
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Leave blank to use default message.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
