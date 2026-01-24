import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { OrderShippingInfoProps } from "@/types/order";

export function OrderShippingInfo({
  shippingAddress,
  trackingNumber,
}: OrderShippingInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="font-semibold mb-1">
            {shippingAddress.firstName} {shippingAddress.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            {shippingAddress.address}
          </p>
          <p className="text-sm text-muted-foreground">
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
          </p>
          <p className="text-sm text-muted-foreground">
            {shippingAddress.country}
          </p>
          {shippingAddress.phone && (
            <p className="text-sm text-muted-foreground mt-2">
              Phone: {shippingAddress.phone}
            </p>
          )}
        </div>
        {trackingNumber && (
          <div className="pt-4 border-t">
            <p className="text-sm font-semibold mb-1">Tracking Number</p>
            <p className="text-sm text-muted-foreground">{trackingNumber}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

