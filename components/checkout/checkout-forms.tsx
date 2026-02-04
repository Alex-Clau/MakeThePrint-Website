"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckoutFormsProps } from "@/types/checkout";
import {AddressFormData} from "@/types";

export function CheckoutForms({ onFormDataChange }: CheckoutFormsProps) {
  const [shipping, setShipping] = useState<AddressFormData>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
    phone: "",
  });
  const [email, setEmail] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);

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
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
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
              <Label htmlFor="lastName">Last Name</Label>
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
            <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  updateFormData(undefined, e.target.value);
                }}
                required
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                title="Please enter a valid email address"
              />
          </div>
          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
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
            <Label htmlFor="address">Address</Label>
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
              <Label htmlFor="city">City</Label>
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
              <Label htmlFor="state">State</Label>
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
              <Label htmlFor="zip">ZIP Code</Label>
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
            <Label htmlFor="country">Country</Label>
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
              Save this address for future orders
            </Label>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

