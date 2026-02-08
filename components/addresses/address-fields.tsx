"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressFieldsProps } from "@/types/address-components";
import { useTranslations } from "@/components/locale-provider";

export function AddressFields({ formData, onChange }: AddressFieldsProps) {
  const t = useTranslations().checkout;
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">{t.firstName}</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => onChange({ ...formData, firstName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">{t.lastName}</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => onChange({ ...formData, lastName: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <Label htmlFor="address">{t.address}</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => onChange({ ...formData, address: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">{t.city}</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => onChange({ ...formData, city: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="state">{t.state}</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => onChange({ ...formData, state: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="zip">{t.zip}</Label>
          <Input
            id="zip"
            value={formData.zip}
            onChange={(e) => onChange({ ...formData, zip: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">{t.country}</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => onChange({ ...formData, country: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">{t.phoneOptional}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone || ""}
            onChange={(e) => onChange({ ...formData, phone: e.target.value })}
          />
        </div>
      </div>
    </>
  );
}

