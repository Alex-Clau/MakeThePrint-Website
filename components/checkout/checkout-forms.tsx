"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckoutFormsProps } from "@/types/checkout";
import { AddressFormData } from "@/types";
import { messages } from "@/lib/messages";

function formatAddressLabel(addr: AddressFormData, index: number): string {
  const parts = [addr.firstName, addr.lastName, addr.city].filter(Boolean);
  return parts.length > 0 ? `${parts.join(", ")}` : `Adresa ${index + 1}`;
}

export function CheckoutForms({
  onFormDataChange,
  savedAddresses = [],
  userEmail,
}: CheckoutFormsProps) {
  const t = messages.checkout;
  const [shipping, setShipping] = useState<AddressFormData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Romania",
    phone: "",
  });
  const [email, setEmail] = useState(userEmail ?? "");
  const [saveAddress, setSaveAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  useEffect(() => {
    if (userEmail && !email) setEmail(userEmail);
  }, [userEmail, email]);

  const applySavedAddress = (addr: AddressFormData) => {
    setShipping({
      firstName: addr.firstName ?? "",
      lastName: addr.lastName ?? "",
      address: addr.address ?? "",
      city: addr.city ?? "",
      state: addr.state ?? "",
      zip: addr.zip ?? "",
      country: addr.country ?? "Romania",
      phone: addr.phone ?? "",
    });
    if (userEmail) setEmail(userEmail);
    onFormDataChange({
      shipping: { ...addr, email: userEmail ?? "" },
      saveAddress,
    });
  };

  const updateFormData = (
    shippingUpdate?: Partial<AddressFormData>,
    emailUpdate?: string,
    saveAddressUpdate?: boolean
  ) => {
    const newShipping = shippingUpdate
      ? { ...shipping, ...shippingUpdate }
      : shipping;
    const newEmail = emailUpdate !== undefined ? emailUpdate : email;
    const newSaveAddress = saveAddressUpdate !== undefined ? saveAddressUpdate : saveAddress;

    if (shippingUpdate) setShipping(newShipping);
    if (emailUpdate !== undefined) setEmail(newEmail);
    if (saveAddressUpdate !== undefined) setSaveAddress(newSaveAddress);

    onFormDataChange({
      shipping: { ...newShipping, email: newEmail },
      saveAddress: newSaveAddress,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.shippingAddress}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {savedAddresses.length > 0 && (
            <div>
              <Label>{t.useSavedAddress}</Label>
              <Select
                value={selectedAddressId}
                onValueChange={(value) => {
                  setSelectedAddressId(value);
                  const idx = parseInt(value, 10);
                  if (!isNaN(idx) && idx >= 0 && savedAddresses[idx]) {
                    applySavedAddress(savedAddresses[idx]);
                  }
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t.selectSavedAddress} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">{t.selectSavedAddress}</SelectItem>
                  {savedAddresses.map((addr, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      {formatAddressLabel(addr, idx)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">{t.firstName}</Label>
              <Input
                id="firstName"
                value={shipping.firstName}
                onChange={(e) =>
                  updateFormData({ firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">{t.lastName}</Label>
              <Input
                id="lastName"
                value={shipping.lastName}
                onChange={(e) =>
                  updateFormData({ lastName: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email">{t.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  updateFormData(undefined, e.target.value);
                }}
                required
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                title={t.validEmailTitle}
              />
          </div>
          <div>
            <Label htmlFor="phone">{t.phoneOptional}</Label>
              <Input
                id="phone"
                type="tel"
                value={shipping.phone || ""}
                onChange={(e) =>
                  updateFormData({ phone: e.target.value })
                }
              />
          </div>
          <div>
            <Label htmlFor="address">{t.address}</Label>
              <Input
                id="address"
                value={shipping.address}
                onChange={(e) =>
                  updateFormData({ address: e.target.value })
                }
                required
              />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">{t.city}</Label>
              <Input
                id="city"
                value={shipping.city}
                onChange={(e) =>
                  updateFormData({ city: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="state">{t.state}</Label>
              <Input
                id="state"
                value={shipping.state}
                onChange={(e) =>
                  updateFormData({ state: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="zip">{t.zip}</Label>
              <Input
                id="zip"
                value={shipping.zip}
                onChange={(e) =>
                  updateFormData({ zip: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="country">{t.country}</Label>
              <Input
                id="country"
                value={shipping.country}
                onChange={(e) =>
                  updateFormData({ country: e.target.value })
                }
                required
              />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveAddress"
              checked={saveAddress}
              onCheckedChange={(checked) => updateFormData(undefined, undefined, !!checked)}
            />
            <Label htmlFor="saveAddress" className="text-sm font-normal cursor-pointer">
              {t.saveAddressForFuture}
            </Label>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

