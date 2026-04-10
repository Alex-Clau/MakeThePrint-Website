"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { AddressFields } from "./address-fields";
import { AddressFormProps } from "@/types/address-components";
import { AddressFormData } from "@/types";
import { messages } from "@/lib/messages";

export function AddressForm({ onSave, initialData, onCancel }: AddressFormProps) {
  const t = messages.account;
  const a = messages.admin;
  const [formData, setFormData] = useState<AddressFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    address: initialData?.address || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zip: initialData?.zip || "",
    country: initialData?.country || "Romania",
    phone: initialData?.phone || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          {initialData ? t.editAddress : t.addNewAddress}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AddressFields formData={formData} onChange={setFormData} />
          <div className="flex gap-2">
            <Button type="submit">{t.saveAddress}</Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {a.cancel}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

