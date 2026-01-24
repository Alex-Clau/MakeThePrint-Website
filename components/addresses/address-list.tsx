"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, MapPin } from "lucide-react";
import { AddressListProps, Address } from "@/types/address-components";

export function AddressList({
  addresses,
  onEdit,
  onDelete,
}: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <Card className="p-12 text-center">
        <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">No addresses saved</h2>
        <p className="text-muted-foreground">
          Add your first shipping address to get started
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {addresses.map((address, index) => (
        <Card key={index}>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-2 mb-4">
              <p className="font-semibold text-lg">
                {address.firstName} {address.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                {address.address}
              </p>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.state} {address.zip}
              </p>
              <p className="text-sm text-muted-foreground">{address.country}</p>
              {address.phone && (
                <p className="text-sm text-muted-foreground">
                  Phone: {address.phone}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                onClick={() => onEdit(index, address)}
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 sm:h-10 text-xs sm:text-sm"
                onClick={() => onDelete(index)}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

